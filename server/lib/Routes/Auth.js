import express from "express";
import rateLimit from "express-rate-limit";

export default class AuthRoutes {
    constructor(server) {
        this.server = server;
        this.app = this.server.app;
        this.auth = this.app.auth;

        this.router = express.Router();
        this.csrfProtection = this.server.csrfProtection;
        this.generateCsrfToken = this.server.generateCsrfToken;

        // Brute-force protection for the login endpoint (M3).
        const loginLimiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 10,                  // 10 attempts per window per IP
            standardHeaders: true,
            legacyHeaders: false,
            message: {error: "too_many_attempts", message: "Too many login attempts. Try again later."},
        });

        // get CSRF token (synchroniser token stored in the session)
        this.router.get("/csrf", (req, res) => {
            res.json({csrfToken: this.generateCsrfToken(req)});
        });

        // login
        this.router.post("/login", loginLimiter, this.csrfProtection, async (req, res) => {

            if (!await this.auth.login(req, res))
                return res.sendStatus(401);

            res.json({
                ok: true
            });
        });

        // logout
        this.router.post("/logout", this.csrfProtection, async (req, res) => {
            await this.auth.logout(req, res);
            res.json({ok: true});
        });

        //
        this.router.get("/status", (req, res) => {
            res.json({
                isAuthenticated: req.session?.isAuthenticated || false
            });
        });
    }
}
