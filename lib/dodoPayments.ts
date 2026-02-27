import type { SubscriptionTier } from './database-types';

export interface DodoPaymentsConfig {
  apiKey: string;
  webhookKey: string;
  environment: 'test_mode' | 'live_mode';
}

export interface CheckoutSessionResponse {
  session_id: string;
  checkout_url: string;
}

export interface DodoPaymentsProduct {
  productId: string;
  name: string;
  amount: number;
  currency: string;
  interval?: 'month' | 'year';
}

export const PRODUCTS = {
  PRO_MONTHLY: {
    productId: import.meta.env.VITE_DODO_PRO_MONTHLY_PRODUCT_ID || '',
    name: 'Pro Monthly',
    amount: 9,
    currency: 'USD',
    interval: 'month' as const,
  },
  PRO_YEARLY: {
    productId: import.meta.env.VITE_DODO_PRO_YEARLY_PRODUCT_ID || '',
    name: 'Pro Yearly',
    amount: 79,
    currency: 'USD',
    interval: 'year' as const,
    savings: '27%',
  },
};

export const isDodoPaymentsConfigured = (): boolean => {
  return !!(
    import.meta.env.VITE_DODO_PAYMENTS_API_KEY &&
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );
};

export const getApiBaseUrl = (): string => {
  const environment = import.meta.env.VITE_DODO_PAYMENTS_ENVIRONMENT || 'live_mode';
  return environment === 'test_mode' 
    ? 'https://test.dodopayments.com' 
    : 'https://live.dodopayments.com';
};

export const createCheckoutSession = async (
  productId: string,
  customerEmail?: string,
  userId?: string
): Promise<CheckoutSessionResponse | null> => {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !anonKey) {
      throw new Error('Supabase configuration not found');
    }

    const response = await fetch(
      `${supabaseUrl}/functions/v1/dodo-create-checkout`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${anonKey}`,
        },
        body: JSON.stringify({
          productId,
          customerEmail,
          userId,
          successUrl: `${window.location.origin}/?checkout=success`,
          cancelUrl: `${window.location.origin}/?checkout=cancel`,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create checkout session');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return null;
  }
};

export const getCustomerPortalUrl = async (
  customerId: string
): Promise<{ url: string } | null> => {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !anonKey) {
      throw new Error('Supabase configuration not found');
    }

    const response = await fetch(
      `${supabaseUrl}/functions/v1/dodo-customer-portal`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${anonKey}`,
        },
        body: JSON.stringify({
          customerId,
          returnUrl: window.location.origin,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get customer portal URL');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting customer portal URL:', error);
    return null;
  }
};

export const PRICING = {
  PRO_MONTHLY: {
    productId: PRODUCTS.PRO_MONTHLY.productId,
    amount: PRODUCTS.PRO_MONTHLY.amount,
    interval: PRODUCTS.PRO_MONTHLY.interval,
    name: PRODUCTS.PRO_MONTHLY.name,
  },
  PRO_YEARLY: {
    productId: PRODUCTS.PRO_YEARLY.productId,
    amount: PRODUCTS.PRO_YEARLY.amount,
    interval: PRODUCTS.PRO_YEARLY.interval,
    name: PRODUCTS.PRO_YEARLY.name,
    savings: PRODUCTS.PRO_YEARLY.savings,
  },
};

export type SubscriptionStatus = 'active' | 'inactive' | 'canceled' | 'past_due' | 'paused';

export interface WebhookEvent {
  business_id: string;
  type: string;
  timestamp: string;
  data: {
    payload_type: 'Payment' | 'Subscription' | 'Refund' | 'Dispute' | 'LicenseKey';
    payment_id?: string;
    subscription_id?: string;
    customer?: {
      email: string;
      name?: string;
      customer_id?: string;
    };
    amount?: number;
    total_amount?: number;
    currency?: string;
    status?: string;
    metadata?: Record<string, string>;
  };
}

export function mapDodoStatusToSubscriptionStatus(status: string): SubscriptionStatus {
  switch (status.toLowerCase()) {
    case 'active':
    case 'succeeded':
      return 'active';
    case 'canceled':
    case 'cancelled':
      return 'canceled';
    case 'past_due':
    case 'failed':
      return 'past_due';
    case 'paused':
      return 'paused';
    default:
      return 'inactive';
  }
}

export function getTierFromProductId(productId: string): SubscriptionTier {
  if (
    productId === PRODUCTS.PRO_MONTHLY.productId ||
    productId === PRODUCTS.PRO_YEARLY.productId
  ) {
    return 'pro';
  }
  return 'free';
}
