import Setting from "./Setting.js";

export default class ApiSettings extends Setting {
    constructor(settings) {
        super(settings, 'api');

        this.fields = [
            'api',
            'apiAddress',
            'apiEncryption',
            'apiServerKey',
            'apiServerCert',
            'apiAllowOrigins', 'apiAllowOrigin',
            'apiTrustedProxies'
        ];
    }
}
