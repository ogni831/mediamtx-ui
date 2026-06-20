import EventEmitter from "../../event_emitter.js";
import {t} from "../../i18n.js";
import Controls from "./controls.js";

export default class TabNavigation {
    constructor(page) {
        this.page = page;
        this.events = this.page.events || new EventEmitter();

        // slug equals page.tabs[SLUG]
        this.tabs = [
            {name: "Overview", slug: "overview", icon: 'armchair'},
            {name: "Streams", slug: "streams", icon: 'expand'},
           //{name: "Sources", slug: "sources", icon: 'shrink'},
            {name: "Server", slug: "server", icon: 'settings'},
            {name: "Playback", slug: "playback", icon: 'play'},
            {name: "Recordings", slug: "recording", icon: 'circle'},
            {name: "Monitoring", slug: "monitoring", icon: 'chart-no-axes-combined'},
            {name: "Path Defaults", slug: "path", icon: 'layers-2'},
            {name: "Users", slug: "users", icon: 'user'}
        ];
    }

    render() {
        this.element = document.createElement("div");
        this.element.className = "tab-navigation";
        this.page.element.append(this.element);

        // centered tab buttons live in their own flex container so the
        // controls (pinned right) never overlap the last tab
        this.tabsEl = document.createElement("div");
        this.tabsEl.className = "nav-tabs";
        this.element.append(this.tabsEl);

        this.buttons = [];
        this.tabs.forEach(tab => {
            const button = document.createElement("button");
            button.setAttribute("type", "button");
            const label = t(`nav.${tab.slug}`);
            button.innerHTML = tab.icon ? `${this.icons.svg[tab.icon]}${label}` : label;
            button.slug = tab.slug; // custom prop
            button.onclick = () => this.selected = tab.slug;
            this.tabsEl.append(button);
            this.buttons.push(button);
        });

        // language + theme controls
        this.controls = new Controls();
        this.controls.render(this.element);

        // restore the tab from the URL hash (#slug or #slug/group), else default
        const hashSlug = (window.location.hash || '').replace(/^#/, '').split('/')[0];
        const valid = this.tabs.some(tab => tab.slug === hashSlug);
        this.selected = valid ? hashSlug : (this.selected || this.tabs[2].slug);
    }

    on(event, callback) {
        return this.events.on(event, callback);
    }

    emit(event, ...args) {
        return this.events.emit(event, ...args);
    }

    destroy(){
        this.element.remove();
    }

    get selected() {
        return this._selected;
    }

    set selected(val) {
        this._selected = val;

        this.page.fm.abortAll();
        window.history.pushState({}, "", `#${this.selected}`);
        this.buttons.forEach(b => b.classList.remove("active"));
        this.buttons.filter(b => b.slug === this.selected)[0].classList.add("active");
        this.page.showTab(this.tab);

        //this.page.emit('tab', this.tab);
        //this.emit('select', this.tab);
    }

    get tab() {
        return this.tabs.filter(tab => tab.slug === this.selected)[0];
    }

    set tab(val) {
        //
    }

    get icons() {
        return this.page.icons;
    }

    set icons(val) {
        //
    }
}