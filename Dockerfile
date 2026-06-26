# =============================================================================
# Multi-stage build. Official, pinned Node image — no :latest, no `curl | bash`.
# Pin to a digest at deploy time for full reproducibility:
#   FROM node:26.3.1-bookworm-slim@sha256:<digest> AS deps
# =============================================================================

# --- deps: compile native modules (argon2) with a toolchain, then discard it --
FROM node:26.4.0-bookworm-slim AS deps
WORKDIR /app/server
COPY server/package*.json ./
RUN apt-get update \
 && apt-get install -y --no-install-recommends python3 make g++ \
 && npm ci --omit=dev \
 && rm -rf /var/lib/apt/lists/*

# --- runtime: slim image with no build tools -------------------------------
FROM node:26.4.0-bookworm-slim AS runtime
WORKDIR /app

# Pre-built node_modules from the deps stage (same base → ABI-compatible).
COPY --from=deps /app/server/node_modules ./server/node_modules

# App source (see .dockerignore — node_modules, .env, config/auth.json excluded).
COPY . .

# Run as the built-in non-root "node" user (uid 1000), owner of the writable
# config dir (auth.json, rotated yml, sessions).
RUN mkdir -p /app/config/sessions && chown -R node:node /app
USER node

WORKDIR /app/server
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.SERVER_PORT||3000)+'/auth/status').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "index.js"]
