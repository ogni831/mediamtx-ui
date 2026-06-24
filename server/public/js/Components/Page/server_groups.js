// Field groups for the "Server" tab.
// Property names match the MediaMTX v1.19.1 Control API (GET /v3/config/global/get).
// Only fields actually returned by 1.19.1 are listed here so every rendered input
// has a defined value (FormItem picks the input type from the loaded value type).
const ServerGroups = [
    {
        name: 'General',
        storeKey: 'general',
        columns: [
            {
                name: 'Logging',
                props: ['logLevel', 'logDestinations', 'logFile']
            }, {
                name: 'I/O',
                props: ['udpMaxPayloadSize', 'readTimeout', 'writeTimeout', 'writeQueueSize']
            }, {
                name: 'Hooks',
                props: ['runOnConnect', 'runOnConnectRestart', 'runOnDisconnect']
            }
        ]
    },
    {
        name: 'HLS',
        storeKey: 'hls',
        columns: [
            {
                name: 'Enabled',
                props: ['hls', 'hlsAddress']
            }, {
                name: 'Settings',
                props: [
                    'hlsAlwaysRemux',
                    'hlsVariant',
                    'hlsSegmentCount',
                    'hlsSegmentDuration',
                    'hlsPartDuration',
                    'hlsSegmentMaxSize',
                    'hlsDirectory',
                    'hlsMuxerCloseAfter'
                ]
            }, {
                name: 'Security',
                props: [
                    'hlsEncryption',
                    'hlsServerKey',
                    'hlsServerCert',
                    'hlsAllowOrigins', 'hlsAllowOrigin',
                    'hlsTrustedProxies'
                ]
            }
        ]
    },
    {
        name: 'RTSP',
        storeKey: 'rtsp',
        columns: [
            {
                name: 'Enabled',
                props: [
                    'rtsp',
                    'rtspTransports', 'protocols',
                    'rtspAddress',
                    'rtspsAddress',
                    'rtpAddress',
                    'rtcpAddress'
                ]
            }, {
                name: 'Multicast',
                props: [
                    'multicastIPRange',
                    'multicastRTPPort',
                    'multicastRTCPPort'
                ]
            }, {
                name: 'Security',
                props: [
                    'rtspEncryption', 'encryption',
                    'rtspServerKey', 'serverKey',
                    'rtspServerCert', 'serverCert',
                    'rtspAuthMethods'
                ]
            }
        ]
    },
    {
        name: 'RTMP',
        storeKey: 'rtmp',
        columns: [
            {
                name: 'Enabled',
                props: ['rtmp', 'rtmpAddress', 'rtmpsAddress']
            }, {
                name: 'Security',
                props: ['rtmpEncryption', 'rtmpServerKey', 'rtmpServerCert']
            }
        ]
    },
    {
        name: 'SRT',
        storeKey: 'srt',
        columns: [
            {
                name: 'Enabled',
                props: ['srt', 'srtAddress']
            }
        ]
    },
    {
        name: 'WebRTC',
        storeKey: 'webrtc',
        columns: [
            {
                name: 'Enabled',
                props: ['webrtc', 'webrtcAddress',
                    'webrtcLocalUDPAddress', 'webrtcLocalTCPAddress']
            }, {
                name: 'Settings',
                props: ['webrtcIPsFromInterfaces',
                    'webrtcIPsFromInterfacesList',
                    'webrtcAdditionalHosts',
                    'webrtcHandshakeTimeout',
                    'webrtcTrackGatherTimeout']
            }, {
                name: 'Security',
                props: ['webrtcEncryption',
                    'webrtcServerKey',
                    'webrtcServerCert',
                    'webrtcAllowOrigins', 'webrtcAllowOrigin',
                    'webrtcTrustedProxies']
            }
        ]
    },
    {
        name: 'API',
        storeKey: 'api',
        columns: [
            {
                name: 'Enabled',
                props: ['api', 'apiAddress']
            }, {
                name: 'Security',
                props: [
                    'apiEncryption',
                    'apiServerKey',
                    'apiServerCert',
                    'apiAllowOrigins', 'apiAllowOrigin',
                    'apiTrustedProxies'
                ]
            }
        ]
    },
    {
        name: 'PPROF',
        storeKey: 'pprof',
        columns: [
            {
                name: 'Enabled',
                props: ['pprof', 'pprofAddress']
            }, {
                name: 'Security',
                props: [
                    'pprofEncryption',
                    'pprofServerKey',
                    'pprofServerCert',
                    'pprofAllowOrigins', 'pprofAllowOrigin',
                    'pprofTrustedProxies'
                ]
            }
        ]
    },
    {
        name: 'Playback',
        storeKey: 'playback',
        columns: [
            {
                name: 'Enabled',
                props: ['playback', 'playbackAddress']
            }, {
                name: 'Security',
                props: [
                    'playbackEncryption',
                    'playbackServerKey',
                    'playbackServerCert',
                    'playbackAllowOrigins', 'playbackAllowOrigin',
                    'playbackTrustedProxies'
                ]
            }
        ]
    },
    {
        name: 'Metrics',
        storeKey: 'metrics',
        columns: [
            {
                name: 'Enabled',
                props: ['metrics', 'metricsAddress']
            }, {
                name: 'Security',
                props: [
                    'metricsEncryption',
                    'metricsServerKey',
                    'metricsServerCert',
                    'metricsAllowOrigins', 'metricsAllowOrigin',
                    'metricsTrustedProxies'
                ]
            }
        ]
    },
    {
        name: 'Authentication',
        storeKey: 'auth',
        columns: [
            {
                name: 'Connection',
                props: [
                    'authMethod',
                    'authHTTPAddress'
                ]
            }, {
                name: 'JWT',
                props: [
                    'authJWTJWKS',
                    'authJWTClaimKey'
                ]
            }, {
                name: 'Excludes',
                props: [
                    'authHTTPExclude'
                ]
            }
        ]
    }
];

export default ServerGroups;
