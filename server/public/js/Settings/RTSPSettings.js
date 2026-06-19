import Setting from "./Setting.js";

export default class RTSPSettings extends Setting {
    constructor(settings) {
        super(settings, 'rtsp');

        this.fields = [
            'rtsp',
            'protocols',
            'encryption',
            'rtspAddress',
            'rtspsAddress',
            'rtpAddress',
            'rtcpAddress',
            'multicastIPRange',
            'multicastRTPPort',
            'multicastRTCPPort',
            'serverKey',
            'serverCert',
            'rtspAuthMethods'
        ];

        this.options = {
            protocols: ['tcp', 'udp', 'multicast'],
            encryption: ['no', 'optional', 'strict'],
            rtspAuthMethods: ['basic', 'digest']
        };
    }
}
