// Smoke test: boots the real server and exercises the auth flow end-to-end.
// Run: npm test   (node --test)
import {test, before, after} from "node:test";
import assert from "node:assert/strict";
import {spawn} from "node:child_process";
import {writeFileSync, readFileSync, mkdirSync, rmSync, existsSync} from "node:fs";
import argon2 from "argon2";

const PORT = 3099;
const BASE = `http://127.0.0.1:${PORT}`;
const AUTH_PATH = "../config/auth.json";

let proc;
let authBackup = null;

const firstCookie = (res) => {
    const cookies = res.headers.getSetCookie?.() ?? [];
    return cookies.length ? cookies[0].split(";")[0] : null;
};

before(async () => {
    // config/ is gitignored; provision a known admin/admin auth.json
    mkdirSync("../config", {recursive: true});
    if (existsSync(AUTH_PATH)) authBackup = readFileSync(AUTH_PATH);
    const hash = await argon2.hash("admin");
    writeFileSync(AUTH_PATH, JSON.stringify({username: hash, password: hash}, null, 2));

    proc = spawn("node", ["index.js"], {
        env: {...process.env, NODE_ENV: "development", SERVER_PORT: String(PORT), SESSION_SECRET: "ci-test-secret"},
        stdio: ["ignore", "pipe", "pipe"],
    });

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
    if (authBackup) writeFileSync(AUTH_PATH, authBackup);
    else rmSync(AUTH_PATH, {force: true});
});

test("unauthenticated API returns 401", async () => {
    const r = await fetch(`${BASE}/api/anything`);
    assert.equal(r.status, 401);
});

test("static index is served", async () => {
    const r = await fetch(`${BASE}/`);
    assert.equal(r.status, 200);
});

test("CSRF + login + status flow", async () => {
    const csrfRes = await fetch(`${BASE}/auth/csrf`);
    assert.equal(csrfRes.status, 200);
    const cookie = firstCookie(csrfRes);
    const {csrfToken} = await csrfRes.json();
    assert.ok(csrfToken, "csrf token present");

    const loginRes = await fetch(`${BASE}/auth/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json", "CSRF-Token": csrfToken, "Cookie": cookie},
        body: JSON.stringify({username: "admin", password: "admin"}),
    });
    assert.equal(loginRes.status, 200);

    // session id is regenerated on login → use the new cookie
    const authedCookie = firstCookie(loginRes) ?? cookie;
    const statusRes = await fetch(`${BASE}/auth/status`, {headers: {"Cookie": authedCookie}});
    const status = await statusRes.json();
    assert.equal(status.isAuthenticated, true);
});

test("login without CSRF token is rejected (403)", async () => {
    const csrfRes = await fetch(`${BASE}/auth/csrf`);
    const cookie = firstCookie(csrfRes);
    const r = await fetch(`${BASE}/auth/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json", "Cookie": cookie},
        body: JSON.stringify({username: "admin", password: "admin"}),
    });
    assert.equal(r.status, 403);
});

test("wrong password is rejected (401)", async () => {
    const csrfRes = await fetch(`${BASE}/auth/csrf`);
    const cookie = firstCookie(csrfRes);
    const {csrfToken} = await csrfRes.json();
    const r = await fetch(`${BASE}/auth/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json", "CSRF-Token": csrfToken, "Cookie": cookie},
        body: JSON.stringify({username: "admin", password: "nope"}),
    });
    assert.equal(r.status, 401);
});
