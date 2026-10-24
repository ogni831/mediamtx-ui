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
            'webrtcAllowOrigins',
            'webrtcTrustedProxies',
            'webrtcLocalUDPAddress',
            'webrtcLocalTCPAddress',
            'webrtcIPsFromInterfaces',
            'webrtcIPsFromInterfacesList',
            'webrtcAdditionalHosts',
            'webrtcHandshakeTimeout',
            'webrtcTrackGatherTimeout',
            'webrtcSTUNGatherTimeout',
            'webrtcIPsFromInterfacesExcludeList',
            'webrtcICEServers2'
        ];

        // list of objects (url, username, password, clientOnly) -> edited as JSON
        this.inputType = {
            webrtcICEServers2: 'JsonInput'
        };
    }
}
