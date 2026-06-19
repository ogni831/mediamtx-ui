import MediamtxProxy from "./MediamtxProxy.js";

export default class MediamtxApiProxy extends MediamtxProxy {
    constructor(...args) {
        super(...args);

        // API surface of MediaMTX v1.9.3 (Control API v3).
        // Note: v1.9.3 has no `/info` and no `/auth/jwks/refresh` endpoints
        // (those were added in later releases), so they are intentionally absent.
        this.routes = [
            'GET /config/global/get',
            'PATCH /config/global/patch',
            'GET /config/pathdefaults/get',
            'PATCH /config/pathdefaults/patch',

            'GET /config/paths/list',
            'GET /config/paths/get/:name',
            'POST /config/paths/add/:name',
            'PATCH /config/paths/patch/:name',
            'POST /config/paths/replace/:name',
            'DELETE /config/paths/delete/:name',

            'GET /paths/list',
            'GET /paths/get/:name',

            'GET /hlsmuxers/list',
            'GET /hlsmuxers/get/:name',

            'GET /rtspconns/list',
            'GET /rtspconns/get/:id',
            'GET /rtspsessions/list',
            'GET /rtspsessions/get/:id',
            'POST /rtspsessions/kick/:id',

            'GET /rtspsconns/list',
            'GET /rtspsconns/get/:id',
            'GET /rtspssessions/list',
            'GET /rtspssessions/get/:id',
            'POST /rtspssessions/kick/:id',

            'GET /rtmpconns/list',
            'GET /rtmpconns/get/:id',
            'POST /rtmpconns/kick/:id',

            'GET /rtmpsconns/list',
            'GET /rtmpsconns/get/:id',
            'POST /rtmpsconns/kick/:id',

            'GET /srtconns/list',
            'GET /srtconns/get/:id',
            'POST /srtconns/kick/:id',

            'GET /webrtcsessions/list',
            'GET /webrtcsessions/get/:id',
            'POST /webrtcsessions/kick/:id',

            'GET /recordings/list',
            'GET /recordings/get/:name',
            'DELETE /recordings/deletesegment'
        ];

        this.router = this.express.Router();
        this._register();

    }
}