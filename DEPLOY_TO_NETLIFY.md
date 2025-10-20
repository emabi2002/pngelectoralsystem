# Deploy PNG Electoral System to Netlify
## From GitHub Repository

**Time Required**: 5-10 minutes
**Prerequisites**: GitHub account, Netlify account (free)

---

## 🚀 Quick Deploy Button

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/emabi2002/pngelectoralsystem)

**OR follow the manual steps below** ⬇️

---

## 📋 Manual Deployment Steps

### Step 1: Sign Up for Netlify (if you don't have an account)

1. Go to: https://www.netlify.com/
2. Click **"Sign up"**
3. Choose **"Sign up with GitHub"** (easiest option)
4. Authorize Netlify to access your GitHub account

---

### Step 2: Create New Site from GitHub

1. **Login to Netlify**: https://app.netlify.com/
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **"Deploy with GitHub"**
4. If asked, authorize Netlify to access your repositories
5. Select repository: **`emabi2002/pngelectoralsystem`**
6. Click on the repository name

---

### Step 3: Configure Build Settings

**Site Settings**:
- **Branch to deploy**: `main`
- **Build command**: `bun run build` (or `npm run build`)
- **Publish directory**: `out`

**Advanced build settings** (click "Show advanced"):
- Click **"New variable"** and add:
  - **Key**: `NODE_VERSION`
  - **Value**: `20`

---

### Step 4: Add Environment Variables

**CRITICAL**: Before deploying, add your Supabase credentials:

1. Scroll down to **"Environment variables"**
2. Click **"Add environment variables"**
3. Add these **3 variables**:

```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://usipijjyqfpxmhjbebyo.supabase.co

Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzaXBpamp5cWZweG1oamJlYnlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MDM4NDgsImV4cCI6MjA3NTM3OTg0OH0.32LOTrvyFXPR0E7vHd57bBCB8mMbJF2978DimNEPTnQ

Key: NODE_VERSION
Value: 20
```

**⚠️ Important**: Copy these values exactly as shown above.

---

### Step 5: Deploy!

1. Click **"Deploy [site name]"** button at the bottom
2. Wait for build to complete (2-5 minutes)
3. Watch the build logs for any errors

**Build Status**:
- **Building** → Yellow indicator
- **Published** → Green checkmark ✅

---

### Step 6: Get Your Site URL

Once deployed, you'll see:
- **Site URL**: `https://[random-name].netlify.app`

Example: `https://pngelectoralsystem.netlify.app`

**Test it**: Click the URL to open your site!

---

## 🔧 Post-Deployment Configuration

### Change Site Name (Optional)

1. Go to **Site settings** → **General** → **Site details**
2. Click **"Change site name"**
3. Enter: `pngelectoralsystem` (or your preferred name)
4. Click **"Save"**

**New URL**: `https://pngelectoralsystem.netlify.app`

---

### Set Up Custom Domain (Optional)

1. Go to **Domain settings**
2. Click **"Add custom domain"**
3. Enter your domain: `electoralsystem.pg` (if you own it)
4. Follow DNS configuration instructions

---

## ✅ Verify Deployment

### Test These Pages:

1. **Homepage**: `https://[your-site].netlify.app/`
   - ✅ Should show main dashboard

2. **Login**: `https://[your-site].netlify.app/login`
   - ✅ Should show login form

3. **Census**: `https://[your-site].netlify.app/census`
   - ✅ Should show census landing page

4. **Registration**: `https://[your-site].netlify.app/register`
   - ✅ Should show voter registration form

5. **Dashboard**: `https://[your-site].netlify.app/census-dashboard`
   - ✅ Should show charts and data visualization

---

## 🐛 Troubleshooting

### Issue: Build Fails

**Check build logs** for errors:

**Common fixes**:

1. **Node version error**:
   - Add environment variable: `NODE_VERSION=20`

2. **Missing dependencies**:
   - Netlify auto-detects and installs from `package.json`
   - No action needed

3. **Environment variables missing**:
   - Go to Site settings → Environment variables
   - Add the 3 Supabase variables listed above

### Issue: 404 Errors on Page Refresh

**Fix**: The `netlify.toml` file should handle this, but if not:

1. Go to **Site settings** → **Build & deploy** → **Post processing**
2. Enable **"Pretty URLs"**
3. Add redirect rule in `netlify.toml`:
   ```toml
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

### Issue: "This site can't be reached"

**Possible causes**:
1. Build failed - Check build logs
2. Site not published yet - Wait for deployment to complete
3. Wrong URL - Check actual site URL in Netlify dashboard

**Solution**:
- Go to **Deploys** tab
- Click **"Trigger deploy"** → **"Deploy site"**

### Issue: Database Connection Error

**Check**:
1. Environment variables are set correctly
2. Supabase URL is correct
3. Anon key is valid

**Verify in Netlify**:
- Site settings → Environment variables
- Make sure all 3 variables are present

---

## 🔄 Automatic Deployments

**Good news**: Netlify is now connected to your GitHub repository!

**Every time you push to GitHub**:
1. Netlify detects the change
2. Automatically builds the site
3. Deploys the new version

**To push updates**:
```bash
git add .
git commit -m "Update description"
git push origin main
# Netlify will auto-deploy!
```

---

## 📊 Monitoring Your Site

### Netlify Analytics

1. Go to **Analytics** tab
2. View:
   - Page views
   - Unique visitors
   - Top pages
   - Traffic sources

### Deploy Logs

1. Go to **Deploys** tab
2. Click any deployment
3. View detailed build logs

---

## 🔐 Environment Variables Reference

**Required for Production**:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://usipijjyqfpxmhjbebyo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzaXBpamp5cWZweG1oamJlYnlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MDM4NDgsImV4cCI6MjA3NTM3OTg0OH0.32LOTrvyFXPR0E7vHd57bBCB8mMbJF2978DimNEPTnQ

# Node Version
NODE_VERSION=20
```

---

## 📱 Share Your Deployment

Once deployed, share with your team:

**Live Site**: `https://[your-site-name].netlify.app`

**Demo Accounts** (create these in Supabase first):
- Administrator: admin@demo.pg / demo123
- Analyst: analyst@demo.pg / demo123
- Supervisor: supervisor@demo.pg / demo123
- Enumerator: enumerator@demo.pg / demo123

---

## 🎯 Production Checklist

Before workshop (October 13-15):

- [ ] Site deployed successfully
- [ ] All pages accessible (no 404 errors)
- [ ] Environment variables configured
- [ ] Demo accounts created in Supabase
- [ ] Database tables created (run SQL scripts)
- [ ] Test login with all 4 demo accounts
- [ ] Test voter registration flow
- [ ] Test census registration flow
- [ ] Verify data visualization charts load
- [ ] Custom domain configured (if applicable)

---

## 📞 Need Help?

**Netlify Support**: https://www.netlify.com/support/
**Same Technical Support**: support@same.new
**GitHub Repository**: https://github.com/emabi2002/pngelectoralsystem

---

## 🎉 Success!

Your PNG Digital Electoral System is now live and ready for:
- ✅ Workshop demonstrations
- ✅ Field testing
- ✅ Production use
- ✅ Team collaboration

**Workshop**: October 13-15, 2025 | Hilton Hotel, Port Moresby

---

**Deployment Time**: ~5 minutes
**Auto-Deploy**: ✅ Enabled (on GitHub push)
**Custom Domain**: Optional
**Free Tier**: ✅ Sufficient for workshop

🇵🇬 **Ready to Transform PNG's Electoral Process!**
