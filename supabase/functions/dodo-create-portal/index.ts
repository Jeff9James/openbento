// Supabase Edge Function: DodoPayments Create Portal Session
// This function creates a customer portal session for subscription management

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

interface PortalRequest {
  customerId: string;
  returnUrl: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  try {
    // Get environment variables
    const DODO_API_KEY = Deno.env.get("DODO_PAYMENTS_API_KEY");
    const DODO_ENVIRONMENT = Deno.env.get("DODO_PAYMENTS_ENVIRONMENT") || "test_mode";

    if (!DODO_API_KEY) {
      console.error("DODO_PAYMENTS_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Payment system not configured" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Parse request body
    const body: PortalRequest = await req.json();
    const { customerId, returnUrl } = body;

    if (!customerId) {
      return new Response(
        JSON.stringify({ error: "Customer ID is required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Determine API base URL based on environment
    const baseUrl = DODO_ENVIRONMENT === "live_mode"
      ? "https://live.dodopayments.com"
      : "https://test.dodopayments.com";

    // Create customer portal session
    const response = await fetch(`${baseUrl}/customer_portal_sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DODO_API_KEY}`,
      },
      body: JSON.stringify({
        customer_id: customerId,
        return_url: returnUrl,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("DodoPayments API error:", errorData);
      return new Response(
        JSON.stringify({
          error: errorData.message || "Failed to create portal session"
        }),
        {
          status: response.status,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const data = await response.json();

    return new Response(
      JSON.stringify({ url: data.url }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("Error creating portal session:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
});
