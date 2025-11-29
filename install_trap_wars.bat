@echo off
TITLE Trap Wars Installer
COLOR 0B

echo ========================================================
echo        TRAP WARS - ONE CLICK INSTALLER
echo ========================================================
echo.
echo This script will setup the environment and create shortcuts.
echo.

:: Bypass PowerShell execution policy to run the setup script
PowerShell -NoProfile -ExecutionPolicy Bypass -Command "& './scripts/setup.ps1'"

pause
