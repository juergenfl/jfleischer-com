#!/usr/bin/env bash
#
# Deploy the current commit to Coolify and prove that it actually went live.
#
# Coolify records the git SHA it built for every deployment, so that record —
# not the HTTP status of the site — is what certifies a release. A 200 from
# jfleischer.com only says nginx is up; it says nothing about which bundle is
# behind it. Asset hashes are no help either: the server builds in
# node:22-alpine and its fingerprints differ from a local `npm run build` for
# byte-identical source.
#
# Usage:
#   scripts/deploy.sh            trigger a deploy, wait for it, verify
#   scripts/deploy.sh --check    verify only; touches nothing
#
# Configuration comes from the environment, or from .env.deploy beside this
# repo (gitignored — the API token must never be committed):
#   COOLIFY_HOST            e.g. http://192.0.2.10:8000
#   COOLIFY_RESOURCE_UUID   the application's uuid in Coolify
#   COOLIFY_TOKEN           Keys & Tokens -> API tokens
#   SITE_URL                defaults to https://jfleischer.com

set -euo pipefail

ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
cd "$ROOT"

[ -f .env.deploy ] && . ./.env.deploy

: "${COOLIFY_HOST:?set COOLIFY_HOST (see the header of this script)}"
: "${COOLIFY_RESOURCE_UUID:?set COOLIFY_RESOURCE_UUID}"
: "${COOLIFY_TOKEN:?set COOLIFY_TOKEN}"
SITE_URL=${SITE_URL:-https://jfleischer.com}

CHECK_ONLY=false
[ "${1:-}" = "--check" ] && CHECK_ONLY=true

API="$COOLIFY_HOST/api/v1"
AUTH=(-H "Authorization: Bearer $COOLIFY_TOKEN")
TIMEOUT_SECONDS=600

say() { printf '%s\n' "$*"; }
die() { printf 'FEHLER: %s\n' "$*" >&2; exit 1; }

# Ask Coolify for the most recent deployments of this application.
deployments() {
  curl -sf -m 30 "${AUTH[@]}" "$API/deployments/applications/$COOLIFY_RESOURCE_UUID?take=10"
}

# ── 1. Is the commit we want even reachable by Coolify? ──────────────────────
# Coolify clones from GitHub, so an unpushed commit cannot be deployed, and a
# dirty tree means the SHA we verify against is not what you are looking at.

HEAD_SHA=$(git rev-parse HEAD)
say "Commit:    ${HEAD_SHA:0:8} ($(git log -1 --format=%s))"

if [ -n "$(git status --porcelain)" ]; then
  die "Arbeitsverzeichnis ist nicht sauber. Erst committen, dann deployen."
fi

git fetch -q origin main
if ! git merge-base --is-ancestor "$HEAD_SHA" origin/main; then
  die "HEAD ist nicht auf origin/main. Erst 'git push origin main'."
fi

# ── 2. Trigger ───────────────────────────────────────────────────────────────

WANTED_DEPLOYMENT=""

if [ "$CHECK_ONLY" = false ]; then
  say "Trigger:   Deploy wird angestoßen ..."
  RESPONSE=$(curl -sf -m 30 -X POST "${AUTH[@]}" \
    "$API/deploy?uuid=$COOLIFY_RESOURCE_UUID&force=false") \
    || die "Coolify hat den Deploy nicht angenommen. Host, UUID und Token prüfen."

  WANTED_DEPLOYMENT=$(printf '%s' "$RESPONSE" | jq -r '.deployments[0].deployment_uuid // empty')
  [ -n "$WANTED_DEPLOYMENT" ] || die "Antwort ohne deployment_uuid: $RESPONSE"
  say "           deployment_uuid ${WANTED_DEPLOYMENT:0:8}"
fi

# ── 3. Warten ────────────────────────────────────────────────────────────────
# Without a trigger there is nothing to wait for; --check reads the record that
# is already there.

if [ -n "$WANTED_DEPLOYMENT" ]; then
  say "Warten:    auf Coolify (Abbruch nach $((TIMEOUT_SECONDS / 60)) Minuten) ..."
  DEADLINE=$(( $(date +%s) + TIMEOUT_SECONDS ))
  STATUS=""

  while :; do
    STATUS=$(deployments | jq -r --arg u "$WANTED_DEPLOYMENT" \
      '.deployments[] | select(.deployment_uuid == $u) | .status' | head -1)

    case "$STATUS" in
      finished) say "           fertig."; break ;;
      failed|cancelled-by-user)
        die "Coolify meldet '$STATUS'. Das Log steht in der Coolify-Oberfläche." ;;
    esac

    [ "$(date +%s)" -lt "$DEADLINE" ] \
      || die "Nach $((TIMEOUT_SECONDS / 60)) Minuten immer noch '${STATUS:-unbekannt}'."

    sleep 10
  done
fi

# ── 4. Beweis ────────────────────────────────────────────────────────────────
# Two independent facts: Coolify's newest finished build is our SHA, and the
# site answers. Either alone can lie.

LIVE_SHA=$(deployments | jq -r '[.deployments[] | select(.status == "finished")][0].commit // empty')
[ -n "$LIVE_SHA" ] || die "Coolify kennt kein abgeschlossenes Deployment für diese Resource."

if [ "$LIVE_SHA" != "$HEAD_SHA" ]; then
  die "Coolify hat zuletzt ${LIVE_SHA:0:8} gebaut, erwartet war ${HEAD_SHA:0:8}."
fi
say "Coolify:   ${LIVE_SHA:0:8} gebaut und abgeschlossen."

CODE=$(curl -s -m 30 -o /dev/null -w '%{http_code}' "$SITE_URL") || CODE=000
[ "$CODE" = "200" ] || die "$SITE_URL antwortet mit HTTP $CODE."
say "Seite:     $SITE_URL antwortet mit 200."

say ""
say "Deployment bestätigt: ${HEAD_SHA:0:8} ist live."
