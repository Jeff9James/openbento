// Supabase Edge Function: DodoPayments Create Checkout Session
// This function creates a DodoPayments checkout session for subscription products

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

interface CheckoutRequest {
  productId: string;
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
}

interface DodoCheckoutResponse {
  session_id: string;
  checkout_url: string;
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
    const body: CheckoutRequest = await req.json();
    const { productId, customerEmail, successUrl, cancelUrl } = body;

    if (!productId) {
      return new Response(
        JSON.stringify({ error: "Product ID is required" }),
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

    // Create checkout session with DodoPayments API
    const checkoutPayload: Record<string, unknown> = {
      product_cart: [
        { product_id: productId, quantity: 1 }
      ],
      return_url: successUrl,
    };

    // Add customer email if provided
    if (customerEmail) {
      checkoutPayload.customer = { email: customerEmail };
    }

    const response = await fetch(`${baseUrl}/checkouts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DODO_API_KEY}`,
      },
      body: JSON.stringify(checkoutPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("DodoPayments API error:", errorData);
      return new Response(
        JSON.stringify({
          error: errorData.message || "Failed to create checkout session"
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

    const data: DodoCheckoutResponse = await response.json();

    return new Response(
      JSON.stringify({
        session_id: data.session_id,
        checkout_url: data.checkout_url,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("Error creating checkout session:", error);
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
