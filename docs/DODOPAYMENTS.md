# DodoPayments Integration Guide

This guide explains how to set up DodoPayments for the OpenBento Pro subscription system.

## Overview

OpenBento uses DodoPayments as the payment processor for Pro subscriptions. The integration consists of:

1. **Frontend**: `lib/dodo.ts` - Client-side service for creating checkout sessions
2. **Backend**: Supabase Edge Functions for secure API calls
3. **Webhooks**: Real-time updates for subscription status changes

## Setup Instructions

### 1. Create a DodoPayments Account

1. Sign up at [app.dodopayments.com](https://app.dodopayments.com)
2. Complete the account verification process
3. Switch to **Test Mode** for development

### 2. Create Subscription Products

In the DodoPayments Dashboard:

1. Go to **Products** → **Create Product**
2. Create a **Pro Monthly** subscription product:
   - Name: "Pro Monthly"
   - Price: $9.00/month
   - Billing: Recurring (Monthly)
   - Copy the **Product ID** (e.g., `prod_xxx`)

3. Create a **Pro Yearly** subscription product:
   - Name: "Pro Yearly"
   - Price: $79.00/year
   - Billing: Recurring (Yearly)
   - Copy the **Product ID** (e.g., `prod_xxx`)

### 3. Get Your API Keys

1. Go to **Developer** → **API Keys**
2. Copy your **API Key** (for backend)
3. Go to **Developer** → **Webhooks**
4. Create a new webhook and copy the **Webhook Secret**

### 4. Configure Environment Variables

#### Frontend (.env)

```bash
# DodoPayments Product IDs (safe to expose - these are public identifiers)
VITE_DODO_PRO_MONTHLY_PRODUCT_ID=prod_your_monthly_product_id
VITE_DODO_PRO_YEARLY_PRODUCT_ID=prod_your_yearly_product_id
```

#### Supabase Edge Functions (Secrets)

Add these to your Supabase project's Edge Function secrets:

```bash
# Using Supabase CLI
supabase secrets set DODO_PAYMENTS_API_KEY=your_api_key
supabase secrets set DODO_PAYMENTS_WEBHOOK_KEY=your_webhook_secret
supabase secrets set DODO_PAYMENTS_ENVIRONMENT=test_mode
```

Or set them in the Supabase Dashboard:
1. Go to your Supabase project
2. Navigate to **Edge Functions** → **Settings**
3. Add the secrets under **Environment Variables**

### 5. Deploy Edge Functions

Deploy the Supabase Edge Functions:

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Deploy the functions
supabase functions deploy dodo-create-checkout
supabase functions deploy dodo-create-portal
supabase functions deploy dodo-webhook
```

### 6. Configure Webhook Endpoint

1. Go to DodoPayments Dashboard → **Developer** → **Webhooks**
2. Add a new webhook endpoint:
   ```
   https://your-project-ref.supabase.co/functions/v1/dodo-webhook
   ```
3. Select the following events to listen to:
   - `subscription.active`
   - `subscription.renewed`
   - `subscription.cancelled`
   - `subscription.expired`
   - `subscription.on_hold`
   - `payment.succeeded`
   - `payment.failed`

### 7. Run Database Migration

Apply the database migration to update the subscription fields:

```bash
# Using Supabase CLI
supabase db push

# Or run the SQL manually in the Supabase SQL Editor
```

The migration file is located at: `supabase/migrations/20260201000000_dodo_payments_migration.sql`

## Testing

### Test Mode

In **Test Mode**, you can use test card numbers:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- Any future expiry date and any 3-digit CVC

### Test Checkout Flow

1. Sign in to your OpenBento account
2. Click "Upgrade to Pro"
3. Select Monthly or Yearly billing
4. Complete checkout with test card
5. Verify subscription is activated in your profile

## Going Live

### Prerequisites

Before going live, ensure:

1. ✅ DodoPayments account is verified
2. ✅ Business information is complete
3. ✅ Bank account is connected for payouts
4. ✅ All tests pass in Test Mode

### Steps to Go Live

1. **Switch to Live Mode** in DodoPayments Dashboard
2. **Create Live Products** (or copy from Test Mode)
3. **Update Product IDs** in your `.env` file with live product IDs
4. **Update API Keys** in Supabase secrets with live API key
5. **Set Environment** to `live_mode` in Supabase secrets
6. **Deploy** your changes

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │     │   Supabase      │     │  DodoPayments   │
│   (React)       │     │   Edge Funcs    │     │     API         │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         │  Create Checkout      │                       │
         │──────────────────────>│                       │
         │                       │  POST /checkouts      │
         │                       │──────────────────────>│
         │                       │                       │
         │                       │  checkout_url         │
         │                       │<──────────────────────│
         │  Redirect to checkout │                       │
         │<──────────────────────│                       │
         │                       │                       │
         │  User completes payment                       │
         │                       │                       │
         │                       │  Webhook (sub.active) │
         │                       │<──────────────────────│
         │                       │                       │
         │                       │  Update DB            │
         │                       │──────────>            │
         │                       │                       │
```

## Environment Variables Reference

| Variable | Location | Description |
|----------|----------|-------------|
| `VITE_DODO_PRO_MONTHLY_PRODUCT_ID` | Frontend (.env) | DodoPayments monthly product ID |
| `VITE_DODO_PRO_YEARLY_PRODUCT_ID` | Frontend (.env) | DodoPayments yearly product ID |
| `DODO_PAYMENTS_API_KEY` | Supabase Secrets | DodoPayments API key (secret) |
| `DODO_PAYMENTS_WEBHOOK_KEY` | Supabase Secrets | Webhook signing secret |
| `DODO_PAYMENTS_ENVIRONMENT` | Supabase Secrets | `test_mode` or `live_mode` |

## Troubleshooting

### "Payment system not configured"

- Check that all required environment variables are set
- Verify Supabase secrets are deployed
- Ensure product IDs are correct

### Webhook not receiving events

- Verify webhook URL is accessible from the internet
- Check webhook secret is correctly configured
- Review Supabase Edge Function logs

### Subscription not activating

- Check webhook is receiving `subscription.active` events
- Verify database migration has been applied
- Check Supabase function logs for errors

## Support

- **DodoPayments Docs**: [docs.dodopayments.com](https://docs.dodopayments.com)
- **DodoPayments Discord**: [discord.gg/bYqAp4ayYh](https://discord.gg/bYqAp4ayYh)
- **DodoPayments Support**: support@dodopayments.com
