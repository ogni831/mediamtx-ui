import {LOCALES, getLocale, setLocale, t} from "../../i18n.js";
import {getTheme, toggleTheme} from "../../theme.js";

// Small header widget: language selector + light/dark theme toggle.
export default class Controls {
    render(container) {
        this.element = document.createElement('div');
        this.element.className = 'controls';

        // language
        const select = document.createElement('select');
        select.className = 'controls-lang';
        select.setAttribute('aria-label', t('controls.language'));
        LOCALES.forEach(l => {
            const opt = document.createElement('option');
            opt.value = l.code;
            opt.textContent = l.label;
            if (l.code === getLocale()) opt.selected = true;
            select.append(opt);
        });
        select.onchange = (e) => setLocale(e.target.value);
        this.element.append(select);

        // theme
        this.themeBtn = document.createElement('button');
        this.themeBtn.type = 'button';
        this.themeBtn.className = 'controls-theme';
        this._setThemeLabel();
        this.themeBtn.onclick = () => {
            toggleTheme();
            this._setThemeLabel();
        };
        this.element.append(this.themeBtn);

        container.append(this.element);
        return this.element;
    }

    _setThemeLabel() {
        const dark = getTheme() === 'dark';
        this.themeBtn.textContent = dark ? `☀ ${t('controls.themeLight')}` : `☾ ${t('controls.themeDark')}`;
        this.themeBtn.dataset.theme = getTheme();
    }

    destroy() {
        this.element?.remove();
    }
}
