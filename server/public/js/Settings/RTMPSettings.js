import Setting from "./Setting.js";

export default class RTMPSettings extends Setting {
    constructor(settings) {
        super(settings, 'rtmp');

        this.fields = [
            'rtmp',
            'rtmpAddress',
            'rtmpEncryption',
            'rtmpsAddress',
            'rtmpServerKey',
            'rtmpServerCert'
        ];

        this.options = {
            rtmpEncryption: ['no', 'optional', 'strict']
        };
    }
}
