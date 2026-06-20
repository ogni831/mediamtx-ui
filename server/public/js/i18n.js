// Tiny i18n helper. Strings live here; `t(key, vars)` does {var} interpolation
// and falls back to English, then to the key itself. Locale persists in
// localStorage; switching reloads the page so every rendered string updates.

const DICT = {
    en: {
        'nav.overview': 'Overview',
        'nav.streams': 'Streams',
        'nav.server': 'Server',
        'nav.path': 'Path Defaults',
        'nav.users': 'Users',
        'nav.monitoring': 'Monitoring',
        'nav.recording': 'Recordings',
        'nav.playback': 'Playback',

        'overview.viewers': 'Viewers',
        'overview.received': 'MB Received',
        'overview.sent': 'MB Sent',

        'playback.selectPath': 'Select a path…',
        'playback.noRanges': '— no recordings for this path —',
        'playback.play': 'Play',
        'playback.duration': 'duration',

        'login.title': 'Login',
        'login.username': 'Username',
        'login.password': 'Password',
        'login.submit': 'Login',
        'login.welcome': 'Welcome',
        'login.requires': 'This application requires authentication.',
        'login.enter': 'Please enter your credentials to continue.',
        'login.failed': 'Login failed. Please check your credentials.',

        'btn.addPath': 'Add path',
        'btn.deletePath': 'Delete path',
        'btn.editPath': 'Edit path',
        'btn.addUser': 'Add user',
        'btn.deleteUser': 'Delete user',
        'btn.refresh': 'Refresh',
        'btn.delete': 'Delete',

        'common.offline': 'offline',
        'common.none': '— none —',
        'recordings.empty': '— no recordings —',
        'recordings.confirm': 'Delete recording segment?',

        'mon.rtspConns': 'RTSP connections',
        'mon.rtspSessions': 'RTSP sessions',
        'mon.rtmpConns': 'RTMP connections',
        'mon.srtConns': 'SRT connections',
        'mon.webrtcSessions': 'WebRTC sessions',

        'toast.savedGlobal': 'Saved global settings',
        'toast.savedPaths': 'Saved paths settings',
        'toast.pathAdded': 'Path added',
        'toast.pathUpdated': 'Path "{name}" updated',
        'toast.pathReplaced': 'Path replaced',
        'toast.pathDeleted': 'Path deleted',
        'toast.userDeleted': 'User "{name}" deleted',
        'toast.segDeleted': 'Recording segment deleted',
        'toast.segDeleteFail': 'Failed to delete segment',

        'controls.language': 'Language',
        'controls.themeLight': 'Light',
        'controls.themeDark': 'Dark',
    },
    uk: {
        'nav.overview': 'Огляд',
        'nav.streams': 'Потоки',
        'nav.server': 'Сервер',
        'nav.path': 'Налаштування шляхів',
        'nav.users': 'Користувачі',
        'nav.monitoring': 'Моніторинг',
        'nav.recording': 'Записи',
        'nav.playback': 'Відтворення',

        'overview.viewers': 'Глядачі',
        'overview.received': 'МБ отримано',
        'overview.sent': 'МБ надіслано',

        'playback.selectPath': 'Оберіть шлях…',
        'playback.noRanges': '— немає записів для цього шляху —',
        'playback.play': 'Відтворити',
        'playback.duration': 'тривалість',

        'login.title': 'Вхід',
        'login.username': "Ім'я користувача",
        'login.password': 'Пароль',
        'login.submit': 'Увійти',
        'login.welcome': 'Вітаємо',
        'login.requires': 'Цей застосунок потребує автентифікації.',
        'login.enter': 'Введіть облікові дані, щоб продовжити.',
        'login.failed': 'Помилка входу. Перевірте облікові дані.',

        'btn.addPath': 'Додати шлях',
        'btn.deletePath': 'Видалити шлях',
        'btn.editPath': 'Редагувати шлях',
        'btn.addUser': 'Додати користувача',
        'btn.deleteUser': 'Видалити користувача',
        'btn.refresh': 'Оновити',
        'btn.delete': 'Видалити',

        'common.offline': 'офлайн',
        'common.none': '— немає —',
        'recordings.empty': '— немає записів —',
        'recordings.confirm': 'Видалити сегмент запису?',

        'mon.rtspConns': "RTSP-з'єднання",
        'mon.rtspSessions': 'RTSP-сесії',
        'mon.rtmpConns': "RTMP-з'єднання",
        'mon.srtConns': "SRT-з'єднання",
        'mon.webrtcSessions': 'WebRTC-сесії',

        'toast.savedGlobal': 'Збережено глобальні налаштування',
        'toast.savedPaths': 'Збережено налаштування шляхів',
        'toast.pathAdded': 'Шлях додано',
        'toast.pathUpdated': 'Шлях "{name}" оновлено',
        'toast.pathReplaced': 'Шлях замінено',
        'toast.pathDeleted': 'Шлях видалено',
        'toast.userDeleted': 'Користувача "{name}" видалено',
        'toast.segDeleted': 'Сегмент запису видалено',
        'toast.segDeleteFail': 'Не вдалося видалити сегмент',

        'controls.language': 'Мова',
        'controls.themeLight': 'Світла',
        'controls.themeDark': 'Темна',
    },
};

export const LOCALES = [
    {code: 'en', label: 'English'},
    {code: 'uk', label: 'Українська'},
];

let locale = 'en';
try {
    const saved = localStorage.getItem('locale');
    if (saved && DICT[saved]) locale = saved;
} catch {
    // localStorage unavailable → default en
}

export function getLocale() {
    return locale;
}

export function setLocale(next) {
    if (!DICT[next] || next === locale) return;
    locale = next;
    try {
        localStorage.setItem('locale', next);
    } catch { /* ignore */ }
    // simplest reliable way to re-render every string
    window.location.reload();
}

export function t(key, vars) {
    let str = DICT[locale]?.[key] ?? DICT.en[key] ?? key;
    if (vars) {
        for (const [k, v] of Object.entries(vars)) {
            str = str.replaceAll(`{${k}}`, v);
        }
    }
    return str;
}
