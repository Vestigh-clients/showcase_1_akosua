const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });

const SUBACCOUNT_CODE_PATTERN = /^ACCT_[A-Za-z0-9]+$/;

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = (await request.json().catch(() => ({}))) as { subaccount_code?: string };
    const subaccountCode = typeof body.subaccount_code === "string" ? body.subaccount_code.trim() : "";

    if (!subaccountCode) {
      return json({ error: "subaccount_code is required" }, 400);
    }

    if (!SUBACCOUNT_CODE_PATTERN.test(subaccountCode)) {
      return json({ error: "Invalid subaccount_code format" }, 400);
    }

    const secretKey = Deno.env.get("PAYSTACK_SECRET_KEY");

    if (!secretKey) {
      return json({ error: "Payment configuration error" }, 500);
    }

    const response = await fetch(`https://api.paystack.co/subaccount/${subaccountCode}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
    });

    const payload = await response.json().catch(() => null) as
      | { status?: boolean; message?: string; data?: unknown }
      | null;

    if (!response.ok || !payload?.status) {
      const message =
        typeof payload?.message === "string" && payload.message.trim()
          ? payload.message
          : "Failed to fetch subaccount details";

      return json({ error: message }, response.ok ? 400 : response.status);
    }

    return json(payload.data ?? null);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return json({ error: message }, 500);
  }
});
