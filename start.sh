#!/usr/bin/env bash
# TiltGuard Journal one-click start (macOS / Linux): installs and builds on first run, then starts and opens the app.
set -e
cd "$(dirname "$0")"
command -v node >/dev/null || { echo "Node.js 22+ is required: https://nodejs.org/"; exit 1; }
command -v pnpm >/dev/null || corepack enable
[ -d node_modules ] || { echo "[Journal] First run: installing dependencies..."; pnpm install; }
[ -f apps/web/.next/BUILD_ID ] || { echo "[Journal] Building..."; pnpm build; }
( sleep 4; (xdg-open http://localhost:3000 || open http://localhost:3000) >/dev/null 2>&1 ) &
exec pnpm start
