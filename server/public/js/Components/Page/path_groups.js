// Field groups for path defaults and per-path editing.
// Property names match the MediaMTX v1.21.2 Control API (GET /v3/config/path-defaults/get).
const PathGroups = [
    {
        name: 'Source',
        storeKey: 'source',
        columns: [
            {
                name: 'Source',
                props: [
                    'source',
                    'sourceRedirect',
                    'sourceFingerprint',
                    'sourceOnDemand',
                    'sourceOnDemandStartTimeout',
                    'sourceOnDemandCloseAfter'
                ]
            }, {
                name: 'I/O',
                props: [
                    'maxReaders',
                    'useAbsoluteTimestamp',
                    'srtReadPassphrase',
                    'overridePublisher',
                    'srtPublishPassphrase'
                ]
            }, {
                name: 'WHEP',
                props: [
                    'whepBearerToken',
                    'whepHandshakeTimeout',
                    'whepSTUNGatherTimeout',
                    'whepTrackGatherTimeout'
                ]
            }, {
                name: 'Forward',
                props: ['moqTransport', 'forward']
            }
        ]
    }, {
        name: 'Always available',
        storeKey: 'alwaysAvailable',
        columns: [
            {
                name: 'Fallback stream',
                props: [
                    'alwaysAvailable',
                    'alwaysAvailableFile',
                    'alwaysAvailableRecorded',
                    'alwaysAvailableTracks'
                ]
            }
        ]
    }, {
        name: 'Recording',
        storeKey: 'recording',
        columns: [
            {
                name: 'Enabled',
                props: ['record', 'recordPath', 'recordFormat']
            }, {
                name: 'Segments',
                props: [
                    'recordPartDuration',
                    'recordSegmentDuration',
                    'recordDeleteAfter',
                    'recordMaxPartSize'
                ]
            }
        ]
    }, {
        name: 'RTSP',
        storeKey: 'rtsp',
        columns: [
            {
                name: 'RTSP source',
                props: [
                    'rtspTransport',
                    'rtspAnyPort',
                    'rtspRangeType',
                    'rtspRangeStart',
                    'rtspDemuxMpegts',
                    'rtspScale',
                    'rtspUDPSourcePortRange',
                    'rtpSDP'
                ]
            }
        ]
    }, {
        name: 'Raspberry Pi Cam',
        storeKey: 'raspicam',
        props: [
            'rpiCameraCamID',
            'rpiCameraWidth',
            'rpiCameraHeight',
            'rpiCameraHFlip',
            'rpiCameraVFlip',
            'rpiCameraBrightness',
            'rpiCameraContrast',
            'rpiCameraSaturation',
            'rpiCameraSharpness',
            'rpiCameraExposure',
            'rpiCameraAWB',
            'rpiCameraAWBGains',
            'rpiCameraDenoise',
            'rpiCameraShutter',
            'rpiCameraMetering',
            'rpiCameraGain',
            'rpiCameraEV',
            'rpiCameraROI',
            'rpiCameraHDR',
            'rpiCameraTuningFile',
            'rpiCameraMode',
            'rpiCameraFPS',
            'rpiCameraAfMode',
            'rpiCameraAfRange',
            'rpiCameraAfSpeed',
            'rpiCameraLensPosition',
            'rpiCameraAfWindow',
            'rpiCameraFlickerPeriod',
            'rpiCameraTextOverlayEnable',
            'rpiCameraTextOverlay',
            'rpiCameraCodec',
            'rpiCameraIDRPeriod',
            'rpiCameraBitrate',
            'rpiCameraH264Profile',
            'rpiCameraH264Level',
            'rpiCameraMJPEGQuality',
            'rpiCameraSecondary'
        ]
    }, {
        name: 'Hooks',
        storeKey: 'hooks',
        columns: [
            {
                name: 'Settings',
                props: ['runOnInit',
                    'runOnInitRestart',
                    'runOnDemand',
                    'runOnDemandRestart',
                    'runOnDemandStartTimeout',
                    'runOnDemandCloseAfter',
                    'runOnUnDemand',
                    'runOnAvailable',
                    'runOnAvailableRestart',
                    'runOnUnavailable',
                    'runOnOnline',
                    'runOnOnlineRestart',
                    'runOnOffline',
                    'runOnRead',
                    'runOnReadRestart',
                    'runOnUnread',
                    'runOnRecordSegmentCreate',
                    'runOnRecordSegmentComplete']
            }
        ]
    }
];

export default PathGroups;
