# Deploying jfleischer.com

This app is a **static Vite build**. `npm run build` emits `dist/` — plain HTML, CSS, JS and an SVG favicon. There is no server runtime, no database, no API. Whatever hosts it only needs to serve files; Node is needed at *build* time.

Replace `jfleischer.com` with your domain and `deploy` with your user throughout.

---

## Which path?

**Path A — Coolify (Docker).** The server runs Coolify. It builds the image from git, terminates TLS through its bundled Traefik proxy, and redeploys on every push. You never touch nginx or certbot on the box.

**Path B — Debian + nginx by hand.** You own the web server, rsync `dist/` to it, and run certbot yourself. Documented further down, and still valid.

The repo carries a `Dockerfile`, an `nginx.conf` and a `.dockerignore` for Path A. Path B ignores all three.

---

# Path A — Coolify (Docker)

## A1. What the image is

`Dockerfile` is two-stage:

- **build** — `node:22-alpine`, `npm ci`, `npm run build`. Node 22 satisfies Vite 8's engine requirement, which Debian 12's packaged Node does not.
- **runtime** — `nginx:1.27-alpine` serving `/usr/share/nginx/html`, with `nginx.conf` copied to `/etc/nginx/conf.d/default.conf`.

No Node and no `node_modules` survive into the runtime layer. The final image is ~79 MB. `nginx.conf` carries the same rules as the hand-rolled config in Path B: SPA fallback, `immutable` caching for `/assets/`, `no-cache` for `index.html`, gzip.

`.dockerignore` keeps `node_modules`, `dist`, `.git` and `.gstack` out of the build context, so the build does not ship a stale `dist/` into the image or upload 300 MB of dependencies to the daemon.

## A2. Test the image locally before involving the server

```bash
docker build -t jfleischer-com:local .
docker run --rm -p 8088:80 jfleischer-com:local
```

```bash
curl -s http://localhost:8088/ | grep -o '<title>[^<]*</title>'
curl -sI -H 'Accept-Encoding: gzip' \
  http://localhost:8088/assets/$(ls dist/assets | grep '\.js$' | head -1) \
  | grep -i 'content-encoding\|cache-control'
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8088/anything   # 200 = SPA fallback works
```

The container also has a `HEALTHCHECK`; `docker inspect --format '{{.State.Health.Status}}' <name>` must say `healthy`. Coolify reads that same healthcheck when deciding whether a deployment succeeded.

## A3. Push the source to git

Coolify deploys *from a repository*, not from your laptop.

```bash
git init
git add -A
git commit -m "Initial commit"
git remote add origin git@github.com:<user>/jfleischer-com.git
git push -u origin main
```

`dist/` and `node_modules` are already in `.gitignore` — keep it that way. Coolify builds `dist/` itself inside the image.

## A4. Point DNS at the server first

An A record for `jfleischer.com` (and `www`) to the Coolify host, **before** you deploy. Let's Encrypt validates over HTTP; if DNS is not live yet the certificate fails and you wait for Coolify's retry.

## A5. Create the resource in Coolify

1. **Projects → New Resource → Private Repository (via GitHub App)**, or *Public Repository* if the repo is public.
2. **Build Pack: `Dockerfile`.** Not Nixpacks — Nixpacks guesses, the Dockerfile is exact.
3. **Port: `80`.** Coolify reads `EXPOSE 80`, but check the "Ports Exposes" field anyway.
4. **Domain: `https://jfleischer.com`.** Coolify wires up Traefik and requests the certificate. This replaces sections 2 and 4 of Path B entirely.
5. **Deploy.**

Every later `git push` triggers a rebuild through the webhook. Turn that off in the resource settings if you want manual deploys.

## A6. Alternative: build the image yourself and push it to a registry

Only worth it if you do not want a git remote, or the server is too small to build. You lose auto-deploy.

```bash
# Your Mac is arm64, the server is almost certainly amd64 — this flag is not optional
docker build --platform linux/amd64 -t ghcr.io/<user>/jfleischer-com:0.1.0 .
echo "$GITHUB_TOKEN" | docker login ghcr.io -u <user> --password-stdin
docker push ghcr.io/<user>/jfleischer-com:0.1.0
```

In Coolify: **New Resource → Docker Image**, enter the image, port `80`, domain, deploy.

Bump the tag on every build. Reusing `:latest` invites Coolify to keep running the cached image, and you will spend twenty minutes debugging a deployment that "succeeded" with the old bundle.

## A7. Verify

```bash
curl -sI https://jfleischer.com | head -20
curl -s https://jfleischer.com | grep -o '<title>[^<]*</title>'
```

Then open it in a browser and confirm the particle cloud is **moving on its own**, without touching the mouse — same check as Path B, same failure mode (see `src/three/NeuralCore.tsx`).

---

# Path B — Debian + nginx by hand

## Decide first: where do you build?

**Option A — build locally, ship `dist/` (recommended).**
The server never needs Node, npm, or the 300 MB `node_modules`. Fewer moving parts, nothing to keep patched.

