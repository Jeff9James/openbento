import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const dodoApiKey = Deno.env.get('DODO_PAYMENTS_API_KEY');
const dodoWebhookKey = Deno.env.get('DODO_PAYMENTS_WEBHOOK_KEY');
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

type WebhookEvent = {
  business_id: string;
  type: string;
  timestamp: string;
  data: {
    payload_type: 'Payment' | 'Subscription' | 'Refund' | 'Dispute' | 'LicenseKey';
    payment_id?: string;
    subscription_id?: string;
    customer_id?: string;
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
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

async function verifyWebhookSignature(
  body: string,
  headers: Headers
): Promise<boolean> {
  if (!dodoWebhookKey) {
    console.warn('DodoPayments webhook key not configured, skipping signature verification');
    return true;
  }

  const webhookId = headers.get('webhook-id');
  const webhookSignature = headers.get('webhook-signature');
  const webhookTimestamp = headers.get('webhook-timestamp');

  if (!webhookId || !webhookSignature || !webhookTimestamp) {
    return false;
  }

  try {
    const signedContent = `${webhookId}.${webhookTimestamp}.${body}`;
    
    const encoder = new TextEncoder();
    const keyData = encoder.encode(dodoWebhookKey);
    const messageData = encoder.encode(signedContent);
    
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign('HMAC', key, messageData);
    const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)));
    
    const expectedSignature = `v1,${signatureBase64}`;
    
    return webhookSignature === expectedSignature;
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
}

function mapDodoStatusToSubscriptionStatus(status: string): string {
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

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return json({ error: 'Method Not Allowed' }, 405);
  }

  const body = await req.text();
  
  const isValid = await verifyWebhookSignature(body, req.headers);
  if (!isValid) {
    return json({ error: 'Invalid webhook signature' }, 401);
  }

  let event: WebhookEvent;
  try {
    event = JSON.parse(body) as WebhookEvent;
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  console.log('Received DodoPayments webhook:', event.type);

  const { type, data } = event;
  const userId = data.metadata?.user_id;
  const customerEmail = data.customer?.email;
  const customerId = data.customer?.customer_id || data.customer_id;
  const subscriptionId = data.subscription_id;

  if (!userId && !customerEmail) {
    console.warn('No user_id or customer email in webhook payload');
    return json({ received: true });
  }

  try {
    let targetUserId = userId;

    if (!targetUserId && customerEmail) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', customerEmail)
        .single();
      
      if (profile) {
        targetUserId = profile.id;
      }
    }

    if (!targetUserId) {
      console.warn('Could not find user for webhook event');
      return json({ received: true });
    }

    switch (type) {
      case 'payment.succeeded':
        await supabase
          .from('user_profiles')
          .update({
            subscription_tier: 'pro',
            subscription_status: 'active',
            dodo_customer_id: customerId || null,
            dodo_subscription_id: subscriptionId || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', targetUserId);
        console.log(`Activated pro subscription for user ${targetUserId}`);
        break;

      case 'subscription.active':
        await supabase
          .from('user_profiles')
          .update({
            subscription_tier: 'pro',
            subscription_status: 'active',
            dodo_customer_id: customerId || null,
            dodo_subscription_id: subscriptionId || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', targetUserId);
        console.log(`Activated pro subscription for user ${targetUserId}`);
        break;

      case 'subscription.canceled':
      case 'subscription.cancelled':
        await supabase
          .from('user_profiles')
          .update({
            subscription_tier: 'free',
            subscription_status: 'canceled',
            updated_at: new Date().toISOString(),
          })
          .eq('id', targetUserId);
        console.log(`Canceled subscription for user ${targetUserId}`);
        break;

      case 'subscription.past_due':
        await supabase
          .from('user_profiles')
          .update({
            subscription_status: 'past_due',
            updated_at: new Date().toISOString(),
          })
          .eq('id', targetUserId);
        console.log(`Marked subscription as past_due for user ${targetUserId}`);
        break;

      case 'subscription.paused':
        await supabase
          .from('user_profiles')
          .update({
            subscription_status: 'paused',
            updated_at: new Date().toISOString(),
          })
          .eq('id', targetUserId);
        console.log(`Paused subscription for user ${targetUserId}`);
        break;

      case 'payment.failed':
        await supabase
          .from('user_profiles')
          .update({
            subscription_status: 'past_due',
            updated_at: new Date().toISOString(),
          })
          .eq('id', targetUserId);
        console.log(`Payment failed for user ${targetUserId}`);
        break;

      default:
        console.log(`Unhandled webhook event type: ${type}`);
    }

    return json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return json({ error: 'Internal server error' }, 500);
  }
});
