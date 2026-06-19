import Setting from "./Setting.js";

export default class PPROFSettings extends Setting {
    constructor(settings) {
        super(settings, 'pprof');

        this.fields = [
            'pprof',
            'pprofAddress',
            'pprofEncryption',
            'pprofServerKey',
            'pprofServerCert',
            'pprofAllowOrigin',
            'pprofTrustedProxies'
        ];
    }
}
