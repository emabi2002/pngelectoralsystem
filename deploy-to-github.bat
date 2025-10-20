@echo off
cls

REM PNG Electoral System - GitHub Deployment Script (Windows)
echo 🇵🇬 PNG Electoral System - Deploying to GitHub
echo ================================================

REM Check if git is initialized
if not exist .git (
    echo 📦 Initializing Git repository...
    git init
)

REM Add all files
echo 📋 Adding files to git...
git add .

REM Commit with timestamp
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
set "timestamp=%YYYY%-%MM%-%DD% %HH%:%Min%:%Sec%"

echo 💾 Committing changes...
git commit -m "PNG Electoral System update - %timestamp%"

REM Add remote if not exists
git remote | findstr origin >nul
if errorlevel 1 (
    echo 🔗 Adding GitHub remote...
    git remote add origin https://github.com/emabi2002/pngelectoralsystem.git
)

REM Create main branch if not exists
git branch | findstr main >nul
if errorlevel 1 (
    echo 🌟 Creating main branch...
    git branch -M main
)

REM Push to GitHub
echo 🚀 Pushing to GitHub...
git push -u origin main

echo.
echo ✅ Successfully deployed to GitHub!
echo 🌐 Repository: https://github.com/emabi2002/pngelectoralsystem
echo.
echo Next steps:
echo 1. Visit your GitHub repository
echo 2. Set up automatic deployment (Netlify/Vercel)
echo 3. Configure environment variables
echo 4. Initialize database by visiting /setup
echo.
echo 🎯 Ready for workshop demonstration!
echo    October 13-15, 2025 • Hilton Hotel, Port Moresby

pause
