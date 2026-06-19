import DataProxy from "../data_proxy.js";
import EventEmitter from "../event_emitter.js";

/**
 * Reactive wrapper around a single internal user object.
 *
 * Mutating a field reports an `update` action which is forwarded to `onUpdate`
 * (the users list is part of the global config, so it is persisted via
 * saveGlobal). Unchanged writes are reported through `onSkip`.
 */
export default class UserItemProxy {
    constructor(target, index, opts = {}) {
        this.events = new EventEmitter();
        this.index = index;
        this.opts = opts;
        return new DataProxy(target, this, false);
    }

    action(action, prop, value) {
        const result = {prop, value, index: this.index};

        if (action === 'update')
            this.opts.onUpdate ? this.opts.onUpdate(result) : null;
        else
            this.opts.onSkip ? this.opts.onSkip(result) : null;
    }
}
