import MediamtxProxy from "./MediamtxProxy.js";

export default class MediamtxApiProxy extends MediamtxProxy {
    constructor(...args) {
        super(...args);

        // API surface of MediaMTX v1.21.2 (Control API v3).
        this.routes = [
            'GET /info',
            'POST /auth/jwks/refresh',

            'GET /config/global/get',
            'PATCH /config/global/patch',
            'GET /config/path-defaults/get',
            'PATCH /config/path-defaults/patch',

            'GET /config/paths/list',
            'GET /config/paths/get/:name',
            'POST /config/paths/add/:name',
            'PATCH /config/paths/patch/:name',
            'POST /config/paths/replace/:name',
            'DELETE /config/paths/delete/:name',

            'GET /paths/list',
            'GET /paths/get/:name',
            'GET /paths/forward-dests/list',
            'GET /paths/forward-dests/get',
            'GET /paths/static-sources/get/:name',

            'GET /hls/muxers/list',
            'GET /hls/muxers/get/:name',
            'GET /hls/sessions/list',
            'GET /hls/sessions/get/:id',
            'POST /hls/sessions/kick/:id',

            'GET /rtsp/conns/list',
            'GET /rtsp/conns/get/:id',
            'GET /rtsp/sessions/list',
            'GET /rtsp/sessions/get/:id',
            'POST /rtsp/sessions/kick/:id',

            'GET /rtsps/conns/list',
            'GET /rtsps/conns/get/:id',
            'GET /rtsps/sessions/list',
            'GET /rtsps/sessions/get/:id',
            'POST /rtsps/sessions/kick/:id',

            'GET /rtmp/conns/list',
            'GET /rtmp/conns/get/:id',
            'POST /rtmp/conns/kick/:id',

            'GET /rtmps/conns/list',
            'GET /rtmps/conns/get/:id',
            'POST /rtmps/conns/kick/:id',

            'GET /srt/conns/list',
            'GET /srt/conns/get/:id',
            'POST /srt/conns/kick/:id',

            'GET /webrtc/sessions/list',
            'GET /webrtc/sessions/get/:id',
            'POST /webrtc/sessions/kick/:id',

            'GET /moq/sessions/list',
            'GET /moq/sessions/get/:id',
            'POST /moq/sessions/kick/:id',

            'GET /recordings/list',
            'GET /recordings/get/:name',
            'DELETE /recordings/segments/delete'
        ];

        this.router = this.express.Router();
        this._register();

    }
}