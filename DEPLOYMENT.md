# 🚀 PNG Electoral System - Deployment Guide

This guide will help you deploy the PNG Digital Electoral Transformation System to GitHub and various hosting platforms.

## 📋 Prerequisites

Before deploying, ensure you have:
- [x] GitHub account
- [x] Supabase project (already configured: `usipijjyqfpxmhjbebyo.supabase.co`)
- [x] Git installed on your computer
- [x] Node.js 18+ or Bun installed

## 📦 Step 1: Prepare for GitHub Deployment

### 1.1 Navigate to your project directory
```bash
cd png-digital-electoral-system
```

### 1.2 Initialize Git repository (if not already done)
```bash
git init
git add .
git commit -m "Initial commit: PNG Electoral System"
```

### 1.3 Add your GitHub repository as remote
```bash
git remote add origin https://github.com/emabi2002/pngelectoralsystem.git
```

### 1.4 Push to GitHub
```bash
git branch -M main
git push -u origin main
```

## 🌐 Step 2: Platform Deployment Options

### Option A: Netlify Deployment (Recommended)

1. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub account
   - Select `emabi2002/pngelectoralsystem`

2. **Configure Build Settings:**
   ```
   Build command: bun run build
   Publish directory: .next
   ```

3. **Add Environment Variables:**
   Go to Site Settings > Environment Variables and add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://usipijjyqfpxmhjbebyo.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. **Deploy:**
   - Click "Deploy site"
   - Your site will be available at a Netlify URL

### Option B: Vercel Deployment

1. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

2. **Configure Environment Variables:**
   Add the same environment variables as above in Project Settings

3. **Deploy:**
   - Automatic deployment on every git push

### Option C: GitHub Pages (Static)

1. **Enable GitHub Pages:**
   - Go to your GitHub repository
   - Settings > Pages
   - Source: GitHub Actions

2. **The GitHub Action will automatically deploy on push**

## 🔧 Step 3: Post-Deployment Setup

### 3.1 Initialize Database
Once deployed, visit your live site and go to `/setup` to:
- Test Supabase connection
- Create database tables
- Populate PNG administrative data
- Verify system functionality

### 3.2 Test Core Features
1. **Voter Registration** (`/register`)
   - Test facial recognition
   - Complete registration flow

2. **Smart ID Verification** (`/verify`)
   - Test with demo ID: `12345678`

3. **Results Dashboard** (`/dashboard`)
   - View real-time statistics
   - Interact with PNG map

4. **Language Switching**
   - Test English/Tok Pisin translation

## 🔒 Step 4: Security Configuration

### 4.1 Environment Variables
Ensure these are set in your hosting platform:
```env
NEXT_PUBLIC_SUPABASE_URL=https://usipijjyqfpxmhjbebyo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_PNG_DIGITAL_ID_API_URL=https://yoursite.com/api/nid
NEXT_PUBLIC_ENCRYPTION_KEY=png_electoral_demo_key_2025
```

### 4.2 Supabase Security
- Row Level Security is enabled
- API keys are properly scoped
- Database policies protect sensitive data

## 📊 Step 5: Monitoring & Analytics

### 5.1 Real-time Monitoring
- Dashboard shows live system statistics
- WebSocket connections for real-time updates
- Audit trail tracks all system activities

### 5.2 Performance Monitoring
- Use hosting platform analytics
- Monitor Supabase usage and performance
- Track user engagement metrics

## 🧪 Step 6: Testing Your Deployment

### Workshop Demonstration Checklist:
- [ ] Main dashboard loads correctly
- [ ] Language switcher works (English/Tok Pisin)
- [ ] Voter registration with face capture
- [ ] Smart ID verification flow
- [ ] Interactive PNG map functionality
- [ ] Real-time data updates
- [ ] Polling results upload
- [ ] Audit trail viewing
- [ ] Mobile responsiveness
- [ ] Offline PWA capabilities

## 🔄 Step 7: Continuous Deployment

### Automatic Deployment Setup:
1. **GitHub Actions** (included in `.github/workflows/deploy.yml`)
2. **Automatic builds** on every push to main branch
3. **Environment variable** management
4. **Build optimization** and error checking

### Manual Deployment Updates:
```bash
# Make changes to your code
git add .
git commit -m "Update: describe your changes"
git push origin main
```

## 🚨 Troubleshooting

### Common Issues:

1. **Build Failures:**
   - Check environment variables are set
   - Verify Supabase connection
   - Review build logs for specific errors

2. **Database Connection:**
   - Visit `/setup` to initialize database
   - Check Supabase project URL and keys
   - Verify network connectivity

3. **Face Recognition:**
   - Ensure camera permissions
   - Check HTTPS is enabled (required for camera access)
   - Test with good lighting conditions

4. **Map Not Loading:**
   - Check Leaflet CSS imports
   - Verify component hydration
   - Test on different browsers

## 📱 Step 8: Mobile & PWA Testing

### Progressive Web App:
- [ ] Service worker registration
- [ ] Offline functionality
- [ ] Add to home screen capability
- [ ] Mobile responsive design

### Mobile Testing:
- [ ] Touch interactions work
- [ ] Camera access for facial recognition
- [ ] Form inputs are accessible
- [ ] Performance on mobile networks

## 🎯 Workshop Demonstration URLs

Once deployed, your key demonstration URLs will be:
- **Main Dashboard:** `https://yourdomain.com/`
- **System Setup:** `https://yourdomain.com/setup`
- **Voter Registration:** `https://yourdomain.com/register`
- **Results Dashboard:** `https://yourdomain.com/dashboard`
- **Smart ID Verification:** `https://yourdomain.com/verify`

## ✅ Success Metrics

Your deployment is successful when:
- [ ] All pages load without errors
- [ ] Database connection is established
- [ ] Real-time features work
- [ ] Multilingual support functions
- [ ] Biometric features are accessible
- [ ] Mobile experience is smooth
- [ ] System passes workshop demonstration requirements

## 📞 Support

For deployment issues:
1. Check the console for error messages
2. Review hosting platform logs
3. Verify environment variables
4. Test database connectivity via `/setup`

---

**🇵🇬 Ready for the PNG Electoral Commission Workshop!**
**October 13-15, 2025 • Hilton Hotel, Port Moresby**
