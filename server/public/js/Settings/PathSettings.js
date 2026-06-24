import Setting from "./Setting.js";

/**
 * Path defaults (GET/PATCH /v3/config/pathdefaults).
 * Also provides the schema (fields / options / inputType) reused by the
 * per-path editor in the Streams tab.
 */
export default class PathSettings extends Setting {
    constructor(settings) {
        super(settings, 'path');

        // path defaults are persisted through a dedicated endpoint
        this.saveMethod = 'savePathDefaults';

        this.fields = [
            // identity (per-path only, ignored for defaults)
            'name',

            // general
            'source',
            'sourceFingerprint',
            'sourceOnDemand',
            'sourceOnDemandStartTimeout',
            'sourceOnDemandCloseAfter',
            'maxReaders',
            'srtReadPassphrase',
            'sourceRedirect',

            // recording
            'record',
            'recordPath',
            'recordFormat',
            'recordPartDuration',
            'recordSegmentDuration',
            'recordDeleteAfter',

            // publisher source
            'overridePublisher',
            'srtPublishPassphrase',

            // RTSP source
            'rtspTransport',
            'rtspAnyPort',
            'rtspRangeType',
            'rtspRangeStart',

            // redirect source
            'sourceRedirect',

            // Raspberry Pi Camera source
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
            'rpiCameraHardwareH264Profile',
            'rpiCameraHardwareH264Level',

            // hooks
            'runOnInit',
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
            'runOnRecordSegmentComplete'
        ];

        this.options = {
            name: ['', 'all_others'],
            source: ['', 'publisher', 'redirect', 'rpiCamera'],
            recordFormat: ['fmp4', 'mpegts'],
            rtspTransport: ['automatic', 'udp', 'multicast', 'tcp'],
            rtspRangeType: ['', 'clock', 'npt', 'smpte'],
            rpiCameraExposure: ['normal', 'short', 'long', 'custom'],
            rpiCameraAWB: ['auto', 'incandescent', 'tungsten', 'fluorescent', 'indoor', 'daylight', 'cloudy', 'custom'],
            rpiCameraDenoise: ['off', 'cdn_off', 'cdn_fast', 'cdn_hq'],
            rpiCameraMetering: ['centre', 'spot', 'matrix', 'custom'],
            rpiCameraAfMode: ['auto', 'manual', 'continuous'],
            rpiCameraAfRange: ['normal', 'macro', 'full'],
            rpiCameraAfSpeed: ['normal', 'fast'],
            rpiCameraCodec: ['auto', 'hardwareH264', 'softwareH264', 'mjpeg'],
            rpiCameraProfile: ['baseline', 'main', 'high'],
            rpiCameraLevel: ['4.0', '4.1', '4.2']
        };

        this.inputType = {
            name: 'SelectTextInput',
            source: 'SelectTextInput'
        };
    }
}
