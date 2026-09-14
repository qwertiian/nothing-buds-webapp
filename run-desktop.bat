@echo off
title Ear (OS) - Desktop Companion
cd /d "%~dp0"

if exist "%LOCALAPPDATA%\Programs\node-v20.18.0-win-x64" (
    set "PATH=%LOCALAPPDATA%\Programs\node-v20.18.0-win-x64;%PATH%"
)

echo ========================================================
echo  Starting Ear (OS) - Nothing ^& CMF Buds Desktop App
echo ========================================================

if not exist "dist" (
    echo Building application...
    call npm run build
)

call npm start
pause
