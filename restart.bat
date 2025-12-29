@echo off
echo Stopping all Node processes...
taskkill /F /IM node.exe /T 2>nul
timeout /t 2 /nobreak >nul
echo.
echo All Node processes stopped.
echo.
echo Starting server from correct directory...
cd /d "%~dp0"
npm run dev
