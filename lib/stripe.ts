import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      console.warn('Stripe publishable key not found');
      return Promise.resolve(null);
    }
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export const createCheckoutSession = async (
  priceId: string,
  customerEmail?: string
): Promise<CheckoutSessionResponse | null> => {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !anonKey) {
      throw new Error('Supabase configuration not found');
    }

    const response = await fetch(
      `${supabaseUrl}/functions/v1/stripe-create-checkout`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${anonKey}`,
        },
        body: JSON.stringify({
          priceId,
          customerEmail,
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

export const createPortalSession = async (
  customerId: string
): Promise<{ url: string } | null> => {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !anonKey) {
      throw new Error('Supabase configuration not found');
    }

    const response = await fetch(
      `${supabaseUrl}/functions/v1/stripe-create-portal`,
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
      throw new Error(error.message || 'Failed to create portal session');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating portal session:', error);
    return null;
  }
};

export const PRICING = {
  PRO_MONTHLY: {
    priceId: import.meta.env.VITE_STRIPE_PRO_MONTHLY_PRICE_ID || '',
    amount: 9,
    interval: 'month',
    name: 'Pro Monthly',
  },
  PRO_YEARLY: {
    priceId: import.meta.env.VITE_STRIPE_PRO_YEARLY_PRICE_ID || '',
    amount: 79,
    interval: 'year',
    name: 'Pro Yearly',
    savings: '27%',
  },
};

export const isStripeConfigured = (): boolean => {
  return !!(
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY &&
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );
};
