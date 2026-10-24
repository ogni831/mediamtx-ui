import Setting from "./Setting.js";

export default class RTSPSettings extends Setting {
    constructor(settings) {
        super(settings, 'rtsp');

        this.fields = [
            'rtsp',
            'rtspTransports',
            'rtspEncryption',
            'rtspAddress',
            'rtspsAddress',
            'rtpAddress',
            'rtcpAddress',
            'multicastIPRange',
            'multicastRTPPort',
            'multicastRTCPPort',
            'srtpAddress',
            'srtcpAddress',
            'multicastSRTPPort',
            'multicastSRTCPPort',
            'rtspTrustedProxies',
            'rtspServerKey',
            'rtspServerCert',
            'rtspAuthMethods'
        ];

        this.options = {
            rtspTransports: ['tcp', 'udp', 'multicast'],
            rtspEncryption: ['no', 'optional', 'strict'],
            rtspAuthMethods: ['basic', 'digest']
        };
    }
}
