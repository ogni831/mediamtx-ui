import DataProxy from "../data_proxy.js";
import EventEmitter from "../event_emitter.js";

/**
 * Reactive wrapper around a single path object.
 *
 * Returns a {@link DataProxy}; mutating one of its fields reports an `update`
 * action which is forwarded to the provided `onUpdate` callback (so the path is
 * persisted via the API). Unchanged writes are skipped by DataProxy and reported
 * through `onSkip`. The original key is carried in the result to support rename.
 */
export default class PathItemProxy {
    constructor(target, key, opts = {}) {
        this.events = new EventEmitter();
        this.key = key;
        this.opts = opts;
        return new DataProxy(target, this, false);
    }

    action(action, prop, value) {
        const result = {prop, value, key: this.key};

        if (action === 'update')
            this.opts.onUpdate ? this.opts.onUpdate(result) : null;
        else
            this.opts.onSkip ? this.opts.onSkip(result) : null;
    }
}
