#!/bin/bash

# PNG Electoral System - GitHub Deployment Script
echo "🇵🇬 PNG Electoral System - Deploying to GitHub"
echo "================================================"

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
fi

# Add all files
echo "📋 Adding files to git..."
git add .

# Commit with timestamp
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
echo "💾 Committing changes..."
git commit -m "PNG Electoral System update - $TIMESTAMP"

# Add remote if not exists
if ! git remote | grep -q origin; then
    echo "🔗 Adding GitHub remote..."
    git remote add origin https://github.com/emabi2002/pngelectoralsystem.git
fi

# Create main branch if not exists
if ! git branch | grep -q main; then
    echo "🌟 Creating main branch..."
    git branch -M main
fi

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Successfully deployed to GitHub!"
echo "🌐 Repository: https://github.com/emabi2002/pngelectoralsystem"
echo ""
echo "Next steps:"
echo "1. Visit your GitHub repository"
echo "2. Set up automatic deployment (Netlify/Vercel)"
echo "3. Configure environment variables"
echo "4. Initialize database by visiting /setup"
echo ""
echo "🎯 Ready for workshop demonstration!"
echo "   October 13-15, 2025 • Hilton Hotel, Port Moresby"
