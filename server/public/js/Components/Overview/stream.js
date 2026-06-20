import {t} from "../../i18n.js";
import DataProxy from "../../data_proxy.js";
import Video from "../../video.js";

export default class StreamItem {
    constructor(data, tab) {
        this.label = this.constructor.name.toUpperCase();
        this.tab = tab;
        this.page = this.tab.page;
        this.data = new DataProxy(data, this, false);
    }

    render() {
        if (this.element)
            this.destroy();

        const label = (textContent) => {
            const element = document.createElement("div");
            element.className = 'stream-label';
            element.textContent = textContent;
            return element;
        };

        const el = document.createElement("div");
        el.className = 'stream-item';

        //--- name
        const nameEl = document.createElement("div");
        nameEl.className = 'stream-name';
        nameEl.textContent = this.data.confName;
        el.append(nameEl);

        //--- type
        this.typeEl = document.createElement("div");
        this.typeEl.className = 'stream-type';
        this.typeEl.textContent = this.data.source && this.data.tracks ? `${splitCamelCase(this.data.source.type).toUpperCase()} - ${this.data.tracks.join(', ')}` : '';
        el.append(this.typeEl);

        //--- viewers
        const viewersEl = document.createElement("div");
        viewersEl.className = 'stream-viewers';

        const labelViewersEl = label(t('overview.viewers'));
        viewersEl.append(labelViewersEl);

        this.viewersNumberEl = document.createElement("div");
        this.viewersNumberEl.className = 'stream-viewers-number';
        this.viewersNumberEl.textContent = this.data.readers.length;
        viewersEl.append(this.viewersNumberEl);
        el.append(viewersEl);

        //--- video element — only attach a player for paths that are actually
        // ready (avoids creating HLS players + 404 polling for offline paths)
        this.videoWrap = document.createElement("div");
        this.videoWrap.className = 'stream-video';
        el.append(this.videoWrap);
        this.element = el;
        this._renderVideo();

        //--- bytes
        const bytesEl = document.createElement("div");
        bytesEl.className = 'stream-bytes';

        //--- bytes received
        const bytesReceivedEl = document.createElement("div");
        bytesReceivedEl.className = 'stream-bytes-received';

        const labelBytesReceivedEl = label(t('overview.received'));
        bytesReceivedEl.append(labelBytesReceivedEl);

        this.bytesReceivedNumberEl = document.createElement("div");
        this.bytesReceivedNumberEl.className = 'stream-bytes-received-number';
        this.bytesReceivedNumberEl.textContent = this.data.bytesReceived;
        bytesReceivedEl.append(this.bytesReceivedNumberEl);
        bytesEl.append(bytesReceivedEl);

        //--- bytes sent
        const bytesSentEl = document.createElement("div");
        bytesSentEl.className = 'stream-bytes-sent';

        const labelBytesSentEl = label(t('overview.sent'));
        bytesSentEl.append(labelBytesSentEl);

        this.bytesSentNumberEl = document.createElement("div");
        this.bytesSentNumberEl.className = 'stream-bytes-sent-number';
        this.bytesSentNumberEl.textContent = this.data.bytesSent;
        bytesSentEl.append(this.bytesSentNumberEl);
        bytesEl.append(bytesSentEl);

        el.append(bytesEl);


        return this.element = el;
    }

    // Create/tear down the HLS player based on the path's readiness.
    _renderVideo() {
        if (!this.videoWrap)
            return;

        if (this.data.ready) {
            if (!this.video) {
                this.placeholder?.remove();
                this.placeholder = null;
                this.video = new Video(this);
                this.videoWrap.appendChild(this.video.render());
                requestAnimationFrame(() => this.video.init());
            }
        } else {
            if (this.video) {
                this.video.destroy();
                this.video = null;
            }
            if (!this.placeholder) {
                this.placeholder = document.createElement("div");
                this.placeholder.className = 'stream-offline';
                this.placeholder.textContent = t('common.offline');
                this.videoWrap.appendChild(this.placeholder);
            }
        }
    }

    update(data) {
        Object.keys(data).forEach((key) => this.data[key] = data[key]);
    }

    action(action, prop, value) {
        if (action === 'update') {
            if (prop === 'ready')
                this._renderVideo();

            if (prop === 'readers')
                this.viewers = value.length;

            if (prop === 'bytesReceived')
                this.bytesReceived = value;

            if (prop === 'bytesSent')
                this.bytesSent = value;

            if (prop === 'type' || prop === 'tracks') {
                this.data.source && this.data.tracks.length > 0 ? this.typeEl.textContent = `${splitCamelCase(this.data.source.type).toUpperCase()} - ${this.data.tracks.join(', ')}` : null;
            }
        }
    }

    destroy() {
        this.video?.destroy();
        this.video = null;
        this.element?.remove();
    }

    get viewers() {
        return this._viewers;
    }

    set viewers(value) {
        this._viewers = value;
        this.viewersNumberEl.textContent = this.viewers;
    }

    get bytesReceived() {
        return this._bytesReceived;
    }

    set bytesReceived(value) {
        this._bytesReceived = value;
        this.bytesReceivedNumberEl.textContent = (parseInt(this.bytesReceived) / 1048576).toFixed(2);
    }

    get bytesSent() {
        return this._bytesSent;
    }

    set bytesSent(value) {
        this._bytesSent = value;
        this.bytesSentNumberEl.textContent = (parseInt(this.bytesSent) / 1048576).toFixed(2);
    }

}

const splitCamelCase = (str) => {
    return str
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');
}