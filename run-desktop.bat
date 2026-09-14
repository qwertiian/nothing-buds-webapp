@echo off
title Ear (OS) - Desktop Companion
cd /d "%~dp0"
set "PATH=%LOCALAPPDATA%\Programs\node-v20.18.0-win-x64;%PATH%"
echo Starting Ear (OS) Nothing Buds Desktop Companion...
call npm start
pause
