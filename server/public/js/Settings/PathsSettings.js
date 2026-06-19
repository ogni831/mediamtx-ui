import Setting from "./Setting.js";

/**
 * Manages the list of configured paths (streams).
 *
 * Individual paths live in `store.paths` as {@link PathItemProxy} instances;
 * this class receives their change notifications and persists them through the
 * paths API. It does not own a single reactive store object of its own.
 */
export default class PathsSettings extends Setting {
    constructor(settings) {
        super(settings, null);
    }

    // a field of a single path changed
    onUpdate(result) {
        const path = result.path;
        if (!path)
            return;

        // when the name field changed, patch against the original key (rename)
        const name = (result.prop === 'name') ? result.key : path.name;
        this.settings.service.updatePath(name, {...path});
    }

    onSkip() {
        // nothing changed
    }
}
