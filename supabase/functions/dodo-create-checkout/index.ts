import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const dodoApiKey = Deno.env.get('DODO_PAYMENTS_API_KEY');
const dodoEnvironment = Deno.env.get('DODO_PAYMENTS_ENVIRONMENT') || 'live_mode';

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const getApiBaseUrl = () => {
  return dodoEnvironment === 'test_mode' 
    ? 'https://test.dodopayments.com' 
    : 'https://live.dodopayments.com';
};

type CheckoutPayload = {
  productId: string;
  customerEmail?: string;
  userId?: string;
  successUrl: string;
  cancelUrl: string;
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method Not Allowed' }, 405);

  if (!dodoApiKey) {
    return json({ error: 'DodoPayments API key not configured' }, 500);
  }

  let payload: CheckoutPayload;
  try {
    payload = (await req.json()) as CheckoutPayload;
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const { productId, customerEmail, userId, successUrl, cancelUrl } = payload;

  if (!productId) {
    return json({ error: 'Missing productId' }, 400);
  }

  try {
    const apiBaseUrl = getApiBaseUrl();
    
    const checkoutPayload: Record<string, unknown> = {
      product_cart: [
        {
          product_id: productId,
          quantity: 1,
        },
      ],
      return_url: successUrl,
      metadata: {
        user_id: userId || '',
      },
    };

    if (customerEmail) {
      checkoutPayload.customer = {
        email: customerEmail,
      };
    }

    const response = await fetch(`${apiBaseUrl}/checkouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${dodoApiKey}`,
      },
      body: JSON.stringify(checkoutPayload),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('DodoPayments API error:', error);
      return json({ error: error.message || 'Failed to create checkout session' }, response.status);
    }

    const session = await response.json();
    
    return json({
      session_id: session.session_id,
      checkout_url: session.checkout_url,
    });
  } catch (error) {
    console.error('Checkout session creation error:', error);
    return json({ error: 'Failed to create checkout session' }, 500);
  }
});
