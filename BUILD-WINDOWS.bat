@echo off
title Build Birthday Surprise
echo Installing app dependencies...
call npm install
if errorlevel 1 goto failed
echo Building Windows installer...
call npm run dist
if errorlevel 1 goto failed
echo.
echo Done! Installer is inside the dist folder.
pause
exit /b 0
:failed
echo Build failed. Check that Node.js 20+ is installed and internet is available.
pause
exit /b 1
