# ZeroClick.ai Integration Guide

This document describes the ZeroClick.ai ad integration for OpenBento.

## Overview

OpenBento now uses [ZeroClick.ai](https://zeroclick.ai) - an AI-native advertising platform - instead of Google AdSense for showing ads to free-tier users. Pro users get an ad-free experience.

## Why ZeroClick?

- **AI-Native**: Ads are matched using AI for better relevance
- **Privacy-First**: No tracking cookies or invasive data collection
- **Better UX**: Native ad formats that fit the application design
- **Developer Friendly**: Simple REST API integration

## Setup

### 1. Get Your API Key

1. Visit [developer.zeroclick.ai](https://developer.zeroclick.ai/)
2. Sign up or log in to your account
3. Navigate to **App API Keys** → **Create API Key**
4. Copy your API key

### 2. Configure Environment Variables

Add your ZeroClick API key to your `.env` file:

```bash
VITE_ZEROCLICK_API_KEY=your-zeroclick-api-key
```

For production builds, make sure this environment variable is set in your deployment environment.

### 3. Restart Your Dev Server

After adding the API key, restart your development server:

```bash
npm run dev
```

## How It Works

### Components

- **`ZeroClickAd`** (`components/ZeroClickAd.tsx`): Main component for displaying ads
- **`AdBanner`** (`components/AdBanner.tsx`): Wrapper that combines ZeroClick ads with Pro upgrade CTAs
- **`AdContainer`** (`components/AdBanner.tsx`): Layout wrapper for ad placement

### Ad Formats

The integration supports three ad formats:

1. **Card** (`format="card"`): Large card with image, title, description, and CTA
2. **Inline** (`format="inline"`): Horizontal layout for embedding in content
3. **Compact** (`format="compact"`): Small inline ad for tight spaces

### Usage Examples

```tsx
// Basic usage
<ZeroClickAd query="productivity software" />

// With specific format
<ZeroClickAd
  query="developer tools"
  format="inline"
  limit={1}
/>

// Using the hook
const { offers, isLoading, fetchOffers } = useZeroClickAds();
```

### Ad Placement

Ads are automatically shown in the following locations for free-tier users:

- **Builder page**: Bottom banner ad
- **Sidebar**: Card format ad (when sidebar is open)

Pro users (determined by `useProFeatures().hasNoAds`) don't see any ads.

## API Reference

### ZeroClickAd Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `query` | `string` | `'software tools'` | Search query for matching ads |
| `limit` | `number` | `1` | Number of offers to fetch |
| `format` | `'card' \| 'inline' \| 'compact'` | `'card'` | Visual format of the ad |
| `className` | `string` | `''` | Additional CSS classes |
| `onImpressionTracked` | `() => void` | - | Callback when impressions are tracked |

### useZeroClickAds Hook

```tsx
const {
  offers,           // Array of ZeroClickOffer objects
  isLoading,        // Boolean loading state
  error,            // Error message or null
  fetchOffers,      // Function to fetch offers
  trackImpressions  // Function to track impressions
} = useZeroClickAds();
```

## ZeroClick Offer Schema

```typescript
interface ZeroClickOffer {
  id: string;
  title: string;
  subtitle?: string;
  content?: string;
  cta?: string;
  clickUrl: string;
  imageUrl?: string;
  brand?: {
    name: string;
    url?: string;
    imageUrl?: string;
  };
  price?: {
    amount: string;
    currency: string;
  };
  rating?: {
    value: number;
    count: number;
  };
}
```

## Impression Tracking

Impressions are automatically tracked when ads are displayed. The component calls the `/api/v2/impressions` endpoint with the offer IDs.

**Note**: Impression requests must originate from the end user's device (browser), not from a server. This is handled automatically by the `ZeroClickAd` component.

## Rate Limiting

ZeroClick applies rate limiting per IP address. The component handles this gracefully - if rate limited, it will show the fallback "Upgrade to Pro" promo instead.

## Fallback Behavior

If:
- No API key is configured
- API request fails
- No offers are available
- Rate limit is hit

The component will show a fallback "Upgrade to Pro" promotional banner instead of an ad.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_ZEROCLICK_API_KEY` | Yes | Your ZeroClick API key |

## Legacy Google AdSense

Google AdSense support has been removed in favor of ZeroClick.ai. The old `GoogleAd` component still exists for backwards compatibility but now renders ZeroClick ads instead.

## Troubleshooting

### Ads Not Showing

1. Check that `VITE_ZEROCLICK_API_KEY` is set correctly
2. Verify the API key is valid in the ZeroClick dashboard
3. Check browser console for API errors
4. Ensure you're not a Pro user (Pro users don't see ads)

### "Upgrade to Pro" Banner Shows Instead of Ads

This is the fallback behavior when:
- No API key is configured
- API request failed
- No offers matched the query

### Rate Limiting

If you see console errors about rate limiting, wait a moment and refresh. The component will show the fallback promo in the meantime.

## Support

For ZeroClick-specific issues:
- Email: developers@zeroclick.ai
- Docs: https://developer.zeroclick.ai/docs

For OpenBento-specific integration issues:
- GitHub Issues: https://github.com/yoanbernabeu/openbento/issues
