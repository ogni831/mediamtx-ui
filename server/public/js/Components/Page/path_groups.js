// Field groups for path defaults and per-path editing.
// Property names match the MediaMTX v1.19.1 Control API (GET /v3/config/pathdefaults/get).
const PathGroups = [
    {
        name: 'Source',
        storeKey: 'source',
        columns: [
            {
                name: 'Source',
                props: [
                    'source',
                    'sourceRedirect', 'fallback',
                    'sourceFingerprint',
                    'sourceOnDemand',
                    'sourceOnDemandStartTimeout',
                    'sourceOnDemandCloseAfter'
                ]
            }, {
                name: 'I/O',
                props: [
                    'maxReaders',
                    'sourceRedirect', 'fallback',
                    'srtReadPassphrase',
                    'overridePublisher',
                    'srtPublishPassphrase'
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
                    'recordDeleteAfter'
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
                    'rtspRangeStart'
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
            'rpiCameraHardwareH264Profile', 'rpiCameraProfile',
            'rpiCameraHardwareH264Level', 'rpiCameraLevel'
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
                    'runOnReady',
                    'runOnReadyRestart',
                    'runOnNotReady',
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
