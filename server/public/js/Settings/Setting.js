import DataProxy from "../data_proxy.js";

/**
 * Base class for a settings group.
 *
 * A group exposes a *schema* (fields / options / inputType / locked) that the
 * tab renderers read, and binds a reactive data object into `settings.store`.
 *
 * The reactive object is a {@link DataProxy} whose parent is this instance, so
 * every mutation calls `action()`. The first population during load reports the
 * `create` action (ignored), while later edits report `update` and are persisted.
 */
export default class Setting {
    constructor(settings, storeKey, target = {}) {
        this.label = this.constructor.name.toUpperCase();
        this.settings = settings;
        this.events = this.settings.events;
        this.storeKey = storeKey;

        // schema – overridden by subclasses
        this.fields = [];
        this.options = {};
        this.inputType = {};
        this.locked = [];

        // which SettingsService method persists this group
        this.saveMethod = 'saveGlobal';

        // bind a reactive store object for groups that own one
        if (storeKey)
            this.settings.store[storeKey] = new DataProxy(target, this, false);
    }

    get service() {
        return this.settings.service;
    }

    // DataProxy mutation hook
    action(action, prop, value) {
        // "create" = initial population during load -> don't persist
        if (action !== 'update')
            return;

        const save = this.service?.[this.saveMethod];
        if (typeof save === 'function')
            save.call(this.service);
    }

    on(event, callback) {
        return this.events.on(event, callback);
    }

    emit(event, ...args) {
        return this.events.emit(event, ...args);
    }
}
