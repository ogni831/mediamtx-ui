import Setting from "./Setting.js";

export default class WebRTCSettings extends Setting {
    constructor(settings) {
        super(settings, 'webrtc');

        this.fields = [
            'webrtc',
            'webrtcAddress',
            'webrtcEncryption',
            'webrtcServerKey',
            'webrtcServerCert',
            'webrtcAllowOrigin',
            'webrtcTrustedProxies',
            'webrtcLocalUDPAddress',
            'webrtcLocalTCPAddress',
            'webrtcIPsFromInterfaces',
            'webrtcIPsFromInterfacesList',
            'webrtcAdditionalHosts',
            'webrtcHandshakeTimeout',
            'webrtcTrackGatherTimeout'
        ];
    }
}
