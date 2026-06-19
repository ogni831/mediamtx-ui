import express from "express";
import {URL} from "url";

export default class MediamtxProxy {
    /**
     * @param {Object} options
     * @param {string} options.targetBaseUrl
     * @param {string} [options.apiUser]        - MediaMTX API-User
     * @param {string} [options.apiPassword]    - MediaMTX API-Passwort
     * @param {Function} [options.beforeProxy]  - optionaler Hook: (req, res) => boolean | Promise<boolean>
     */
    constructor(server, {targetBaseUrl, apiUser = null, apiPassword = null, beforeProxy = null}) {
        if (!targetBaseUrl) throw new Error("targetBaseUrl fehlt.");

        this.server = server;
        this.targetBaseUrl = targetBaseUrl.replace(/\/$/, "");
        this.beforeProxy = beforeProxy;

        this.basicAuthHeader = null;
        if (apiUser && apiPassword) {
            const token = Buffer.from(`${apiUser}:${apiPassword}`).toString("base64");
            this.basicAuthHeader = `Basic ${token}`;
        }

        this.express = express;
        this.routes = []; // filled by child classes
    }

    /**
     * Proxy-Handler
     */
    async _proxy(req, res) {
        const targetUrl = new URL(`${this.targetBaseUrl}${req.path}`);

        // Query anhängen
        for (const [k, v] of Object.entries(req.query)) {
            targetUrl.searchParams.set(k, v);
        }

        // Abort the upstream request if MediaMTX is slow/hung so requests
        // don't pile up. Tunable via MEDIAMTX_PROXY_TIMEOUT_MS.
        const timeoutMs = Number(process.env.MEDIAMTX_PROXY_TIMEOUT_MS) || 10000;
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);

        try {
            if (this.beforeProxy) {
                const ok = await this.beforeProxy(req, res);
                if (!ok) return; // hook already sent the error response
            }

            const headers = {};

            if (this.basicAuthHeader) {
                headers["Authorization"] = this.basicAuthHeader;
            }

            if (req.headers["content-type"]) {
                headers["content-type"] = req.headers["content-type"];
            }

            const fetchOptions = {
                method: req.method,
                headers,
                signal: controller.signal,
            };

            // forward the body when present
            if (["POST", "PATCH", "PUT"].includes(req.method)) {
                fetchOptions.body = JSON.stringify(req.body);
            }

            const response = await fetch(targetUrl, fetchOptions);
            const text = await response.text();

            try {
                return res.status(response.status).json(JSON.parse(text));
            } catch {
                return res.status(response.status).send(text);
            }

        } catch (err) {
            // Log details server-side; never echo the raw error object to the client.
            console.error("Proxy error:", targetUrl.href, err?.message ?? err);
            const detail = err?.name === "AbortError" ? "upstream timeout" : "upstream unreachable";
            return res.status(502).json({error: "Bad Gateway", detail});
        } finally {
            clearTimeout(timer);
        }
    }

    /**
     * Registrierung aller MediaMTX-API-Routen
     */
    _register() {
        const r = this.router;

        //r.use(express.json({ limit: "10mb" }));

        for (const entry of this.routes) {
            const [method, path] = entry.split(" ");
            r[method.toLowerCase()](path, this._proxy.bind(this));
        }
    }
}
