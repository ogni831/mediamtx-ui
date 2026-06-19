import {MediamtxConfig} from './MediamtxConfig.js';
import MediamtxApiProxy from './MediamtxApiProxy.js';
import MediamtxMetricsProxy from "./MediamtxMetricsProxy.js";

export default class MediaMTX {
    constructor(app) {
        this.app = app;

        // Proxy Mediamtx API
        this.apiUrlBase = this.app.mediamtxApiUrlBase;
        this.metricsUrlBase = this.app.mediamtxMetricsUrlBase;

        // Mediamtx configuration management
        this.config = new MediamtxConfig(this);

        // Optional upstream Basic auth, used when the MediaMTX Control API has
        // authentication enabled (authInternalUsers). Set via env.
        const apiUser = process.env.MEDIAMTX_API_USER || false;
        const apiPassword = process.env.MEDIAMTX_API_PASSWORD || false;

        this.proxy = new MediamtxApiProxy(this, {
            targetBaseUrl: this.apiUrlBase,
            apiUser,
            apiPassword,

            // place to add your own gateway auth (API key, JWT, …) if needed
            beforeProxy: (req, res) => {
                return true;
            }
        });

        this.metrics = new MediamtxMetricsProxy(this, {
            targetBaseUrl: this.metricsUrlBase,
            apiUser,
            apiPassword,

            beforeProxy: (req, res) => {
                return true;
            }
        });



    }

    async getYaml() {
        return await this.config.getYaml();
    }

    async writeYaml() {
        return await this.config.writeYaml();
    }

}