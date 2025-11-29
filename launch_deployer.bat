@echo off
TITLE Trap Wars Deployer
COLOR 0A

echo ========================================================
echo        TRAP WARS - DEPLOYMENT MANAGER
echo ========================================================
echo.
echo Initializing...
echo.

:: Check if Node is installed
node --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed! Please install Node.js to continue.
    pause
    exit /b
)

:: Run the script
echo Starting Deployment CLI...
node scripts/deploy-cli.js

pause
