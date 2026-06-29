/**
 * Sub-path shim. Коли застосунок reverse-проксюється під під-шляхом (напр.
 * /mediamtx-ui/), root-абсолютні fetch/XHR-URL ('/auth', '/v3', '/images/…')
 * треба префіксувати цим під-шляхом. Базу беремо з URL документа, тож no-op
 * при serving з кореня (:8443 / локально). Завантажується НЕ як module і
 * ДО app-скриптів, щоб запатчити fetch/XHR до перших викликів.
 *
 * Зовнішній файл (а не inline) — щоб не вимагати script-src 'unsafe-inline'.
 */
(function () {
    var base = new URL('.', document.baseURI).pathname.replace(/\/+$/, '');
    if (!base) return;

    function fix(u) {
        return (typeof u === 'string' && u.charAt(0) === '/' && u.charAt(1) !== '/'
                && u.indexOf(base + '/') !== 0 && u !== base)
            ? base + u : u;
    }

    var origFetch = window.fetch;
    if (origFetch) {
        window.fetch = function (input, init) {
            if (typeof input === 'string') {
                input = fix(input);
            } else if (typeof Request !== 'undefined' && input instanceof Request && input.url) {
                input = new Request(fix(input.url), input);
            }
            return origFetch.call(this, input, init);
        };
    }

    var origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        arguments[1] = fix(url);
        return origOpen.apply(this, arguments);
    };
})();
