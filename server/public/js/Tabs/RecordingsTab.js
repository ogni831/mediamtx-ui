import {t} from "../i18n.js";
import Tab from "./Tab.js";

// Recordings browser backed by the MediaMTX v3 recordings API.
// GET /v3/recordings/list → { items: [{ name, segments: [{ start }] }] }
// DELETE /v3/recordings/deletesegment?path=&start=
export default class RecordingsTab extends Tab {
    constructor(page) {
        super(page);
    }

    async render() {
        this.destroy();

        this.element = document.createElement('div');
        this.element.className = 'tab recordings';
        this.page.element.append(this.element);

        const bar = document.createElement('div');
        bar.className = 'recordings-bar';
        const refresh = document.createElement('button');
        refresh.className = 'refresh';
        refresh.innerHTML = `${this.page.icons.svg['package-check'] ?? ''} ${t('btn.refresh')}`;
        refresh.onclick = () => this.load();
        bar.append(refresh);
        this.element.append(bar);

        this.listEl = document.createElement('div');
        this.listEl.className = 'recordings-list';
        this.element.append(this.listEl);

        await this.load();
    }

    async load() {
        let items = [];
        try {
            const res = await this.fm.fetch('/mediamtx/recordings/list');
            if (res && res.ok) {
                const data = await res.json();
                items = Array.isArray(data.items) ? data.items : [];
            }
        } catch {
            // upstream unreachable → render empty
        }
        this.renderList(items);
    }

    renderList(items) {
        if (!this.listEl)
            return;
        this.listEl.replaceChildren();

        if (!items.length) {
            const empty = document.createElement('div');
            empty.className = 'monitoring-empty';
            empty.textContent = t('recordings.empty');
            this.listEl.append(empty);
            return;
        }

        items.forEach(rec => this.listEl.append(this.renderRecording(rec)));
    }

    renderRecording(rec) {
        const box = document.createElement('div');
        box.className = 'recordings-item';

        const segments = Array.isArray(rec.segments) ? rec.segments : [];

        const heading = document.createElement('h2');
        heading.textContent = `${rec.name} (${segments.length})`;
        box.append(heading);

        const segList = document.createElement('div');
        segList.className = 'recordings-segments';
        segments.forEach(seg => {
            const row = document.createElement('div');
            row.className = 'recordings-segment';

            const start = document.createElement('span');
            start.className = 'seg-start';
            start.textContent = seg.start ?? '-'; // textContent: remote-controlled
            row.append(start);

            const del = document.createElement('button');
            del.className = 'delete';
            del.textContent = t('btn.delete');
            del.onclick = () => this.deleteSegment(rec.name, seg.start);
            row.append(del);

            segList.append(row);
        });
        box.append(segList);

        return box;
    }

    async deleteSegment(name, start) {
        if (!start)
            return;
        if (!window.confirm(`${t('recordings.confirm')}\n\n${name}\n${start}`))
            return;

        const url = `/mediamtx/recordings/deletesegment`
            + `?path=${encodeURIComponent(name)}&start=${encodeURIComponent(start)}`;

        const res = await this.fm.fetch(url, {
            method: 'DELETE',
            headers: {'CSRF-Token': this.page.auth.csrfToken},
            credentials: 'include',
        });

        if (res && res.ok) {
            this.page.toast.success('Recording segment deleted');
            await this.load();
        } else {
            this.page.toast.error('Failed to delete segment');
        }
    }

    destroy() {
        super.destroy();
    }

    get settings() {
        return this.page.settings;
    }

    set settings(value) {
        // do nothing
    }
}
