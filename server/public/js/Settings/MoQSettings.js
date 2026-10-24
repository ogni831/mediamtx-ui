import Setting from "./Setting.js";

export default class MoQSettings extends Setting {
    constructor(settings) {
        super(settings, 'moq');

        this.fields = [
            'moq',
            'moqHTTP2Address',
            'moqHTTP3Address',
            'moqQUICAddress',
            'moqServerKey',
            'moqServerCert',
            'moqAllowOrigins',
            'moqTrustedProxies'
        ];
    }
}
