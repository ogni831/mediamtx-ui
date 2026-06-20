# Contributing

Thanks for your interest in improving **mediamtx-ui**.

## Project layout

```
server/
  index.js              app entry (Node/Express)
  lib/                  backend: Server, Auth, MediaMTX proxy, config, routes/Auth
  public/js/            framework-free reactive frontend (served as ES modules)
  public/css/           styles (page.css imports the rest)
  test/                 node:test smoke suite
  e2e/                  Playwright tests (+ mock MediaMTX, server wrapper)
config/                 runtime config (gitignored: auth.json, mediamtx.yml, .env)
infra/nginx/            example reverse-proxy vhost
```

## Dev setup

```bash
cd server
NODE_ENV=development npm install --include=dev
npm run gen:auth        # create config/auth.json (argon2)
SESSION_SECRET=dev npm start
```

The frontend is plain ES modules served from `public/` — no build step is needed
to run it. `npm run build` produces optimised esbuild bundles.

## Before opening a PR

```bash
cd server
npm run lint    # ESLint — keep it at 0 errors
npm run build   # frontend + server bundles must compile
npm test        # smoke suite (boots the server, checks auth/CSRF)
npm run e2e     # Playwright (needs: npx playwright install --with-deps chromium)
```

CI runs all of the above on every push/PR (Node 26).

## Conventions

- Render user-influenced text with `textContent`, not `innerHTML`.
- All state-changing requests must carry the `CSRF-Token` header.
- Add user-facing strings to `public/js/i18n.js` (EN + UK) and use `t('key')`.
- Never commit secrets; `config/auth.json`, `.env` and sessions are gitignored.
- Keep the container non-root; never use `privileged: true`.
