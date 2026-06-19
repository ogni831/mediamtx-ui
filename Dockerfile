# Official, pinned Node image — no :latest, no `curl | bash` bootstrap.
# (Pin further to a digest at deploy time: FROM node:22.13.1-bookworm-slim@sha256:...)
FROM node:22.13.1-bookworm-slim

WORKDIR /app/server

# Install only runtime deps. argon2 is a native module, so a toolchain is
# needed during install; it is removed afterwards to keep the image lean.
COPY server/package*.json ./
RUN apt-get update \
 && apt-get install -y --no-install-recommends python3 make g++ \
 && npm ci --omit=dev \
 && apt-get purge -y python3 make g++ \
 && apt-get autoremove -y \
 && rm -rf /var/lib/apt/lists/*

# App source (see .dockerignore — node_modules, .env and config/auth.json are
# never copied into the image).
WORKDIR /app
COPY . .

# Drop privileges: run as the built-in non-root "node" user (uid 1000),
# which owns the writable config dir (auth.json, rotated yml, sessions).
RUN mkdir -p /app/config/sessions && chown -R node:node /app
USER node

WORKDIR /app/server
EXPOSE 3000
CMD ["node", "index.js"]
