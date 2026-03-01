# Deployment Feature - Manual Integration Instructions

This document provides step-by-step instructions to manually integrate the one-click deployment feature into OpenBento.

## Overview

The deployment feature allows non-technical users to publish their bento grids with a single click, without needing to:
- Download code
- Use GitHub
- Run commands locally
- See any code

## Files Already Created

The following files have been created and are ready to use:

1. **services/deploymentService.ts** - Service for deployment operations
2. **components/DeployModal.tsx** - Modal for publishing sites
3. **components/PublicSiteView.tsx** - Component to display published sites
4. **supabase/functions/openbento-serve-site/index.ts** - Edge function to serve published sites

## Manual Changes Required

### 1. Update components/Builder.tsx

You need to make 4 changes to `components/Builder.tsx`:

#### Change 1: Add Import (around line 70)
After this line:
```typescript
import WebLLMModal from './WebLLMModal';
```

Add this line:
```typescript
import DeployModal from './DeployModal';
```

#### Change 2: Add State Variable (around line 404)
After this line:
```typescript
const [showWebLLMModal, setShowWebLLMModal] = useState(false);
```

Add this line:
```typescript
const [showPublishModal, setShowPublishModal] = useState(false);
```

#### Change 3: Add "Make Public" Button (around line 1688)
Before the existing Deploy button, add this new button:

```typescript
<button
  type="button"
  aria-label="Make site public"
  onClick={() => setShowPublishModal(true)}
  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg shadow-sm hover:from-green-600 hover:to-emerald-700 transition-all text-xs font-semibold flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  <Globe size={16} />
  <span className="hidden sm:inline">Make Public</span>
</button>
```

#### Change 4: Add DeployModal Component (around line 2575)
Before the comment `{/* 5. ANALYTICS MODAL */}`, add:

```typescript
{/* PUBLISH MODAL */}
<DeployModal
  isOpen={showPublishModal}
  onClose={() => setShowPublishModal(false)}
  bento={activeBento}
/>
```

### 2. Update services/index.ts

Add the deployment service exports at the end of `services/index.ts`:

```typescript
export {
  deploySite,
  unpublishSite,
  getDeploymentStatus,
  generateSlug,
  checkSlugAvailability,
} from './deploymentService';
```

### 3. Add Route for Public Site View

Update your routing configuration to include the public site view. If using React Router, add:

```typescript
<Route path="/site/:slug" element={<PublicSiteView />} />
```

### 4. Environment Variables

Make sure you have these in your `.env` file:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

And for the Edge Functions:

```env
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 5. Deploy the Edge Function

Deploy the Supabase Edge Function:

```bash
supabase functions deploy openbento-serve-site
```

## Infrastructure Requirements

### For the Domain Owner (You)

To enable subdomain-based hosting (e.g., `user.offlink.bio`), you need to:

1. **Configure Wildcard DNS**:
   - Go to your DNS provider (GoDaddy, Namecheap, etc.)
   - Add an A Record:
     - Host/Name: `*`
     - Value/Points to: Your server's IP address (e.g., `123.45.67.89`)
   - Result: Any request to `anything.offlink.bio` will be directed to your server

2. **Set Up Dynamic Routing** (already implemented):
   - The Supabase Edge Function `openbento-serve-site` handles dynamic routing
   - It extracts the slug from the URL and serves the corresponding bento

3. **SSL Certificates**:
   - If using Vercel/Netlify: Automatic SSL is included
   - If self-hosting: Use Let's Encrypt with DNS challenge for wildcard SSL

### Alternative: Use Vercel Platform Starter

For the easiest setup, use the Vercel Platforms Starter Kit:
- Automatic middleware-based routing
- Unlimited subdomains
- Automatic SSL certificates
- No manual DNS configuration needed

## How It Works

1. **User Flow**:
   - User clicks "Make Public" button
   - Modal opens with URL selection
   - System generates unique slug (e.g., `john-doe-x7k9`)
   - User clicks "Deploy Now"
   - Site is published to `offlink.bio/site/john-doe-x7k9`

2. **Technical Flow**:
   - Frontend calls `deploySite()` from deploymentService
   - Service saves/updates project in Supabase database
   - Sets `is_published: true`
   - Returns public URL
   - Public URL calls Edge Function with slug
   - Edge Function queries database and returns site data
   - PublicSiteView renders the site

## Testing

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Click the "Make Public" button in the navbar

3. Enter a slug and click "Deploy Now"

4. Copy the generated URL and open it in a new tab

5. Verify the site loads correctly

## Troubleshooting

### "Supabase is not configured" Error
- Ensure `.env` file has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart the dev server after adding environment variables

### "Site not found" Error
- Check Supabase dashboard to verify project exists
- Ensure `is_published` is `true` in the database
- Verify the slug matches exactly

### Edge Function Not Working
- Ensure Edge Function is deployed: `supabase functions list`
- Check logs: `supabase functions logs openbento-serve-site`
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set in Edge Function environment

## Next Steps

After manual integration:

1. Test the deployment flow end-to-end
2. Configure your wildcard DNS
3. Set up SSL certificates (if not using Vercel/Netlify)
4. Deploy to production
5. Monitor usage and scale as needed

## Support

For issues or questions:
1. Check the Supabase dashboard for database records
2. Review Edge Function logs
3. Test the deployment service directly
4. Verify environment variables are correctly set
