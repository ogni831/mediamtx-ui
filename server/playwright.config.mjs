import {defineConfig} from "@playwright/test";

const PORT = 3050;
const MOCK_PORT = 19997;

export default defineConfig({
    testDir: "./e2e",
    timeout: 30000,
    fullyParallel: false,
    retries: 0,
    reporter: [["list"]],
    use: {
        baseURL: `http://127.0.0.1:${PORT}`,
        headless: true,
    },
    webServer: [
        {
            command: "node e2e/mock-mediamtx.mjs",
            env: {MOCK_PORT: String(MOCK_PORT)},
            url: `http://127.0.0.1:${MOCK_PORT}/v3/config/global/get`,
            reuseExistingServer: false,
            timeout: 15000,
        },
        {
            command: "node e2e/serve.mjs",
            env: {
                NODE_ENV: "development",
                SERVER_PORT: String(PORT),
                SESSION_SECRET: "e2e-secret",
                MEDIAMTX_API_URL_BASE: `http://127.0.0.1:${MOCK_PORT}/v3`,
                MEDIAMTX_METRICS_URL_BASE: `http://127.0.0.1:${MOCK_PORT}/metrics`,
            },
            url: `http://127.0.0.1:${PORT}/auth/status`,
            reuseExistingServer: false,
            timeout: 30000,
        },
    ],
});
