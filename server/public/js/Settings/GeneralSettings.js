import Setting from "./Setting.js";

export default class GeneralSettings extends Setting {
    constructor(settings) {
        super(settings, 'general');

        this.fields = [
            'logLevel',
            'logDestinations',
            'logFile',
            'logStructured',
            'sysLogPrefix',
            'dumpPackets',
            'udpReadBufferSize',
            'readTimeout',
            'writeTimeout',
            'writeQueueSize',
            'udpMaxPayloadSize',
            'runOnConnect',
            'runOnConnectRestart',
            'runOnDisconnect'
        ];

        this.options = {
            logLevel: ['debug', 'info', 'warn', 'error'],
            logDestinations: ['stdout', 'file', 'syslog']
        };
    }
}
