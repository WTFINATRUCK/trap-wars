@echo off
set URL=%1

if "%URL%"=="" (
    echo.
    echo ERROR: You must provide your GitHub URL.
    echo Usage: setup_git.bat https://github.com/YOUR_USERNAME/trap-wars.git
    echo.
    pause
    exit /b 1
)

echo.
echo ==========================================
echo   SETTING UP GITHUB REPO
echo ==========================================
echo.

echo 1. Initializing Git...
git init

echo.
echo 2. Adding files...
git add .

echo.
echo 3. Committing files...
git commit -m "Initial commit of TRAP WARS"

echo.
echo 4. Linking to GitHub...
git branch -M main
git remote remove origin 2>nul
git remote add origin %URL%

echo.
echo 5. Pushing to GitHub...
git push -u origin main

echo.
echo ==========================================
echo   DONE!
echo ==========================================
echo.
echo If there were no errors above, your code is now on GitHub.
echo Copy this URL to v0.dev: %URL%
echo.
pause
