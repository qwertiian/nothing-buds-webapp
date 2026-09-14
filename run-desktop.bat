@echo off
title Ear (OS) - Nothing Buds Companion
cd /d "%~dp0"
echo Starting Ear (OS) Nothing Buds Desktop Companion...
call npm run build
call npm start
pause
