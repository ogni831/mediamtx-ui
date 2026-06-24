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
            'rtspServerKey',
            'rtspServerCert',
            'rtspAuthMethods'
        ];

        this.options = {
            protocols: ['tcp', 'udp', 'multicast'],
            encryption: ['no', 'optional', 'strict'],
            rtspAuthMethods: ['basic', 'digest']
        };
    }
}
