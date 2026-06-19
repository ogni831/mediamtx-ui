import Setting from "./Setting.js";

/**
 * Manages the internal users list (authInternalUsers).
 *
 * Users live in `store.users` as {@link UserItemProxy} instances and are part
 * of the global config, so any change is persisted through saveGlobal.
 * Exposes `itemSchema` consumed by the Users tab to render each user row.
 */
export default class UsersSettings extends Setting {
    constructor(settings) {
        super(settings, null);

        this.itemSchema = {
            fields: ['user', 'pass', 'ips', 'permissions'],
            options: {},
            inputType: {
                ips: 'MultiTextInput',
                permissions: 'PermissionsInput'
            },
            locked: []
        };
    }

    // a field of a single user changed
    onUpdate() {
        this.settings.service.saveGlobal();
    }

    onSkip() {
        // nothing changed
    }
}
