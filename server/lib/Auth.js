/**
 * generate an argon2 hash for a password:
 *
 * node generate_auth.js
 *
 */

import {readJson, readJsonSync, writeJson} from "fs-extra/esm";
import argon2 from "argon2"

export default class Auth {
    constructor(app) {
        this.label = this.constructor.name.toUpperCase();
        this.app = app;
        this.configFilePath = '../config/auth.json';
        this.auth = readJsonSync(this.configFilePath);
    }

    async readAuth() {
        const auth = await readJson(this.configFilePath);
        console.log(auth);
    }

    /**
     * Refuse to start (in production) when the shipped default credentials
     * (admin / admin) are still in place (M2). Warns loudly in development.
     */
    async assertNotDefault() {
        let isDefault = false;
        try {
            isDefault = await argon2.verify(this.auth.username, 'admin')
                && await argon2.verify(this.auth.password, 'admin');
        } catch {
            isDefault = false; // hash not argon2 / unreadable → not the default
        }

        if (!isDefault)
            return;

        const msg = 'Default credentials (admin/admin) are still active. '
            + 'Generate a new hash: `node generate_auth.js` and update config/auth.json.';

        if (process.env.NODE_ENV === 'production')
            throw new Error('Refusing to start: ' + msg);

        console.warn('SECURITY WARNING: ' + msg);
    }

    async writeAuth(auth) {
        await writeJson(this.configFilePath, auth, {spaces: 2});
        this.auth = auth;
    }

    async login(req, res) {
        const {username, password} = req.body;

        if (!username || !password)
            return false;

        if (!await argon2.verify(this.auth.username, username))
            return false;

        if (!await argon2.verify(this.auth.password, password))
            return false;

        // Regenerate the session id on this privilege change to prevent
        // session fixation (the pre-login session id must not survive login).
        await new Promise((resolve, reject) =>
            req.session.regenerate(err => err ? reject(err) : resolve())
        );

        req.session.isAuthenticated = true;
        return true;
    }


    async logout(req, res) {
        if (!req.session.isAuthenticated)
            return;

        const cookieSecure = process.env.SESSION_COOKIE_SECURE !== undefined
            ? process.env.SESSION_COOKIE_SECURE === "true"
            : process.env.NODE_ENV === "production";

        req.session.destroy(err => {
            if (err) return res.sendStatus(500);

            res.clearCookie("sid", {
                httpOnly: true,
                sameSite: "lax",
                secure: cookieSecure,
                path: "/"
            });

            res.sendStatus(204);
        });
    }
}