// Light/dark theme via the `data-theme` attribute on <html> (CSS variables in
// css/variables.css react to it). Persists the choice in localStorage and
// honours the OS preference on first visit.

const STORAGE_KEY = 'theme';

function read() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === 'light' || saved === 'dark') return saved;
    } catch { /* ignore */ }
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
}

export function getTheme() {
    return document.documentElement.dataset.theme || 'light';
}

export function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    try {
        localStorage.setItem(STORAGE_KEY, theme);
    } catch { /* ignore */ }
}

export function toggleTheme() {
    applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
    return getTheme();
}

// apply immediately on import so there's no flash of the wrong theme
applyTheme(read());
