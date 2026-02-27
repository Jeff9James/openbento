# OpenBento Deployment Guide

Complete guide for deploying OpenBento to production with all features.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Vercel Deployment](#vercel-deployment)
3. [Netlify Deployment](#netlify-deployment)
4. [Supabase Setup](#supabase-setup)
5. [Stripe Setup (Pro Features)](#stripe-setup-pro-features)
6. [Environment Variables](#environment-variables)
7. [Custom Domains](#custom-domains)
8. [PWA Setup](#pwa-setup)
9. [SEO Optimization](#seo-optimization)
10. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git (for deployment)
- Supabase account (optional, for analytics)
- Stripe account (optional, for Pro features)

### Development Setup

```bash
# Clone the repository
git clone https://github.com/openbento/openbento.git
cd openbento

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## Vercel Deployment

### Option 1: One-Click Deploy (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel auto-detects Vite configuration
4. Add environment variables (see below)
5. Click **Deploy**

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

### Environment Variables for Vercel

Add these in Vercel Dashboard → Settings → Environment Variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | No | Supabase project URL for analytics |
| `VITE_SUPABASE_ANON_KEY` | No | Supabase anon key (deprecated, edge function handles auth) |
| `VITE_STRIPE_PUBLIC_KEY` | No | Stripe publishable key for Pro features |
| `VITE_GEMINI_API_KEY` | No | Google Gemini API key for AI features |
| `VITE_ENABLE_LANDING` | No | Set to 'true' to show landing page |
| `OPENBENTO_ANALYTICS_ADMIN_TOKEN` | No | Admin token for analytics API |

### vercel.json Configuration

The exported project includes:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## Netlify Deployment

### Option 1: One-Click Deploy

1. Go to [Netlify Drop](https://app.netlify.com/drop)
2. Drag and drop your exported project folder
3. Add environment variables in Site Settings
4. Your site is live!

### Option 2: Git Integration

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### netlify.toml Configuration

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Environment Variables for Netlify

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | No | Supabase project URL |
| `VITE_STRIPE_PUBLIC_KEY` | No | Stripe publishable key |
| `VITE_GEMINI_API_KEY` | No | Google Gemini API key |

---

## Supabase Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL (format: `https://xxxx.supabase.co`)

### Step 2: Set Up Analytics Database

```bash
# Install Supabase CLI (if not already installed)
# Follow: https://supabase.com/docs/guides/cli

# Set environment variables
export SUPABASE_PROJECT_REF=your-project-ref
export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
export OPENBENTO_ANALYTICS_ADMIN_TOKEN=your-secure-random-token

# Run the analytics setup script
npm run analytics:supabase:init
```

This script:
- Creates the `analytics_events` table
- Sets up Row Level Security (RLS)
- Deploys Edge Functions for tracking

### Step 3: Configure in OpenBento

1. In the builder, go to **Settings → Analytics**
2. Toggle **Enable analytics**
3. Enter your Supabase project URL
4. Export your bento

### Step 4: View Analytics

Two options:

**A. In the Builder:**
1. Click **Analytics** in the sidebar
2. Enter your Admin Token
3. View the dashboard

**B. Direct API:**
```
GET https://your-project.supabase.co/functions/v1/openbento-analytics-admin?siteId=YOUR_SITE_ID&days=30
Header: x-openbento-admin-token: YOUR_ADMIN_TOKEN
```

---

## Stripe Setup (Pro Features)

### Step 1: Create Stripe Account

1. Go to [stripe.com](https://stripe.com)
2. Create a Stripe account
3. Complete account verification

### Step 2: Get API Keys

1. Go to Stripe Dashboard → Developers → API Keys
2. Copy the **Publishable Key** (starts with `pk_`)
3. Copy the **Secret Key** (starts with `sk_`)

### Step 3: Create Products

1. Go to Stripe Dashboard → Products
2. Create products for Pro tiers:
   - Pro Monthly ($9.99/month)
   - Pro Yearly ($79.99/year)

### Step 4: Configure Webhooks

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
4. Note the **Webhook Signing Secret**

### Step 5: Set Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_STRIPE_PUBLIC_KEY` | Stripe publishable key (pk_...) |
| `STRIPE_SECRET_KEY` | Stripe secret key (sk_...) |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret |
| `STRIPE_PRO_MONTHLY_PRICE_ID` | Monthly plan price ID |
| `STRIPE_PRO_YEARLY_PRICE_ID` | Yearly plan price ID |

---

## Environment Variables Summary

### Development (.env)

```bash
# Supabase (Optional - Analytics)
VITE_SUPABASE_URL=https://your-project.supabase.co

# Stripe (Optional - Pro Features)
VITE_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AI Features (Optional)
VITE_GEMINI_API_KEY=your-gemini-api-key

# Feature Flags
VITE_ENABLE_LANDING=true
```

### Production (Vercel/Netlify)

Add all `VITE_*` variables in your hosting dashboard. Add `STRIPE_*` (non-VITE) variables as well.

---

## Custom Domains

### Vercel

1. Go to **Settings → Domains**
2. Enter your domain
3. Update DNS records:
   - For root domain: Add A record pointing to `76.76.21.21`
   - For subdomain: Add CNAME record pointing to `cname.vercel-dns.com`
4. Wait for propagation (up to 24 hours)
5. SSL is auto-provisioned

### Netlify

1. Go to **Domain Management**
2. Add custom domain
3. Update DNS:
   - Add CNAME for subdomain: `your-site.netlify.app`
   - Or use Netlify DNS nameservers
4. SSL auto-provisions

### Cloudflare

If using Cloudflare:

1. Add site to Cloudflare
2. Update nameservers at your registrar
3. In Cloudflare, add CNAME record:
   - Name: `@` or subdomain
   - Value: your-vercel-app.vercel.app (or netlify)
   - Proxy status: Proxied

---

## PWA Setup

The exported project includes PWA support:

### Manifest

The `manifest.json` includes:
- App name and icons
- Theme colors
- Display mode (standalone)
- Shortcuts for quick actions
- Screenshots for app store

### Service Worker

The `sw.js` provides:
- Offline support
- Cache-first for static assets
- Network-first for API calls
- Background sync capability

### Install Prompt

To show install prompt in your exported bento, the PWA installation is handled automatically by browsers when criteria are met.

### Testing PWA

```bash
# In Chrome DevTools
# 1. Open Application tab
# 2. Check Manifest
# 3. Check Service Worker status
# 4. Test offline mode
```

---

## SEO Optimization

The exported bento includes:

### Meta Tags

- Title, description
- Open Graph (Facebook, LinkedIn)
- Twitter Card
- Canonical URL

### Structured Data

JSON-LD for:
- WebApplication schema
- Product/Service info

### Performance

- Lazy loading images
- Code splitting
- Preconnect to CDN
- Optimized fonts

### Sitemap

For better indexing, add `public/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://your-domain.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

---

## Troubleshooting

### Build Failures

1. Check build logs in Vercel/Netlify dashboard
2. Run `npm run build` locally to see errors
3. Ensure Node.js version matches (18+)

### Analytics Not Working

1. Verify Supabase Edge Functions are deployed:
   ```bash
   supabase functions list
   ```
2. Check function logs:
   ```bash
   supabase functions logs openbento-analytics-track
   ```
3. Verify environment variables are set correctly

### Stripe Webhook Errors

1. Check webhook logs in Stripe Dashboard
2. Verify webhook URL is correct
3. Ensure signing secret matches

### 404 on Page Refresh

Make sure your hosting platform handles SPA routing:

- Vercel: `vercel.json` rewrites configured
- Netlify: `netlify.toml` redirects configured

### CORS Errors

If you see CORS errors in console:
1. Check that your Supabase project allows your domain
2. In Supabase: Settings → API → URL Configuration → Add your domain

### Large Bundle Size

If build is too large:
1. Use dynamic imports for heavy components
2. Enable tree-shaking
3. Use production mode: `npm run build`

---

## Security Best Practices

1. **Never commit secrets** - Use environment variables
2. **Rotate API keys** regularly
3. **Enable 2FA** on all accounts
4. **Use HTTPS** always (auto-enabled by Vercel/Netlify)
5. **Set up RLS** in Supabase
6. **Monitor webhooks** for failures

---

## Monitoring & Maintenance

### Uptime Monitoring

Use free services:
- UptimeRobot
- Healthchecks.io
- Grafana (if self-hosting)

### Error Tracking

Consider adding:
- Sentry (free tier available)
- LogRocket
- Bugsnag

### Backups

- Export your bento as JSON regularly
- Store in git repository
- Use version control for collaboration

---

## Getting Help

- **Documentation**: https://openbento.app/docs
- **GitHub Issues**: https://github.com/openbento/openbento/issues
- **Discord**: https://discord.gg/openbento
- **Email**: support@openbento.app
