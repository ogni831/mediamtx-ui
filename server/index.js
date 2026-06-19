import path from "path";

import Events from './lib/EventEmitter.js';
import MediaMTX from './lib/MediaMTX.js';
import Server from "./lib/Server.js";
import Auth from "./lib/Auth.js";

export default class Main extends Events {
    constructor() {
        super();
        this.__dirname = process.cwd();
        this.dataDir = path.join(this.__dirname, "../data");
        this.publicDir = path.join(this.__dirname, "public");

        this.mediamtxApiUrlBase = process.env['MEDIAMTX_API_URL_BASE'] ?? `http://mediamtx:9997/v3`;
        this.mediamtxMetricsUrlBase = process.env['MEDIAMTX_METRICS_URL_BASE'] ?? `http://mediamtx:9998/metrics`;

        // Graceful shutdown on both Ctrl+C (SIGINT) and `docker stop` (SIGTERM).
        const shutdown = (signal) => {
            console.log(`Received ${signal}, shutting down…`);
            process.exit(0);
        };
        process.on('SIGINT', () => shutdown('SIGINT'));
        process.on('SIGTERM', () => shutdown('SIGTERM'));

        this.auth = new Auth(this);
        this.mediamtx = new MediaMTX(this);
        this.server = new Server(this);
    }

    async run() {
        try {
            await this.server.run();
        } catch (err) {
            console.error('Failed to start:', err?.message ?? err);
            process.exit(1);
        }
    }
}

const CameraApp = new Main();
CameraApp.run();
