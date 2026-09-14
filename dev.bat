@echo off
title Ear (OS) - Dev Server
cd /d "%~dp0"
set "PATH=%LOCALAPPDATA%\Programs\node-v20.18.0-win-x64;%PATH%"
echo Starting Ear (OS) Web Development Server...
call npm run dev
pause

