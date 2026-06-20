# Changelog

All notable changes to this project are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.0.0] — 2026-06-20

First stable release. **1.9.3 adaptation by deadSam** of
[seekwhencer/mediamtx-ui](https://github.com/seekwhencer/mediamtx-ui)
(which targets 1.16.0): retargeted to MediaMTX 1.9.3, with the gitignored
reactive settings layer reconstructed, runtime bugs fixed, and the project
security-hardened and modernised.

### Added
- Tabs: **Overview** (HLS + per-tile WebRTC/WHEP toggle), **Streams**, **Server**,
  **Path Defaults**, **Users**, **Monitoring** (live RTSP/RTMP/SRT/WebRTC
  connections & sessions), **Recordings** (list + delete segments), **Playback**
  (recorded video).
- **i18n** (English / Ukrainian) with an in-app switcher.
- **Light/dark theme** (OS-aware, persisted), including a theme-aware video frame.
- **Reverse-proxy example** (`infra/nginx/mediamtx-ui.conf`).
- **Tests**: node:test smoke suite + Playwright e2e; GitHub Actions CI
  (lint + build + smoke, and a separate e2e job).
- ESLint (flat) + Prettier, Dependabot, LICENSE (ISC).

### Changed
- Retargeted config schema and Control-API surface to MediaMTX 1.9.3
  (`protocols`, `encryption`, `serverKey`/`serverCert`, singular `*AllowOrigin`;
  no `/v3/info` or `/v3/auth/jwks/refresh`).
- Docker: multi-stage, official pinned `node:26-bookworm-slim`, non-root,
  `cap_drop: [ALL]`, `no-new-privileges`, loopback port binding, healthcheck.

### Security
- `SESSION_SECRET` required (no hardcoded fallback); refuses to start in
  production without it or while default `admin/admin` credentials remain.
- CSRF (`csrf-sync`) enforced on `/auth` and on proxy/API mutations.
- Session id regenerated on login; login rate-limiting; file-backed sessions in
  production; proxy fetch timeout; no internal error leakage.
- Toasts use `textContent`; secrets kept out of the image via `.dockerignore`.

### Fixed
- Reconstructed the entire (upstream-gitignored) reactive settings layer.
- Object-based form `Component` (was a half-finished positional constructor).
- Graceful shutdown (SIGINT/SIGTERM); robust `video.play()`; many smaller bugs.

### Removed
- Dead legacy code (Pi/ffmpeg streaming cluster, old Users/Streams duplicates,
  unused `/api` stub routes).
