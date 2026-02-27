// DodoPayments Integration Service
// This service handles checkout session creation and customer portal access

export interface CheckoutSessionResponse {
  session_id: string;
  checkout_url: string;
}

export interface PortalSessionResponse {
  url: string;
}

export const createCheckoutSession = async (
  productId: string,
  customerEmail?: string
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
): Promise<PortalSessionResponse | null> => {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !anonKey) {
      throw new Error('Supabase configuration not found');
    }

    const response = await fetch(
      `${supabaseUrl}/functions/v1/dodo-create-portal`,
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

// Pricing configuration for DodoPayments products
// Create these products in your DodoPayments dashboard and copy the product IDs
export const PRICING = {
  PRO_MONTHLY: {
    productId: import.meta.env.VITE_DODO_PRO_MONTHLY_PRODUCT_ID || '',
    amount: 9,
    interval: 'month',
    name: 'Pro Monthly',
  },
  PRO_YEARLY: {
    productId: import.meta.env.VITE_DODO_PRO_YEARLY_PRODUCT_ID || '',
    amount: 79,
    interval: 'year',
    name: 'Pro Yearly',
    savings: '27%',
  },
};

// Check if DodoPayments is properly configured
export const isDodoConfigured = (): boolean => {
  return !!(
    import.meta.env.VITE_DODO_PRO_MONTHLY_PRODUCT_ID &&
    import.meta.env.VITE_DODO_PRO_YEARLY_PRODUCT_ID &&
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );
};
