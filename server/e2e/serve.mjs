// e2e server wrapper: starts the app pointed at a throwaway auth file
// (AUTH_CONFIG_PATH) seeded with admin/admin, so the developer's real
// config/auth.json is never touched.
import {spawn} from "child_process";
import {writeFileSync, rmSync, mkdirSync} from "fs";
import argon2 from "argon2";

const AUTH = "../config/auth.e2e.json";

mkdirSync("../config", {recursive: true});
const hash = await argon2.hash("admin");
writeFileSync(AUTH, JSON.stringify({username: hash, password: hash}, null, 2));

const child = spawn("node", ["index.js"], {
    stdio: "inherit",
    env: {...process.env, AUTH_CONFIG_PATH: AUTH},
});

const cleanup = () => {
    try { rmSync(AUTH, {force: true}); } catch { /* ignore */ }
};
const shutdown = () => {
    try { child.kill(); } catch { /* ignore */ }
    cleanup();
    process.exit(0);
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
child.on("exit", (code) => {
    cleanup();
    process.exit(code ?? 0);
});
