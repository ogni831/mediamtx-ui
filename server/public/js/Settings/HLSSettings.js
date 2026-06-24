import Setting from "./Setting.js";

export default class HLSSettings extends Setting {
    constructor(settings) {
        super(settings, 'hls');

        this.fields = [
            'hls',
            'hlsAddress',
            'hlsEncryption',
            'hlsServerKey',
            'hlsServerCert',
            'hlsAllowOrigins', 'hlsAllowOrigin',
            'hlsTrustedProxies',
            'hlsAlwaysRemux',
            'hlsVariant',
            'hlsSegmentCount',
            'hlsSegmentDuration',
            'hlsPartDuration',
            'hlsSegmentMaxSize',
            'hlsDirectory',
            'hlsMuxerCloseAfter'
        ];

        this.options = {
            hlsVariant: ['lowLatency', 'mpegts', 'fmp4']
        };
    }
}
