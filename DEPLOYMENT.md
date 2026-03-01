# Auto-Deployment Guide

OpenBento now supports **one-click deployment** that allows non-technical users to publish their bento sites instantly without downloading code or configuring hosting.

## Overview

The auto-deployment feature provides:

- **One-click launch** - Users click "Launch" and their site goes live
- **Automatic subdomains** - Sites are hosted at `username.yourdomain.com`
- **No code required** - Users never see code, GitHub, or hosting configuration
- **Instant updates** - Changes are reflected immediately
- **SSL included** - Automatic HTTPS certificates

## User Experience

1. User designs their bento page in the visual editor
2. User clicks the "Launch" button (purple rocket icon)
3. User chooses their subdomain (e.g., `myname` for `myname.offlink.bio`)
4. Site is live within seconds
5. User gets a shareable link to their live site

## Architecture

```
User → OpenBento Editor → Deploy API → Hosting Platform → Live Site
                ↓
         subdomain.yourdomain.com
```

### Components

1. **DeployModal** (`components/DeployModal.tsx`)
   - User interface for subdomain selection
   - Deployment status tracking
   - URL sharing and copying

2. **Deployment Service** (`services/deployment/index.ts`)
   - API integration
   - Subdomain validation
   - Status management

3. **Backend API** (to be implemented)
   - Receives site data
   - Creates subdomain DNS records
   - Deploys static files
   - Manages SSL certificates

## Configuration

Add these environment variables to your `.env` file:

```env
# Base domain for subdomains (e.g., offlink.bio)
VITE_DEPLOYMENT_BASE_DOMAIN=offlink.bio

# API endpoint for deployment service
VITE_DEPLOYMENT_API_ENDPOINT=/api/deploy

# Optional: API key for deployment authentication
VITE_DEPLOYMENT_API_KEY=your-deployment-api-key
```

## Backend API Specification

Your deployment API should implement these endpoints:

### POST /api/deploy

Deploy a new site or update an existing one.

**Request:**
```json
{
  "subdomain": "myname",
  "siteData": {
    "profile": { ... },
    "blocks": [ ... ]
  },
  "bentoId": "bento_xxx",
  "bentoName": "My Bento",
  "metadata": {
    "name": "User Name",
    "description": "Bio text",
    "createdAt": 1234567890,
    "updatedAt": 1234567890
  }
}
```

**Response:**
```json
{
  "id": "deploy_xxx",
  "subdomain": "myname",
  "url": "https://myname.offlink.bio",
  "status": "deployed",
  "createdAt": 1234567890,
  "updatedAt": 1234567890
}
```

### POST /api/deploy/check

Check if a subdomain is available.

**Request:**
```json
{
  "subdomain": "myname"
}
```

**Response:**
```json
{
  "available": true,
  "subdomain": "myname",
  "message": "Subdomain is available"
}
```

### GET /api/deploy/status/:id

Get deployment status.

**Response:**
```json
{
  "id": "deploy_xxx",
  "subdomain": "myname",
  "url": "https://myname.offlink.bio",
  "status": "deployed",
  "createdAt": 1234567890,
  "updatedAt": 1234567890
}
```

### DELETE /api/deploy/:id

Remove a deployment.

**Response:**
```json
{
  "success": true
}
```

## Implementation Options

### Option 1: Vercel Platforms (Recommended)

Use the [Vercel Platforms Starter Kit](https://github.com/vercel/platforms) for:
- Automatic subdomain routing
- Built-in SSL certificates
- Edge deployment
- Scale to millions of sites

**Setup:**
1. Deploy the Platforms starter kit
2. Configure wildcard DNS (*.yourdomain.com → Vercel)
3. Connect to your OpenBento deployment API
4. Store site data in database/edge config

### Option 2: Netlify Drop + API

Use Netlify's API for:
- Simple drag-and-drop deployment
- Automatic SSL
- Custom domains

**Setup:**
1. Create Netlify API integration
2. Deploy sites via API with subdomain-based names
3. Configure wildcard DNS

### Option 3: Cloudflare Pages + Workers

Use Cloudflare for:
- Global edge deployment
- Wildcard DNS support
- Workers for dynamic routing

**Setup:**
1. Create Cloudflare Worker for deployment API
2. Use Cloudflare Pages for hosting
3. Configure KV storage for site data
4. Set up wildcard DNS

### Option 4: Custom VPS

For full control, use:
- nginx with wildcard server blocks
- Let's Encrypt for SSL
- Docker containers per site
- Simple Node.js/Python API

**Setup:**
```nginx
# nginx wildcard config
server {
    listen 443 ssl;
    server_name *.yourdomain.com;
    
    ssl_certificate /path/to/wildcard.crt;
    ssl_certificate_key /path/to/wildcard.key;
    
    location / {
        root /var/www/sites/$host;
        try_files $uri $uri/ /index.html;
    }
}
```

## Subdomain Validation

Reserved subdomains (cannot be used):
- www, api, admin, app, dashboard
- static, cdn, mail, ftp
- ns1-ns4, test, dev, staging, prod
- localhost, demo, blog, shop
- And more (see `validateSubdomain()` in `services/deployment/index.ts`)

## Security Considerations

1. **Rate limiting** - Limit deployment requests per IP/user
2. **Content validation** - Sanitize site data before deployment
3. **Subdomain restrictions** - Prevent use of reserved/internal subdomains
4. **Authentication** - Require user authentication for deployment
5. **HTTPS only** - Always use HTTPS for deployed sites
6. **CSP headers** - Add Content Security Policy headers

## Storage

Deployment information is stored in:
- **localStorage**: Client-side storage of deployment metadata
- **Your API**: Server-side storage of actual site content

The client stores:
```typescript
{
  id: "deploy_xxx",
  subdomain: "myname",
  url: "https://myname.offlink.bio",
  status: "deployed",
  createdAt: 1234567890,
  updatedAt: 1234567890
}
```

## Fallback Behavior

If the deployment API is not configured or returns errors:

1. The deployment modal will show error messages
2. Users can retry deployment
3. The old ZIP export is still available via Settings → Export

## Migration from ZIP Export

Existing users who previously used ZIP export:
- Can continue using the Launch button for auto-deployment
- Their deployed sites will be hosted on subdomains
- No migration needed - it's a new feature

## Troubleshooting

### Common Issues

**"Deployment failed" error:**
- Check API endpoint configuration
- Verify API is running and accessible
- Check browser console for error details

**Subdomain not available:**
- Try a different name
- Check if you already have a site with that name
- Avoid reserved subdomains

**Site not loading after deployment:**
- DNS may still be propagating (can take up to 5 minutes)
- Check deployment status in the modal
- Try refreshing the page

### Debug Mode

Enable debug logging:
```javascript
localStorage.setItem('openbento_debug', 'true');
```

## Future Enhancements

- Custom domains (Pro feature)
- Password protection
- Analytics integration
- A/B testing
- Form submissions handling
- E-commerce integration

## Support

For deployment-related issues:
1. Check this documentation
2. Verify your API configuration
3. Check browser console for errors
4. Contact support with deployment ID and error messages