**Option B — build on the server.**
Only worth it if you want `git pull && npm ci && npm run build` on the box. Requires Node 20.19+ or 22.12+ (Vite 8's engine requirement) — Debian 12's packaged Node is too old, so you'd add NodeSource or nvm.

The rest of this sheet assumes **Option A** and notes the Option B differences at the end.

---

## 1. Server: nginx and a web root

```bash
sudo apt update
sudo apt install -y nginx
sudo mkdir -p /var/www/jfleischer
sudo chown -R deploy:deploy /var/www/jfleischer
```

If `ufw` is active:

```bash
sudo ufw allow 'Nginx Full'
```

## 2. Server: nginx site config

```bash
sudo nano /etc/nginx/sites-available/jfleischer
```

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name jfleischer.com www.jfleischer.com;

    root /var/www/jfleischer;
    index index.html;

    # Client-side routes (/lebenslauf) have no file on disk — serve the app
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Résumé PDF and portrait are static and versioned by hand
    location /cv/ {
        add_header Cache-Control "public, max-age=86400";
    }

    # Vite fingerprints every asset filename, so they can be cached forever
    location /assets/ {
        access_log off;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # index.html must never be cached, or clients pin to a dead build
    location = /index.html {
        add_header Cache-Control "no-cache, must-revalidate";
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/css application/javascript image/svg+xml application/json;

    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

Enable it and reload:

```bash
sudo ln -s /etc/nginx/sites-available/jfleischer /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

The JS bundle is ~1.2 MB raw / ~326 kB gzipped (three.js plus postprocessing), so **gzip is not optional here** — it is the difference between a 1.2 MB and a 326 kB first load. Brotli is better still if you install `libnginx-mod-http-brotli`.

## 3. Local: build and ship

```bash
cd ~/Dev/AI/truelab.ai
npm ci
npm run build

rsync -avz --delete dist/ deploy@jfleischer.com:/var/www/jfleischer/
```

`--delete` removes the previous build's fingerprinted assets. That is what you want — stale `assets/index-*.js` files otherwise accumulate forever.

Keep this as `deploy.sh` if you like:

```bash
#!/usr/bin/env bash
set -euo pipefail
npm ci
npm run build
rsync -avz --delete dist/ deploy@jfleischer.com:/var/www/jfleischer/
echo "deployed $(date -u +%FT%TZ)"
```

## 4. TLS

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d jfleischer.com -d www.jfleischer.com
```

Certbot rewrites the nginx config for 443 and installs a renewal timer. Check it:

```bash
systemctl list-timers | grep certbot
sudo certbot renew --dry-run
```

## 5. Verify

```bash
curl -sI https://jfleischer.com | head -20
curl -s https://jfleischer.com | grep -o '<title>[^<]*</title>'
curl -sI https://jfleischer.com/assets/$(ls dist/assets | grep '\.js$') | grep -i 'content-encoding\|cache-control'
```

Then open it in a browser and confirm the particle cloud is **moving on its own**, without touching the mouse. A frozen-but-correct-looking cloud is the exact failure mode this scene had once — see the comment in `src/three/NeuralCore.tsx` about three cloning uniforms.

---

## Option B: building on the server

Debian 12's `nodejs` package is too old for Vite 8. Install Node 22:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v   # must be >= 22.12.0 (or >= 20.19.0 on the 20.x line)
```

Then:

```bash
git clone <your-repo> /srv/jfleischer-src
cd /srv/jfleischer-src
npm ci
npm run build
sudo rsync -a --delete dist/ /var/www/jfleischer/
```

Use `npm ci`, never `npm install`, so the lockfile decides the versions.

---

## Things that will bite you

- **Do not run `npm update` or bump React.** `react` and `react-dom` are pinned to exactly `19.2.0` because `@react-three/fiber@9.7.0` declares a peer range of `>=19 <19.3`. npm will happily resolve `react@19.3.x` and the install then fails with `ERESOLVE`. If you hit that on a fresh machine, the fix is the pin, not `--legacy-peer-deps`.
- **WebGL needs no server support** — it is all client-side. If the cloud doesn't render, it is the visitor's browser/GPU, not the server. The scene has no 2D fallback today; a visitor without WebGL sees the page with an empty background.
- **Fonts load from Google.** `src/index.css:1` imports Space Grotesk and JetBrains Mono from `fonts.googleapis.com`, so every visitor's browser contacts Google. If this site should be self-contained (or GDPR-clean without a consent banner), self-host the two families with `@fontsource/space-grotesk` and `@fontsource/jetbrains-mono` and drop the `@import`.
- **`dist/` is a build artifact.** Don't edit files under `/var/www/jfleischer` on the server; the next rsync `--delete` wipes them.
- **On Coolify the container filesystem is disposable.** Anything written inside a running container is gone on the next deploy. Nothing here writes at runtime, so this only matters if you later add uploads — that needs a Coolify volume.
- **No SPA routes exist.** Navigation is hash-based (`#directory`), so `try_files` never actually fires. If you later add real routes, that line is already in place.
