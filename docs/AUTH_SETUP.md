# OpenBento Authentication Setup Guide

This guide walks you through setting up user authentication and database integration with Supabase.

## Prerequisites

- A Supabase account (free tier works)
- A Supabase project created

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization and enter a project name
4. Set a secure database password (save this!)
5. Choose a region close to your users
6. Click "Create new project" and wait for it to be ready

## Step 2: Configure Authentication Providers

### Enable Email/Password Auth

1. Go to **Authentication** → **Providers**
2. Ensure "Email" is enabled
3. Configure settings:
   - Enable "Enable email confirmations" for production
   - Set a secure password requirements
4. Save changes

### Enable Google OAuth

1. Go to **Authentication** → **Providers**
2. Find "Google" and click "Enable"
3. Go to [Google Cloud Console](https://console.cloud.google.com)
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:3000` (add your production domain later)
   - Authorized redirect URIs: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
5. Copy the Client ID and Client Secret to Supabase
6. Save changes

## Step 3: Run Database Migrations

### Option A: Using Supabase Dashboard (Easiest)

1. Go to **SQL Editor** in your Supabase dashboard
2. Click "New Query"
3. Copy the contents of `supabase/migrations/20251230200000_openbento_auth.sql`
4. Paste and click "Run"
5. Verify success - you should see "Success. No rows returned"

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Push migrations
supabase db push
```

## Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Get your Supabase credentials:
   - Go to **Settings** → **API**
   - Copy the **Project URL** to `VITE_SUPABASE_URL`
   - Copy the **anon public** key to `VITE_SUPABASE_ANON_KEY`

3. Your `.env` file should look like:
   ```
   VITE_SUPABASE_URL=https://abcdefgh.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## Step 5: Configure OAuth Redirect URLs

### For Development

1. Go to **Authentication** → **URL Configuration**
2. Add `http://localhost:3000` to:
   - Site URL
   - Redirect URLs (allowed)

### For Production

1. Add your production domain to:
   - Site URL
   - Redirect URLs (allowed)
2. Update Google OAuth credentials with your production domain

## Step 6: Test Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open the app in your browser

3. You should see:
   - Sign in / Sign up buttons in the header
   - Google sign-in option
   - Email/password forms

## Step 7: Configure Email Templates (Optional but Recommended)

1. Go to **Authentication** → **Email Templates**
2. Customize templates for:
   - Confirmation email
   - Password reset
   - Magic link (if enabled)
3. Use the template variables provided

## Step 8: Storage Setup

The migration creates a `user-assets` storage bucket. Configure CORS if needed:

1. Go to **Storage** → **Policies**
2. The bucket should have policies already set up from the migration
3. Users can only access files in their own folder (based on user ID)

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Make sure you copied the `anon` key, not the `service_role` key
   - Verify the key doesn't have extra spaces

2. **OAuth redirect fails**
   - Check redirect URLs in Supabase dashboard
   - Ensure your Google OAuth callback URL is correct

3. **Database errors**
   - Verify the migration ran successfully
   - Check RLS policies are enabled
   - Ensure tables exist in Table Editor

4. **Email confirmation not working**
   - Check spam folder
   - Verify email templates are configured
   - Check SMTP settings if using custom SMTP

### Debug Mode

Add this to your `.env` for verbose logging:
```
VITE_SUPABASE_DEBUG=true
```

## Production Checklist

Before going to production:

- [ ] Enable email confirmations
- [ ] Configure custom SMTP (optional)
- [ ] Set up proper CORS for storage
- [ ] Add production domain to OAuth redirect URLs
- [ ] Review and test RLS policies
- [ ] Set up database backups
- [ ] Configure rate limiting (handled by Supabase)
- [ ] Set up monitoring and alerts
- [ ] Review security settings

## Security Best Practices

1. **Never expose the service_role key** - Only use the anon key in frontend code
2. **Enable RLS on all tables** - Already done by migration
3. **Validate user input** - Always validate on the server side
4. **Use prepared statements** - Supabase client handles this automatically
5. **Monitor auth events** - Set up logging for suspicious activity

## Custom Domain Setup (Pro Users)

Pro users can configure custom domains:

1. User enters their domain in settings
2. System generates DNS records (CNAME + TXT for verification)
3. User adds records to their DNS provider
4. System verifies domain ownership
5. Domain is activated

### DNS Records Required

| Type | Name | Value |
|------|------|-------|
| CNAME | example.com | cname.vercel-dns.com |
| TXT | _openbento-verification.example.com | verification-token |

## Support

If you encounter issues:

1. Check the [Supabase documentation](https://supabase.com/docs)
2. Search [Supabase GitHub discussions](https://github.com/supabase/supabase/discussions)
3. Open an issue in the OpenBento repository
