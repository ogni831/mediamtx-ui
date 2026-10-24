import TextareaInput from "./textareainput.js";

/**
 * Edits a list/object value as JSON (for values that have no dedicated input,
 * e.g. webrtcICEServers2 or forward). Invalid JSON is not stored.
 */
export default class JsonInput extends TextareaInput {
    constructor(options) {
        super(options);
        this.element.value = JSON.stringify(this.value ?? [], null, 2);
        this.element.placeholder = 'JSON';
        this.element.onblur = () => this.commit();
    }

    commit() {
        try {
            const parsed = JSON.parse(this.element.value || '[]');
            this.element.classList.remove('invalid');
            this.value = parsed;
        } catch {
            this.element.classList.add('invalid');
        }
    }

    setValue(value) {
        this.element.value = JSON.stringify(value ?? [], null, 2);
    }
}
