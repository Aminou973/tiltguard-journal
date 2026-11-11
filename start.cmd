@echo off
rem TiltGuard Journal one-click start (Windows): installs and builds on first run, then starts and opens the app.
setlocal
cd /d "%~dp0"
where node >nul 2>nul || (echo Node.js 22+ is required: https://nodejs.org/ & pause & exit /b 1)
where pnpm >nul 2>nul || (echo [Journal] Enabling pnpm via corepack... & call corepack enable || (echo Run this window as administrator once, or: npm i -g pnpm & pause & exit /b 1))
if not exist node_modules (
  echo [Journal] First run: installing dependencies ^(a few minutes^)...
  call pnpm install || (pause & exit /b 1)
)
if not exist apps\web\.next\BUILD_ID (
  echo [Journal] Building...
  call pnpm build || (pause & exit /b 1)
)
start "" http://localhost:3000
call pnpm start
pause
