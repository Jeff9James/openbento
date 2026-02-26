# OpenBento Deployment Guide

This guide covers deploying OpenBento to various platforms, setting up Supabase analytics, configuring Stripe payments, and using custom domains.

## Table of Contents

1. [Quick Start Deployment](#quick-start-deployment)
2. [Vercel Deployment](#vercel-deployment)
3. [Netlify Deployment](#netlify-deployment)
4. [GitHub Pages Deployment](#github-pages-deployment)
5. [Supabase Analytics Setup](#supabase-analytics-setup)
6. [Stripe Integration](#stripe-integration)
7. [Custom Domain Setup](#custom-domain-setup)
8. [PWA Configuration](#pwa-configuration)
9. [Environment Variables](#environment-variables)
10. [Troubleshooting](#troubleshooting)

---

## Quick Start Deployment

### Option 1: Static Export (Easiest)

1. Build the project:
```bash
npm run build
```

2. Upload the `dist/` folder to any static hosting service (Netlify Drop, Vercel, GitHub Pages, etc.)

3. Your site is live!

### Option 2: Export as React Project (Most Control)

1. In the Builder, click "Export" → "React Project"
2. Download the ZIP file
3. Extract and deploy the React project to Vercel/Netlify
4. Full source code control and customization

---

## Vercel Deployment

### Free Tier Deployment

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/openbento.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Keep all default settings
   - Click "Deploy"

3. **Environment Variables (Optional)**
   - Go to Settings → Environment Variables
   - Add any needed variables (see [Environment Variables](#environment-variables))
   - Redeploy after adding variables

### Custom Domain on Vercel

1. Go to your project Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `yourdomain.com` or `links.yourdomain.com`)
4. Follow DNS instructions provided by Vercel

**For a subdomain (e.g., links.yourdomain.com):**
```
Type: CNAME
Name: links
Value: cname.vercel-dns.com
```

**For a root domain (e.g., yourdomain.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

### Vercel Analytics (Optional)

1. Go to your project Settings → Analytics
2. Enable Vercel Analytics
3. Add the Vercel Analytics script to your project

---

## Netlify Deployment

### Free Tier Deployment

1. **Push to GitHub** (same as Vercel above)

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click "Deploy site"

3. **Environment Variables (Optional)**
   - Go to Site settings → Environment variables
   - Add any needed variables
   - Redeploy after adding variables

### Custom Domain on Netlify

1. Go to Domain settings
2. Click "Add custom domain"
3. Enter your domain
4. Follow DNS instructions:

**For a subdomain:**
```
Type: CNAME
Name: links
Value: your-site-name.netlify.app
```

**For a root domain:**
```
Type: A
Name: @
Value: 75.2.70.75
```

### Netlify Forms (Optional)

If you want to add a contact form to your bento:
1. Add a form HTML in a Custom HTML block
2. Add `netlify` attribute to the form tag
3. Netlify automatically handles form submissions

---

## GitHub Pages Deployment

### Using GitHub Actions

1. **Create `.github/workflows/deploy.yml`:**
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [main]

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: '20'
             cache: 'npm'
         - run: npm ci
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

2. **Update `vite.config.ts` for base path:**
   ```typescript
   base: '/your-repo-name/',
   ```

3. **Push to GitHub**
4. Go to Repository Settings → Pages
5. Select `gh-pages` branch as source
6. Your site will be at `https://yourusername.github.io/your-repo-name/`

---

## Supabase Analytics Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account (no credit card required)
3. Click "New Project"
4. Enter project details:
   - Name: `openbento-analytics`
   - Database Password: (save this securely)
   - Region: Choose nearest to your users
5. Wait for project to be ready (~2 minutes)

### Step 2: Get Project Credentials

1. Go to Project Settings → API
2. Copy:
   - Project URL: `https://xxxxxxxx.supabase.co`
   - anon public key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Step 3: Initialize Database Tables

Run the setup script:
```bash
npm run analytics:supabase:init
```

Or manually run this SQL in Supabase SQL Editor:

```sql
-- Page views table
CREATE TABLE IF NOT EXISTS page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bento_id TEXT NOT NULL,
  page_url TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clicks table
CREATE TABLE IF NOT EXISTS clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bento_id TEXT NOT NULL,
  block_id TEXT NOT NULL,
  block_type TEXT NOT NULL,
  click_url TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_page_views_bento_id ON page_views(bento_id);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_clicks_bento_id ON clicks(bento_id);
CREATE INDEX IF NOT EXISTS idx_clicks_created_at ON clicks(created_at DESC);

-- Enable Row Level Security (optional, for multi-tenant)
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE clicks ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts
CREATE POLICY "Allow anonymous inserts on page_views"
  ON page_views FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts on clicks"
  ON clicks FOR INSERT
  TO anon
  WITH CHECK (true);
```

### Step 4: Configure in OpenBento

1. Open OpenBento Builder
2. Go to Settings → Analytics
3. Enter:
   - Supabase URL: `https://xxxxxxxx.supabase.co`
   - Supabase Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
4. Click "Test Connection"
5. If successful, click "Save"

### Step 5: View Analytics

1. Click the Analytics button in the toolbar
2. View:
   - Total page views and clicks
   - Top referrers
   - Geographic distribution
   - Device and browser breakdown
   - Daily trends (Pro feature)

### Cost and Limits

- **Free Tier**: 500MB database, 1GB bandwidth/month, 2 concurrent connections
- **Pro Tier**: $25/month for 8GB database, 50GB bandwidth, unlimited connections
- For most personal sites, free tier is sufficient

---

## Stripe Integration

### Quick Start with Payment Links

The easiest way to add payments:

1. **Create a Payment Link**
   - Go to [stripe.com](https://stripe.com)
   - Go to Products → Payment Links
   - Create a new payment link
   - Copy the URL: `https://buy.stripe.com/xxxx`

2. **Add to Your Bento**
   - Add a Link block
   - Title: "Buy Now" or "Donate"
   - URL: Paste your Stripe payment link
   - Button style: Custom color

### Advanced: Stripe Checkout Button

1. **Install Stripe SDK** (in exported React project):
   ```bash
   npm install @stripe/stripe-js @stripe/react-stripe-js
   ```

2. **Create a Checkout Button component:**
   ```tsx
   import { loadStripe } from '@stripe/stripe-js';
   import React from 'react';

   const stripePromise = loadStripe('pk_test_xxxxx');

   export default function CheckoutButton({ priceId }: { priceId: string }) {
     const handleClick = async () => {
       const stripe = await stripePromise;
       const { error } = await stripe.redirectToCheckout({
         lineItems: [{ price: priceId, quantity: 1 }],
         mode: 'payment',
         successUrl: window.location.origin + '/success',
         cancelUrl: window.location.origin + '/cancel',
       });

       if (error) {
         console.error('Error:', error);
       }
     };

     return (
       <button onClick={handleClick} className="...">
         Buy Now
       </button>
     );
   }
   ```

3. **Add to a Custom HTML block** in OpenBento

### Environment Variables for Stripe

For production deployments:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
VITE_STRIPE_SECRET_KEY=sk_live_xxxxx
```

⚠️ **Important:** Never commit secret keys to Git!

---

## Custom Domain Setup

### Overview

Custom domains work with any hosting provider. Here's the general process:

### 1. Purchase a Domain

- Domain registrars: Namecheap, Google Domains, Cloudflare, GoDaddy
- Typical cost: $10-15/year

### 2. Configure DNS

Go to your domain registrar's DNS settings:

**For a subdomain (links.yourdomain.com):**
```
Type: CNAME
Name: links
Value: your-hosting-provider.com
TTL: 3600
```

**For root domain (yourdomain.com):**
```
Type: A
Name: @
Value: your-hosting-ip-address
TTL: 3600
```

### 3. Configure Hosting Provider

Add the domain in your hosting provider's dashboard (see Vercel/Netlify sections above).

### 4. Wait for Propagation

DNS changes take 5-30 minutes to propagate. You can check status at:
- [whatsmydns.net](https://www.whatsmydns.net/)

### 5. SSL Certificate

Most providers (Vercel, Netlify) automatically provision SSL certificates.
- Let's Encrypt (free)
- Auto-renewing
- HTTPS enabled by default

---

## PWA Configuration

### What is PWA?

PWA (Progressive Web App) lets users install your bento as a mobile app:
- Add to home screen
- Work offline (with service worker)
- App-like experience
- No App Store required

### Add PWA Support

1. **Create `public/manifest.json`:**
   ```json
   {
     "name": "OpenBento",
     "short_name": "OpenBento",
     "description": "My link-in-bio page",
     "start_url": "/",
     "display": "standalone",
     "background_color": "#F9FAFB",
     "theme_color": "#6366F1",
     "orientation": "portrait",
     "icons": [
       {
         "src": "/icon-192.png",
         "sizes": "192x192",
         "type": "image/png"
       },
       {
         "src": "/icon-512.png",
         "sizes": "512x512",
         "type": "image/png"
       }
     ]
   }
   ```

2. **Add to `index.html`:**
   ```html
   <link rel="manifest" href="/manifest.json" />
   ```

3. **Create App Icons**
   - 192x192 PNG
   - 512x512 PNG
   - Place in `public/` folder

4. **Create Service Worker** (`public/sw.js`):
   ```javascript
   const CACHE_NAME = 'openbento-v1';
   const urlsToCache = ['/', '/manifest.json'];

   self.addEventListener('install', (event) => {
     event.waitUntil(
       caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
     );
   });

   self.addEventListener('fetch', (event) => {
     event.respondWith(
       caches.match(event.request).then((response) => response || fetch(event.request))
     );
   });
   ```

5. **Register Service Worker** (in exported React project):
   ```javascript
   if ('serviceWorker' in navigator) {
     window.addEventListener('load', () => {
       navigator.serviceWorker.register('/sw.js');
     });
   }
   ```

### Testing PWA

- Chrome DevTools → Application tab
- Check "Manifest" and "Service Workers"
- Use "Add to home screen" on mobile

---

## Environment Variables

### Required Variables

None! OpenBento works out of the box with localStorage.

### Optional Variables

```env
# Supabase Analytics (optional)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Stripe (optional, for payments)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx

# Google Analytics (optional)
VITE_GA_ID=G-XXXXXXXXXX

# Feature Flags
VITE_ENABLE_LANDING=true
VITE_ENABLE_ADS=false
```

### Setting Environment Variables

**Vercel:**
Settings → Environment Variables → Add variable → Redeploy

**Netlify:**
Site settings → Build & deploy → Environment variables → Add variable → Redeploy

**Local Development:**
Create `.env` file (see `.env.example`)

---

## Troubleshooting

### Build Errors

**"Module not found"**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**TypeScript errors**
```bash
npm run type-check
# Fix reported errors
```

### Deployment Issues

**"404 Not Found" after deploy**
- Check `vite.config.ts` `base` path
- For GitHub Pages: `base: '/repo-name/'`
- For Vercel/Netlify: `base: '/'`

**"White screen" after deploy**
- Check browser console for errors
- Ensure all files were uploaded
- Check build logs for warnings

### Analytics Not Working

**"Connection failed"**
- Verify Supabase URL and key
- Check network tab in DevTools
- Ensure tables exist in Supabase

**No data showing**
- Check browser console for errors
- Verify tracking code is firing
- Check Supabase dashboard

### Custom Domain Issues

**"DNS not configured"**
- Wait 5-30 minutes for propagation
- Verify DNS records
- Use whatsmydns.net to check

**SSL Certificate not working**
- Wait 1-2 hours after DNS propagation
- Check CAA records (if any)
- Contact hosting provider support

### Performance Issues

**Slow loading**
- Enable gzip/brotli compression (hosting setting)
- Use CDN for images
- Lazy load components (already implemented)

**Large bundle size**
- Check bundle analyzer
- Remove unused dependencies
- Code split routes (already done)

### Browser Compatibility

**Safari issues**
- Check WebKit prefix requirements
- Test on real devices, not just simulator

**Mobile issues**
- Test on multiple devices
- Check touch target sizes (minimum 44x44)
- Verify viewport meta tag

### Security Issues

**CORS errors**
- Configure Supabase CORS settings
- Add your domain to allowed origins

**XSS warnings**
- Sanitize user inputs (already done)
- Use Content Security Policy headers

---

## Getting Help

1. **Documentation:** Check the `/docs` section in the app
2. **FAQ:** Click the help button (bottom right) for quick answers
3. **GitHub Issues:** Report bugs or request features
4. **Discord:** Join our community (link in README)

---

## Next Steps

1. Deploy your bento using one of the methods above
2. Set up Supabase for analytics (optional)
3. Configure a custom domain (optional)
4. Add Stripe for payments (optional)
5. Enable PWA for mobile app experience (optional)
6. Share your bento with the world! 🎉

---

## Summary

| Platform | Free Tier | Custom Domain | SSL | Ease of Use |
|----------|-----------|---------------|-----|-------------|
| Vercel   | ✅ Yes    | ✅ Yes        | ✅ Yes | ⭐⭐⭐⭐⭐ |
| Netlify  | ✅ Yes    | ✅ Yes        | ✅ Yes | ⭐⭐⭐⭐⭐ |
| GitHub Pages | ✅ Yes | ✅ Yes | ✅ Yes | ⭐⭐⭐⭐ |
| VPS      | ❌ No     | ✅ Yes        | Manual | ⭐⭐⭐ |

**Recommendation:** Start with Vercel or Netlify for the easiest deployment experience. Both offer free tiers, automatic SSL, and excellent performance.
