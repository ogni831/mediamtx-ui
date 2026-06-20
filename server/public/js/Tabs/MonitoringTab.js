import Tab from "./Tab.js";
import {t} from "../i18n.js";

// Live connections / sessions exposed by the MediaMTX v3 API (read-only).
const SECTIONS = [
    {key: 'mon.rtspConns', url: '/mediamtx/rtspconns/list'},
    {key: 'mon.rtspSessions', url: '/mediamtx/rtspsessions/list'},
    {key: 'mon.rtmpConns', url: '/mediamtx/rtmpconns/list'},
    {key: 'mon.srtConns', url: '/mediamtx/srtconns/list'},
    {key: 'mon.webrtcSessions', url: '/mediamtx/webrtcsessions/list'},
];

const COLUMNS = ['id', 'remoteAddr', 'state', 'path', 'bytesReceived', 'bytesSent'];

export default class MonitoringTab extends Tab {
    constructor(page) {
        super(page);
        this.pollDelay = 2000; // ms
        this.sections = {};
    }

    async render() {
        this.destroy();

        this.element = document.createElement('div');
        this.element.className = 'tab monitoring';
        this.page.element.append(this.element);

        this.sections = {};
        SECTIONS.forEach(section => {
            const box = document.createElement('div');
            box.className = 'monitoring-section';

            const name = t(section.key);
            const heading = document.createElement('h2');
            heading.textContent = name;
            box.append(heading);

            const body = document.createElement('div');
            body.className = 'monitoring-body';
            box.append(body);

            this.element.append(box);
            this.sections[section.url] = {heading, body, name};
        });

        await this.poll();
        this.cycle = setInterval(() => this.poll(), this.pollDelay);
    }

    async poll() {
        await Promise.all(SECTIONS.map(section => this.loadSection(section)));
    }

    async loadSection(section) {
        const target = this.sections[section.url];
        if (!target)
            return;

        let items = [];
        try {
            const res = await this.fm.fetch(section.url);
            if (res && res.ok) {
                const data = await res.json();
                items = Array.isArray(data.items) ? data.items : [];
            }
        } catch {
            // upstream unreachable / aborted → render as empty
        }

        target.heading.textContent = `${target.name} (${items.length})`;
        target.body.replaceChildren(this.renderTable(items));
    }

    renderTable(items) {
        if (!items.length) {
            const empty = document.createElement('div');
            empty.className = 'monitoring-empty';
            empty.textContent = t('common.none');
            return empty;
        }

        const table = document.createElement('table');
        table.className = 'monitoring-table';

        const thead = document.createElement('thead');
        const headRow = document.createElement('tr');
        COLUMNS.forEach(col => {
            const th = document.createElement('th');
            th.textContent = col;
            headRow.append(th);
        });
        thead.append(headRow);
        table.append(thead);

        const tbody = document.createElement('tbody');
        items.forEach(item => {
            const row = document.createElement('tr');
            COLUMNS.forEach(col => {
                const td = document.createElement('td');
                let value = item[col];
                if (col === 'bytesReceived' || col === 'bytesSent') {
                    value = value != null ? `${(Number(value) / 1048576).toFixed(2)} MB` : '-';
                }
                // textContent (never innerHTML): values are remote-controlled
                td.textContent = value ?? '-';
                row.append(td);
            });
            tbody.append(row);
        });
        table.append(tbody);
        return table;
    }

    destroy() {
        clearInterval(this.cycle);
        super.destroy();
    }

    get settings() {
        return this.page.settings;
    }

    set settings(value) {
        // do nothing
    }
}
