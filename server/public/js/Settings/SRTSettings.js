import Setting from "./Setting.js";

export default class SRTSettings extends Setting {
    constructor(settings) {
        super(settings, 'srt');

        this.fields = [
            'srt',
            'srtAddress'
        ];
    }
}
