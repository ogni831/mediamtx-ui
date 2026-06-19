/**
 * this is the dev watch task client over websockets to reload css files on change
 * included in index.html
 * <script type="module" src="/js/dev.js"></script>
 *
 * @type {number}
 */

const wsPort = 35729;
const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
const wsHost = window.location.hostname;

// The livereload server only exists during local development. In production
// nothing listens on this port, so guard the connection to avoid an uncaught
// error and a noisy console on every page load.
let ws = null;
try {
    ws = new WebSocket(`${protocol}://${wsHost}:${wsPort}`);
    ws.onerror = () => { /* livereload server not running – ignore */ };
} catch (e) {
    ws = null;
}

const linkMap = new Map();

function reloadOrAddLink(filePath) {
    const fileName = filePath.split('/').pop();
    let link = linkMap.get(fileName);

    if (!link) {
        link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = filePath;
        document.head.appendChild(link);
        linkMap.set(fileName, link);
        console.log(`CSS added: ${filePath}`);
    } else {
        const href = link.href.split('?')[0];
        link.href = `${href}?t=${Date.now()}`;
        console.log(`CSS reloaded: ${filePath}`);
    }
}

if (ws) {
    ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.type === 'reload-css') {
            const relativePath = msg.file.replace(/^.*public\//, '');
            reloadOrAddLink(relativePath);
        }
    };
}