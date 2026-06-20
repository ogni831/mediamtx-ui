# 🎥 mediamtx-ui

> A dependency-light web UI to configure a [**MediaMTX**](https://github.com/bluenviron/mediamtx) **1.9.3** server at runtime — global settings, path defaults, streams, internal users, live HLS/WebRTC preview, connection monitoring, recordings and playback.

Node/Express backend that proxies the MediaMTX **v3 Control API** + a framework-free reactive vanilla-JS frontend. Designed for a **LAN / admin** scenario behind a reverse proxy — not to be exposed raw on the public internet.

This is a fork of [seekwhencer/mediamtx-ui](https://github.com/seekwhencer/mediamtx-ui) (which targets 1.16.0), **retargeted to MediaMTX 1.9.3** and security-hardened (see [Security](#-security)).

---

## ✨ Features

- Edit **all global server settings** at runtime (RTSP/RTMP/HLS/WebRTC/SRT, API, metrics, auth, recording…)
- Manage **path defaults** and individual **paths (streams)** — add / edit / delete
- Manage **internal users** (`authInternalUsers`)
- **Live preview** of streams in the browser — HLS (hls.js) with a per-tile **WebRTC/WHEP toggle** (embeds MediaMTX's low-latency player)
- **Monitoring** (live RTSP/RTMP/SRT/WebRTC connections & sessions), **Recordings** browser (list + delete segments), and **Playback** of recorded video
- **Light/dark theme** and **i18n** (English / Ukrainian) with an in-app switcher
- Forms auto-generated from the live config + inline help extracted from the annotated `mediamtx.yml`
- Session-based authentication (argon2) with CSRF protection and login rate-limiting
- Containerised, runs as a non-root user

---

## 🧭 Architecture

```
Browser ──HTTPS──> reverse proxy ──> mediamtx-ui (Node/Express, :3000)
                                          │
                                          ├── serves static vanilla-JS UI
                                          ├── /auth/*      session login (argon2 + CSRF)
                                          └── /mediamtx/*  → proxies MediaMTX v3 Control API
                                                              (http://mediamtx:9997/v3)
Browser ── media (HLS :8888 / WebRTC :8889 / Playback :9996) ──> MediaMTX 1.9.3
MediaMTX 1.9.3 ── RTSP/RTMP/HLS/WebRTC/SRT ──> cameras / players
```

Every Control-API call is proxied through the authenticated backend. Media itself
(HLS, the WebRTC reader, playback streams) is served by MediaMTX directly, like the
HLS player already hits `:8888`.

---

## 📦 Requirements

- Docker + Docker Compose
- A running (or co-deployed) **MediaMTX 1.9.3** server with its **Control API enabled** (`api: yes`, `apiAddress: :9997`), **metrics** (`metrics: yes`, `:9998`) and, for the Playback tab, the **playback server** (`playback: yes`, `:9996`). The bundled `config/mediamtx.default.yml` pre-enables all three.
- (Production) a reverse proxy terminating TLS in front of the UI

---

## 🚀 Deployment (Docker Compose)

### 1. Clone

```bash
git clone https://github.com/ogni831/mediamtx-ui.git
cd mediamtx-ui
```

### 2. Environment

```bash
cp .env.default .env
```

Edit `.env` and set a **session secret** (required — Compose refuses to start without it):

```bash
# generate one:
openssl rand -hex 32
```

```ini
SESSION_SECRET=<paste the generated hex>
# keep "false" for plain-HTTP LAN behind a proxy; "true" only when the UI is served over HTTPS end-to-end
SESSION_COOKIE_SECURE=false
SERVER_PORT=3000
```

### 3. Admin credentials

The login checks **both** username and password against argon2 hashes in `config/auth.json`. Generate them:

```bash
# run the generator once inside the container (or with local Node):
docker compose run --rm mediamtxui node generate_auth.js
```

Create `config/auth.json` with the resulting hash in **both** fields (or run the generator twice for distinct user/pass hashes):

```json
{
  "username": "$argon2id$v=19$m=65536,t=3,p=4$...hash-of-your-username...",
  "password": "$argon2id$v=19$m=65536,t=3,p=4$...hash-of-your-password..."
}
```

> ⚠️ In production the server **refuses to start** while the shipped `admin / admin` default is still in place.

### 4. MediaMTX config

```bash
cp config/mediamtx.default.yml config/mediamtx.yml
# edit ports / paths if needed — api + metrics are pre-enabled (required by the UI)
```

### 5. Run

```bash
# the MediaMTX server (image bluenviron/mediamtx:${MEDIAMTX_VERSION})
docker compose -f docker-compose-mediamtx.yml up -d

# the UI (binds to 127.0.0.1:3000)
docker compose up -d --build
```

The UI is now on `http://127.0.0.1:3000`. Put a reverse proxy in front to reach it from the LAN (see below).

---

## 🌐 Reverse proxy & TLS

The UI binds to **`127.0.0.1:3000`** on purpose — expose it via a TLS reverse proxy or an SSH tunnel, never directly on `0.0.0.0`.

An example nginx vhost (TLS + security headers + optional second Basic-auth layer) ships in **[`infra/nginx/mediamtx-ui.conf`](infra/nginx/mediamtx-ui.conf)**. When serving over HTTPS, set `SESSION_COOKIE_SECURE=true` in `.env`.

---

## ⚙️ Configuration reference

| Variable | Default | Description |
|---|---|---|
| `SESSION_SECRET` | — *(required)* | Signs session cookies. Unique per install. `openssl rand -hex 32` |
| `SESSION_COOKIE_SECURE` | `false` | `true` only when served over HTTPS end-to-end |
| `SESSION_STORE_PATH` | `/app/config/sessions` | File session store dir (production) |
| `SERVER_PORT` | `3000` | UI listen port |
| `MEDIAMTX_API_URL_BASE` | `http://mediamtx:9997/v3` | MediaMTX Control API base |
| `MEDIAMTX_METRICS_URL_BASE` | `http://mediamtx:9998/metrics` | MediaMTX metrics endpoint |
| `MEDIAMTX_VERSION` | `1.9.3-ffmpeg-rpi` | MediaMTX image tag |
| `RTSP_PORT` / `RTMP_PORT` / `HLS_PORT` / `WEBRTC_PORT` / `SRT_PORT` | 8554 / 1935 / 8888 / 8889 / 8890 | MediaMTX protocol ports |
| `METRICS_PORT` / `PLAYBACK_PORT` | 9998 / 9996 | MediaMTX metrics & playback-server ports |

---

## 🔒 Security

This fork hardens the original for real deployment:

- **Session secret required** — no hardcoded fallback; server throws in production if unset.
- **CSRF** via `csrf-sync` (synchroniser token); the deprecated `csurf` was removed.
- **Login rate-limiting** (10 attempts / 15 min per IP).
- **Refuses to start** in production on default `admin/admin` credentials.
- **File-backed sessions** in production (survive restarts).
- Output via `textContent` (no `innerHTML`) for user-influenced toast messages.
- **Container**: runs as non-root, official pinned `node:26-bookworm-slim` base (multi-stage, no build toolchain in the final image), `cap_drop: [ALL]`, `no-new-privileges`, loopback port binding, healthcheck, `.dockerignore` keeps secrets out of the image.
- **CSRF enforced on proxy/API mutations** (reads pass; all mutating calls send the token).
- Session id **regenerated on login** (anti session-fixation); proxy requests have a fetch timeout and never echo internal errors.
- MediaMTX metrics bound to loopback in the bundled compose.

> Still a LAN/admin tool: always run it behind an authenticated TLS reverse proxy if reachable beyond `localhost`.

---

## 🛠 Development

```bash
cd server
NODE_ENV=development npm install --include=dev

npm run build      # esbuild frontend + server bundles
npm start          # run locally (ephemeral session secret if SESSION_SECRET unset)
npm run gen:auth   # generate an argon2 hash for config/auth.json
npm run docs       # regenerate inline help (public/help/en.json) from default.yaml
```

For hot reload / livereload / USB-camera capture (Pi use case) use a `docker-compose.override.yml` — see the commented block at the bottom of [`docker-compose.yml`](docker-compose.yml). Never use `privileged: true`.

### Testing

```bash
npm run lint   # ESLint (flat config)
npm test       # node:test smoke suite (boots the server, checks auth/CSRF flow)
npm run e2e    # Playwright e2e (login, navigation, theme + language) — needs:
               #   npx playwright install --with-deps chromium
```

CI (GitHub Actions) runs lint + build + smoke and a separate Playwright e2e job on every push/PR.

---

## 📜 Credits & license

Fork of **[seekwhencer/mediamtx-ui](https://github.com/seekwhencer/mediamtx-ui)** by Matthias Kallenbach. Retargeted to MediaMTX 1.9.3, reconstructed reactive settings layer, and security-hardened. Licensed **ISC** (as upstream).
