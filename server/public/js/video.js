export default class Video {
    constructor(stream) {
        this.label = this.constructor.name.toUpperCase();
        this.debug = false;
        this.stream = stream;
        this.name = this.stream.data.confName;
        this.hls = null;
        // 'hls' (hls.js <video>) | 'webrtc' (MediaMTX's built-in WHEP player via iframe)
        this.mode = 'hls';
    }

    render() {
        this.element = document.createElement('div');
        this.element.className = 'cam-wrap';

        // playback mode toggle (HLS ⇄ WebRTC/WHEP)
        this.toggleBtn = document.createElement('button');
        this.toggleBtn.type = 'button';
        this.toggleBtn.className = 'cam-mode';
        this.toggleBtn.onclick = (e) => {
            e.stopPropagation();
            this.setMode(this.mode === 'hls' ? 'webrtc' : 'hls');
        };
        this.element.append(this.toggleBtn);

        this.media = document.createElement('div');
        this.media.className = 'cam-media';
        this.element.append(this.media);

        return this.element;
    }

    init() {
        this._mount();
    }

    setMode(mode) {
        if (mode !== 'hls' && mode !== 'webrtc')
            return;
        this.mode = mode;
        this._mount();
    }

    _mount() {
        this._teardown();
        this.mode === 'hls' ? this._mountHls() : this._mountWebrtc();
        // button shows the OTHER mode (what clicking switches to)
        this.toggleBtn.textContent = this.mode === 'hls' ? 'WebRTC' : 'HLS';
    }

    // --- HLS (hls.js) ---------------------------------------------------------
    _mountHls() {
        this.video = document.createElement('video');
        this.video.className = 'cam';
        this.video.id = this.name;
        this.video.autoplay = true;
        this.video.muted = true;
        this.video.setAttribute('muted', '');   // Firefox
        this.video.playsInline = true;
        this.video.setAttribute('playsinline', '');
        this.video.addEventListener('click', () => this.toggle());
        this.media.append(this.video);

        this.hls = new Hls({
            enableWorker: true,
            lowLatencyMode: false,
            maxBufferLength: 10,
        });
        this.hls.attachMedia(this.video);

        this.hls.on(Hls.Events.MEDIA_ATTACHED, () => {
            this.hls.loadSource(this.hlsUrl);
        });
        this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
            this.video.play().catch(() => {});
        });
        this.hls.on(Hls.Events.ERROR, (event, data) => {
            this.debug ? console.log(this.label, `${this.name} HLS ERROR:`, data) : null;
            if (data.fatal && data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                setTimeout(() => {
                    this.hls?.loadSource(this.hlsUrl);
                    this.hls?.startLoad();
                }, 1000);
            }
            if (data.fatal && data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                this.hls?.recoverMediaError();
            }
        });
    }

    // --- WebRTC (MediaMTX built-in WHEP reader, embedded) ---------------------
    _mountWebrtc() {
        this.iframe = document.createElement('iframe');
        this.iframe.className = 'cam';
        this.iframe.setAttribute('allow', 'autoplay; fullscreen');
        this.iframe.setAttribute('allowfullscreen', '');
        this.iframe.src = this.webrtcUrl;
        this.media.append(this.iframe);
    }

    _teardown() {
        if (this.hls) {
            this.hls.destroy();
            this.hls = null;
        }
        this.video?.pause?.();
        this.video?.remove();
        this.video = null;
        this.iframe?.remove();
        this.iframe = null;
        this.media?.replaceChildren?.();
    }

    play() {
        this.video?.play();
    }

    pause() {
        this.video?.pause();
    }

    toggle() {
        if (!this.video) return;
        this.video.paused ? this.video.play() : this.video.pause();
    }

    destroy() {
        this._teardown();
        this.element?.remove();
    }

    get hlsUrl() {
        const url = new URL(window.location.href);
        const addr = this.stream.tab.settings?.hls?.hlsAddress ?? ':8888';
        return `${url.protocol}//${url.hostname}${addr}/${this.name}/index.m3u8`;
    }

    // MediaMTX serves its own WebRTC/WHEP reader page at http://host:<webrtc>/<path>/
    get webrtcUrl() {
        const url = new URL(window.location.href);
        const addr = this.stream.tab.settings?.webrtc?.webrtcAddress ?? ':8889';
        return `${url.protocol}//${url.hostname}${addr}/${this.name}/`;
    }
}
