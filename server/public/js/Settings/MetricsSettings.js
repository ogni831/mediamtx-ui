import Setting from "./Setting.js";

export default class MetricsSettings extends Setting {
    constructor(settings) {
        super(settings, 'metrics');

        this.fields = [
            'metrics',
            'metricsAddress',
            'metricsEncryption',
            'metricsServerKey',
            'metricsServerCert',
            'metricsAllowOrigins',
            'metricsTrustedProxies'
        ];
    }
}
