export default class Component {
    /**
     * All call sites (FormItem and the concrete inputs) construct components with
     * a single options object, e.g.:
     *   new TextInput({ parent, storeKey, store, prop, inputType, values, locked, elementOptions })
     * so this base destructures that object. (The previous positional signature
     * was left over from an unfinished refactor and broke every form input.)
     */
    constructor(options = {}) {
        this.parent = options.parent;
        this.storeKey = options.storeKey;
        this.store = options.store;

        this.prop = options.prop;
        this.name = `${this.prop}`.toLowerCase();

        this.inputType = options.inputType; // the name of the form input class from Components/Form/index.js
        this.values = options.values;       // available enums
        this.locked = options.locked;        // not editable props
        this.options = options.elementOptions || {}; // the elementProps override

        this.debounceTime = 50;     // ms

        this.targetElement = this.parent?.element || false;
        this.elementTag = 'div';
        this.elementProps = {
            className: 'item'
        };
    }

    init() {
        Object.assign(this.elementProps, this.options);
    }

    render() {
        // create the element
        this.element = document.createElement(this.elementTag);
        // apply all props except dataset
        Object.keys(this.elementProps).forEach(prop => prop !== 'dataset' ? this.element[prop] = this.elementProps[prop] : null);
        // apply dataset
        this.elementProps.dataset ? Object.keys(this.elementProps.dataset).forEach(dataKey => this.element.dataset[dataKey] = this.elementProps.dataset[dataKey]) : null;
    }

    // triggered from outside
    setValue(value) {
        this.element.value = value;
    }

    get value() {
        return this.store[this.prop];
    }

    set value(value) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.store[this.prop] = value, this.debounceTime);
    }

    get dataType() {
        return Array.isArray(this.value) ? 'array' : typeof this.value;
    }

    set dataType(val) {
        // do nothing
    }

    get dataTypeValues() {
        return Array.isArray(this.values) ? 'array' : typeof this.values;
    }

    set dataTypeValues(val) {
        // do nothing
    }
}
