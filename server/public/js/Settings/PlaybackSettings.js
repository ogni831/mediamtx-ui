import Setting from "./Setting.js";

export default class PlaybackSettings extends Setting {
    constructor(settings) {
        super(settings, 'playback');

        this.fields = [
            'playback',
            'playbackAddress',
            'playbackEncryption',
            'playbackServerKey',
            'playbackServerCert',
            'playbackAllowOrigins',
            'playbackTrustedProxies'
        ];
    }
}
