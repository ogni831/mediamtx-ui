// Field groups for the "Server" tab.
// Property names match the MediaMTX v1.21.2 Control API (GET /v3/config/global/get).
// Only fields actually returned by 1.21.2 are listed here so every rendered input
// has a defined value (FormItem picks the input type from the loaded value type).
const ServerGroups = [
    {
        name: 'General',
        storeKey: 'general',
        columns: [
            {
                name: 'Logging',
                props: ['logLevel', 'logDestinations', 'logFile', 'logStructured', 'sysLogPrefix']
            }, {
                name: 'I/O',
                props: ['udpMaxPayloadSize', 'udpReadBufferSize', 'readTimeout', 'writeTimeout', 'writeQueueSize', 'dumpPackets']
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
                    'hlsMuxerCloseAfter',
                    'hlsCDNSecret'
                ]
            }, {
                name: 'Security',
                props: [
                    'hlsEncryption',
                    'hlsServerKey',
                    'hlsServerCert',
                    'hlsAllowOrigins',
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
                    'rtspTransports',
                    'rtspAddress',
                    'rtspsAddress',
                    'rtpAddress',
                    'rtcpAddress',
                    'srtpAddress',
                    'srtcpAddress'
                ]
            }, {
                name: 'Multicast',
                props: [
                    'multicastIPRange',
                    'multicastRTPPort',
                    'multicastRTCPPort',
                    'multicastSRTPPort',
                    'multicastSRTCPPort'
                ]
            }, {
                name: 'Security',
                props: [
                    'rtspEncryption',
                    'rtspServerKey',
                    'rtspServerCert',
                    'rtspAuthMethods',
                    'rtspTrustedProxies'
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
                props: ['rtmpEncryption', 'rtmpServerKey', 'rtmpServerCert', 'rtmpTrustedProxies']
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
        name: 'MoQ',
        storeKey: 'moq',
        columns: [
            {
                name: 'Enabled',
                props: ['moq', 'moqHTTP2Address', 'moqHTTP3Address', 'moqQUICAddress']
            }, {
                name: 'Security',
                props: ['moqServerKey', 'moqServerCert', 'moqAllowOrigins', 'moqTrustedProxies']
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
                    'webrtcIPsFromInterfacesExcludeList',
                    'webrtcAdditionalHosts',
                    'webrtcHandshakeTimeout',
                    'webrtcTrackGatherTimeout',
                    'webrtcSTUNGatherTimeout',
                    'webrtcICEServers2']
            }, {
                name: 'Security',
                props: ['webrtcEncryption',
                    'webrtcServerKey',
                    'webrtcServerCert',
                    'webrtcAllowOrigins',
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
                    'apiAllowOrigins',
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
                    'pprofAllowOrigins',
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
                    'playbackAllowOrigins',
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
                    'metricsAllowOrigins',
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
                    'authHTTPAddress',
                    'authHTTPFingerprint'
                ]
            }, {
                name: 'JWT',
                props: [
                    'authJWTJWKS',
                    'authJWTClaimKey',
                    'authJWTJWKSFingerprint',
                    'authJWTIssuer',
                    'authJWTAudience'
                ]
            }, {
                name: 'Excludes',
                props: [
                    'authHTTPExclude',
                    'authJWTExclude'
                ]
            }
        ]
    }
];

export default ServerGroups;
