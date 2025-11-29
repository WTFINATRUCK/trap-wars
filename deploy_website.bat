@echo off
echo ====================================
echo   TRAP WARS - Website Deployment
echo ====================================
echo.

echo Step 1: Building the website...
echo This may take a few minutes...
echo.

cd app
call npm run build

if errorlevel 1 (
    echo.
    echo ERROR: Build failed!
    echo Please check the error messages above.
    pause
    exit /b 1
)

echo.
echo ====================================
echo   BUILD COMPLETE!
echo ====================================
echo.
echo The website is ready in the ".next" folder.
echo.
echo NEXT STEPS:
echo 1. Go to https://app.netlify.com/drop
echo 2. Drag the ENTIRE "app\.next" folder to the browser
echo 3. Wait for it to upload - done!
echo.
echo OR you can use Vercel:
echo 1. Run: npm install -g vercel
echo 2. Run: vercel --prod
echo.
echo Your site will be live in seconds!
echo.
pause
