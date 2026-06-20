import Tab from "./Tab.js";
import {t} from "../i18n.js";

// Playback of recorded video via the MediaMTX playback server.
// Path list comes from the (proxied) Control API; recorded ranges + the video
// stream come from the playback server directly (like HLS hits :8888 directly):
//   GET <playback>/list?path=<name>            → [{ start, duration, url }]
//   GET <playback>/get?path=&start=&duration=  → mp4 stream
export default class PlaybackTab extends Tab {
    async render() {
        this.destroy();

        this.element = document.createElement('div');
        this.element.className = 'tab playback';
        this.page.element.append(this.element);

        const bar = document.createElement('div');
        bar.className = 'playback-bar';
        this.select = document.createElement('select');
        this.select.className = 'playback-path';
        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = t('playback.selectPath');
        this.select.append(placeholder);
        this.select.onchange = () => this.loadRanges(this.select.value);
        bar.append(this.select);
        this.element.append(bar);

        this.video = document.createElement('video');
        this.video.className = 'playback-video';
        this.video.controls = true;
        this.video.playsInline = true;
        this.element.append(this.video);

        this.rangesEl = document.createElement('div');
        this.rangesEl.className = 'playback-ranges';
        this.element.append(this.rangesEl);

        await this.loadPaths();
    }

    async loadPaths() {
        let items = [];
        try {
            const res = await this.fm.fetch('/mediamtx/config/paths/list');
            if (res && res.ok) {
                const data = await res.json();
                items = Array.isArray(data.items) ? data.items : [];
            }
        } catch { /* upstream down */ }

        items.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.name;
            opt.textContent = p.name;
            this.select.append(opt);
        });
    }

    get base() {
        const url = new URL(window.location.href);
        const addr = this.settings?.playback?.playbackAddress ?? ':9996';
        return `${url.protocol}//${url.hostname}${addr}`;
    }

    async loadRanges(path) {
        this.rangesEl.replaceChildren();
        this.video.removeAttribute('src');
        this.video.load?.();
        if (!path) return;

        let ranges = [];
        try {
            const res = await fetch(`${this.base}/list?path=${encodeURIComponent(path)}`);
            if (res.ok) ranges = await res.json();
        } catch { /* playback server unreachable */ }

        if (!Array.isArray(ranges) || !ranges.length) {
            const empty = document.createElement('div');
            empty.className = 'monitoring-empty';
            empty.textContent = t('playback.noRanges');
            this.rangesEl.append(empty);
            return;
        }

        ranges.forEach(r => {
            const row = document.createElement('div');
            row.className = 'playback-range';

            const label = document.createElement('span');
            label.className = 'range-start';
            label.textContent = `${r.start ?? '-'}  ·  ${t('playback.duration')}: ${Math.round(r.duration ?? 0)}s`;
            row.append(label);

            const btn = document.createElement('button');
            btn.textContent = t('playback.play');
            btn.onclick = () => this.playRange(path, r);
            row.append(btn);

            this.rangesEl.append(row);
        });
    }

    playRange(path, r) {
        const url = `${this.base}/get`
            + `?path=${encodeURIComponent(path)}`
            + `&start=${encodeURIComponent(r.start)}`
            + `&duration=${encodeURIComponent(r.duration)}`
            + `&format=mp4`;
        this.video.src = url;
        try {
            const p = this.video.play?.();
            p?.catch?.(() => {});
        } catch { /* autoplay may be blocked */ }
    }
}
