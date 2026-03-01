# One-Click Deployment Feature - Quick Start

## 🎯 What This Does

This feature adds a **"Make Public"** button that lets non-technical users deploy their bento grids with ONE CLICK - no code, no downloads, no GitHub required.

## ✅ Files Already Created

These files are ready to use:

1. ✅ `services/deploymentService.ts` - Backend deployment logic
2. ✅ `components/DeployModal.tsx` - Deployment UI
3. ✅ `components/PublicSiteView.tsx` - Public site viewer
4. ✅ `supabase/functions/openbento-serve-site/index.ts` - Edge function
5. ✅ `services/index.ts` - Updated with deployment exports

## 🚀 Quick Start (3 Steps)

### Step 1: Apply Changes to Builder.tsx

**Option A: Automatic (Recommended)**
```bash
chmod +x apply_deployment_changes.sh
./apply_deployment_changes.sh
```

**Option B: Manual**
See `DEPLOYMENT_FEATURE_PATCH.md` for detailed manual instructions.

### Step 2: Deploy Edge Function

```bash
supabase functions deploy openbento-serve-site
```

### Step 3: Test

```bash
npm run dev
```

Then:
1. Open the app
2. Click the green "Make Public" button
3. Enter a slug (e.g., `my-site`)
4. Click "Deploy Now"
5. Copy the URL and open in a new tab

## 🌐 Infrastructure Setup (For Domain Owners)

### Choose One Option:

#### Option 1: Wildcard DNS (Simplest)

Add to your DNS provider (GoDaddy, Namecheap, etc.):
- **Type**: A Record
- **Host/Name**: `*`
- **Value**: Your server IP

Result: `anything.yourdomain.com` → Your server

#### Option 2: Vercel Platforms (Recommended)

Use Vercel Platforms Starter Kit for automatic everything:
- Auto routing
- Auto SSL
- Unlimited subdomains

```bash
npm create vercel@latest openbento-platform
```

## 📱 User Flow (For Non-Technical Users)

1. User creates bento in visual editor ✨
2. User clicks **"Make Public"** (green button)
3. Modal shows their URL: `yourdomain.com/site/my-site`
4. User clicks **"Deploy Now"** 🚀
5. Site is instantly live! ✅

**No code ever shown. No downloads. No GitHub. Just one click.**

## 🎨 Features

### DeployModal
- ✅ Live URL preview
- ✅ Real-time slug availability checking
- ✅ Auto-generate slugs
- ✅ Copy URL button
- ✅ Open in new tab
- ✅ Unpublish option

### PublicSiteView
- ✅ Responsive (mobile + desktop)
- ✅ All block types supported
- ✅ Profile header
- ✅ Social icons
- ✅ Beautiful animations

## 📋 Requirements

### Environment Variables (.env)
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Add Route (if using React Router)
```typescript
<Route path="/site/:slug" element={<PublicSiteView />} />
```

## 🔍 Troubleshooting

### "Supabase is not configured"
→ Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env

### "Site not found"
→ Check Supabase dashboard that project exists and is_published = true

### Edge Function not working
→ Deploy: `supabase functions deploy openbento-serve-site`
→ Check logs: `supabase functions logs openbento-serve-site`

## 📚 Documentation

- `DEPLOYMENT_FEATURE_SUMMARY.md` - Complete technical documentation
- `DEPLOYMENT_FEATURE_PATCH.md` - Detailed manual integration guide

## 💡 Tips

1. Test locally before deploying to production
2. Use meaningful slugs for better SEO
3. Share the URL immediately after deployment
4. Monitor usage via Supabase dashboard

## 🎯 What Users See

**Before**: They have to download code, use GitHub, run commands... 😰

**After**: One click → Site is live! 😎

---

**Total Time to Deploy**: ~5 minutes
**User Time to Publish**: 1 click
**Technical Knowledge Required**: 0
