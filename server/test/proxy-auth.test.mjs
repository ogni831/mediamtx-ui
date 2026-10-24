// Proxy-auth mode (AUTH_DISABLED=true) must be fail-closed.
import {test, before, after} from "node:test";
import assert from "node:assert/strict";
import {spawn, spawnSync} from "node:child_process";
import {writeFileSync, mkdirSync, rmSync} from "node:fs";
import argon2 from "argon2";

const PORT = 3098;
const BASE = `http://127.0.0.1:${PORT}`;
const SECRET = "proxy-secret-0123456789abcdef";
const AUTH_PATH = "../config/auth.proxy-e2e.json";
const baseEnv = {...process.env, AUTH_CONFIG_PATH: AUTH_PATH, NODE_ENV: "development", SERVER_PORT: String(PORT), SESSION_SECRET: "ci-test-secret", AUTH_DISABLED: "true"};

let proc;

before(async () => {
    mkdirSync("../config", {recursive: true});
    const hash = await argon2.hash("admin");
    writeFileSync(AUTH_PATH, JSON.stringify({username: hash, password: hash}));

    proc = spawn("node", ["index.js"], {env: {...baseEnv, PROXY_AUTH_SECRET: SECRET}, stdio: ["ignore", "pipe", "pipe"]});
    await new Promise((resolve, reject) => {
        const t = setTimeout(() => reject(new Error("server start timeout")), 15000);
        proc.stdout.on("data", (d) => {
            if (String(d).includes("SERVER IS RUNNING")) {
                clearTimeout(t);
                resolve();
            }
        });
        proc.on("exit", (code) => reject(new Error("server exited early: " + code)));
    });
});

after(() => {
    proc?.kill();
    rmSync(AUTH_PATH, {force: true});
});

test("refuses to start without PROXY_AUTH_SECRET", () => {
    const r = spawnSync("node", ["index.js"], {env: {...baseEnv, SERVER_PORT: "3097"}, timeout: 15000});
    assert.notEqual(r.status, 0);
    assert.match(String(r.stderr), /PROXY_AUTH_SECRET/);
});

test("direct access without the proxy header is rejected", async () => {
    assert.equal((await fetch(`${BASE}/api/anything`)).status, 401);
    assert.equal((await (await fetch(`${BASE}/auth/status`)).json()).isAuthenticated, false);
});

test("wrong proxy header is rejected", async () => {
    const r = await fetch(`${BASE}/api/anything`, {headers: {"X-Proxy-Auth": "wrong"}});
    assert.equal(r.status, 401);
});

test("correct proxy header authenticates per request, not via session", async () => {
    const h = {"X-Proxy-Auth": SECRET};
    assert.equal((await (await fetch(`${BASE}/auth/status`, {headers: h})).json()).isAuthenticated, true);
    assert.notEqual((await fetch(`${BASE}/api/anything`, {headers: h})).status, 401);
    // no session persisted: same client without the header is still unauthenticated
    assert.equal((await fetch(`${BASE}/api/anything`)).status, 401);
});
