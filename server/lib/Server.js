import crypto from "crypto";
import express from "express";
import session from "express-session";
import {csrfSync} from "csrf-sync";
import FileStoreFactory from "session-file-store";

import Events from './EventEmitter.js';
import AuthRoutes from "./Routes/Auth.js";

export default class Server extends Events {
    constructor(app) {
        super();

        this.app = app;
        this.mediamtx = this.app.mediamtx;
        this.publicDir = this.app.publicDir;
        this.dataDir = this.app.dataDir;

        this.port = process.env.SERVER_PORT || 3000;

        const isProd = process.env.NODE_ENV === "production";

        // --- Session secret (H1) -------------------------------------------
        // Never ship a shared, hardcoded secret: anyone with the source could
        // forge a session cookie and bypass auth. Require it in production;
        // in dev fall back to an ephemeral random secret (sessions reset on
        // restart, but no two installs share a guessable key).
        let sessionSecret = process.env.SESSION_SECRET;
        if (!sessionSecret) {
            if (isProd)
                throw new Error("SESSION_SECRET is required in production. Generate one with: openssl rand -hex 32");
            sessionSecret = crypto.randomBytes(32).toString("hex");
            console.warn("SESSION_SECRET not set — using an ephemeral random secret (dev only).");
        }

        // --- Cookie "secure" flag (M7) -------------------------------------
        // Defaults to true in production. Override with SESSION_COOKIE_SECURE
        // (e.g. "false" when running behind a plain-HTTP LAN reverse proxy,
        // or "true" when TLS terminates upstream and trust proxy is set).
        const cookieSecure = process.env.SESSION_COOKIE_SECURE !== undefined
            ? process.env.SESSION_COOKIE_SECURE === "true"
            : isProd;

        this.engine = express();
        this.engine.use(express.json());

        this.engine.use(express.static(this.publicDir));

        this.engine.set("trust proxy", 1);

        // --- Session store (M4) --------------------------------------------
        // MemoryStore leaks memory and is single-process only; use a file-backed
        // store in production so sessions survive restarts.
        let store;
        if (isProd) {
            const FileStore = FileStoreFactory(session);
            store = new FileStore({
                path: process.env.SESSION_STORE_PATH || "/tmp/mediamtx-ui-sessions",
                ttl: 60 * 60 * 8,
                retries: 1,
                logFn: () => {},
            });
        }

        this.engine.use(session({
            name: "sid",
            secret: sessionSecret,
            resave: false,
            saveUninitialized: false,
            store,
            cookie: {
                httpOnly: true,
                sameSite: "lax",
                secure: cookieSecure,
                path: "/"
            }
        }));

        // --- CSRF (M5) ------------------------------------------------------
        // csurf is archived/deprecated; csrf-sync is the maintained
        // synchroniser-token equivalent (token stored in the session, sent
        // back via the CSRF-Token header).
        const {csrfSynchronisedProtection, generateToken, invalidCsrfTokenError} = csrfSync({
            getTokenFromRequest: (req) => req.headers["csrf-token"],
        });
        this.csrfProtection = csrfSynchronisedProtection;
        this.generateCsrfToken = generateToken;
        this._invalidCsrfTokenError = invalidCsrfTokenError;

        // Auth-bypass для довіреного reverse-proxy деплою: коли AUTH_DISABLED=true,
        // кожен запит вважається автентифікованим (власна форма логіну не
        // показується). Призначено для роботи ЗА nginx з auth_basic перед
        // /mediamtx-ui/ (як Frigate/YOLO) — зовнішній proxy і є межею auth.
        if (process.env.AUTH_DISABLED === 'true') {
            this.engine.use((req, res, next) => {
                if (req.session && !req.session.isAuthenticated) {
                    req.session.isAuthenticated = true;
                }
                next();
            });
        }

        // authentication
        this.authRoutes = new AuthRoutes(this);
        this.engine.use('/auth', this.authRoutes.router);

        // require authentication for all other routes
        this.engine.use((req, res, next) => {
            if (!req.session?.isAuthenticated) {
                return res.sendStatus(401);
            }
            next();
        });

        // CSRF-protect state-changing requests to the proxy and API routers
        // (csrfSynchronisedProtection ignores GET/HEAD/OPTIONS, so reads pass
        // through; all mutating frontend calls send the CSRF-Token header).
        this.engine.use(this.csrfProtection);

        // Mediamtx API Proxy
        this.engine.use('/mediamtx', this.mediamtx.proxy.router);
        this.engine.use('/mediamtx/metrics', this.mediamtx.metrics.router);

        // csrf error handling
        this.engine.use((err, req, res, next) => {
            if (err === this._invalidCsrfTokenError || err?.code === 'EBADCSRFTOKEN') {
                return res.status(403).json({
                    error: "Invalid CSRF token",
                    message: "reload page or refresh token."
                });
            }
            next(err);
        });
    }

    async run() {
        // refuse to start (in production) if the admin credentials are still
        // the shipped default (M2)
        await this.app.auth.assertNotDefault();

        await this.engine.listen(this.port, () => {
            console.log(`SERVER IS RUNNING ON PORT `.padEnd(30, '.'), this.port);
        });
    }
}
