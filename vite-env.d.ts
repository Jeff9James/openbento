/// <reference types="vite/client" />

// Environment variables
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_GEMINI_API_KEY?: string;
  // DodoPayments Configuration
  readonly VITE_DODO_PRO_MONTHLY_PRODUCT_ID?: string;
  readonly VITE_DODO_PRO_YEARLY_PRODUCT_ID?: string;
  // Legacy Stripe (deprecated - will be removed)
  readonly VITE_STRIPE_PUBLISHABLE_KEY?: string;
  readonly VITE_STRIPE_PRO_MONTHLY_PRICE_ID?: string;
  readonly VITE_STRIPE_PRO_YEARLY_PRICE_ID?: string;
  // ZeroClick.ai Ads
  readonly VITE_ZEROCLICK_API_KEY?: string;
  // Legacy: Google AdSense (deprecated)
  readonly VITE_GOOGLE_ADSENSE_CLIENT_ID?: string;
  // Optional
  readonly VITE_PLAUSIBLE_DOMAIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// MDX/Markdown file imports
declare module '*.md' {
  import type { ComponentType } from 'react';
  const Component: ComponentType;
  export default Component;
}

declare module '*.mdx' {
  import type { ComponentType } from 'react';
  const Component: ComponentType;
  export default Component;
}
