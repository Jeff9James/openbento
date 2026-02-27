// Supabase Edge Function: DodoPayments Webhook Handler
// This function handles webhook events from DodoPayments and updates user subscriptions

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface DodoWebhookEvent {
  type: string;
  data: Record<string, unknown>;
  timestamp: string;
  business_id: string;
}

interface SubscriptionData {
  subscription_id: string;
  customer_id: string;
  status: string;
  product_id: string;
  email?: string;
}

Deno.serve(async (req: Request) => {
  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Get environment variables
    const DODO_WEBHOOK_KEY = Deno.env.get("DODO_PAYMENTS_WEBHOOK_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!DODO_WEBHOOK_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing required environment variables");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Verify webhook signature (if provided by DodoPayments)
    const signature = req.headers.get("x-dodo-signature");
    const body = await req.text();

    // Note: Implement signature verification based on DodoPayments documentation
    // For now, we'll proceed with the payload
    const event: DodoWebhookEvent = JSON.parse(body);

    // Initialize Supabase client with service role key for admin access
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    console.log(`Received webhook event: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      case "subscription.active":
      case "subscription.renewed": {
        const subscription = event.data as SubscriptionData;
        await handleSubscriptionActive(supabase, subscription);
        break;
      }
      case "subscription.cancelled":
      case "subscription.expired": {
        const subscription = event.data as SubscriptionData;
        await handleSubscriptionCancelled(supabase, subscription);
        break;
      }
      case "subscription.on_hold": {
        const subscription = event.data as SubscriptionData;
        await handleSubscriptionOnHold(supabase, subscription);
        break;
      }
      case "payment.succeeded": {
        // Payment succeeded - can be used for one-time purchases
        console.log("Payment succeeded:", event.data);
        break;
      }
      case "payment.failed": {
        console.log("Payment failed:", event.data);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});

async function handleSubscriptionActive(
  supabase: ReturnType<typeof createClient>,
  subscription: SubscriptionData
) {
  // Find user by customer_id or email
  const { data: profile, error: findError } = await supabase
    .from("user_profiles")
    .select("id")
    .eq("dodo_customer_id", subscription.customer_id)
    .single();

  if (findError || !profile) {
    // Try to find by email if customer_id doesn't match
    if (subscription.email) {
      const { data: emailProfile, error: emailError } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("email", subscription.email)
        .single();

      if (emailError || !emailProfile) {
        console.error("User not found for subscription:", subscription);
        return;
      }

      // Update user profile with Pro subscription
      await supabase
        .from("user_profiles")
        .update({
          subscription_tier: "pro",
          subscription_status: "active",
          dodo_customer_id: subscription.customer_id,
          dodo_subscription_id: subscription.subscription_id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", emailProfile.id);

      console.log(`Activated Pro subscription for user: ${emailProfile.id}`);
    }
    return;
  }

  // Update user profile with Pro subscription
  const { error: updateError } = await supabase
    .from("user_profiles")
    .update({
      subscription_tier: "pro",
      subscription_status: "active",
      dodo_customer_id: subscription.customer_id,
      dodo_subscription_id: subscription.subscription_id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", profile.id);

  if (updateError) {
    console.error("Error updating subscription:", updateError);
  } else {
    console.log(`Activated Pro subscription for user: ${profile.id}`);
  }
}

async function handleSubscriptionCancelled(
  supabase: ReturnType<typeof createClient>,
  subscription: SubscriptionData
) {
  // Find user by subscription_id
  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("id")
    .eq("dodo_subscription_id", subscription.subscription_id)
    .single();

  if (error || !profile) {
    console.error("User not found for subscription:", subscription.subscription_id);
    return;
  }

  // Update user profile to free tier
  await supabase
    .from("user_profiles")
    .update({
      subscription_tier: "free",
      subscription_status: "inactive",
      updated_at: new Date().toISOString(),
    })
    .eq("id", profile.id);

  console.log(`Cancelled subscription for user: ${profile.id}`);
}

async function handleSubscriptionOnHold(
  supabase: ReturnType<typeof createClient>,
  subscription: SubscriptionData
) {
  // Find user by subscription_id
  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("id")
    .eq("dodo_subscription_id", subscription.subscription_id)
    .single();

  if (error || !profile) {
    console.error("User not found for subscription:", subscription.subscription_id);
    return;
  }

  // Update subscription status to past_due
  await supabase
    .from("user_profiles")
    .update({
      subscription_status: "past_due",
      updated_at: new Date().toISOString(),
    })
    .eq("id", profile.id);

  console.log(`Subscription on hold for user: ${profile.id}`);
}
