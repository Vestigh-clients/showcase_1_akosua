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

type PaystackPayload = {
  status?: boolean;
  message?: string;
  data?: unknown;
};

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;

const readString = (value: unknown): string | null => (typeof value === "string" && value.trim() ? value.trim() : null);

const parsePaystackError = (payload: PaystackPayload | null, fallback: string) => {
  const message = typeof payload?.message === "string" && payload.message.trim() ? payload.message.trim() : fallback;
  return message;
};

const requestPaystackData = async (
  path: string,
  secretKey: string,
  options?: {
    allowNotFound?: boolean;
    swallowFailure?: boolean;
  },
) => {
  const response = await fetch(`https://api.paystack.co${path}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
  });

  const payload = (await response.json().catch(() => null)) as PaystackPayload | null;

  if (options?.allowNotFound && response.status === 404) {
    return null;
  }

  if (!response.ok || !payload?.status) {
    if (options?.swallowFailure) {
      return null;
    }

    throw new Error(parsePaystackError(payload, "Failed to fetch Paystack account details"));
  }

  return payload.data ?? null;
};

const extractBusinessName = (value: unknown): string | null => {
  const record = asRecord(value);
  if (!record) {
    return null;
  }

  const nestedBusiness = asRecord(record.business);

  return (
    readString(record.business_name) ??
    readString(record.businessName) ??
    readString(record.name) ??
    readString(nestedBusiness?.name) ??
    null
  );
};

const extractAccountStatus = (...values: unknown[]): "active" | "inactive" => {
  for (const value of values) {
    const record = asRecord(value);
    if (!record) {
      continue;
    }

    for (const candidate of [record.active, record.is_active, record.enabled, record.is_enabled, record.status]) {
      if (candidate === false || candidate === 0) {
        return "inactive";
      }

      if (candidate === true || candidate === 1) {
        return "active";
      }

      if (typeof candidate === "string") {
        const normalized = candidate.trim().toLowerCase();
        if (normalized === "inactive" || normalized === "disabled") {
          return "inactive";
        }

        if (normalized === "active" || normalized === "enabled" || normalized === "success") {
          return "active";
        }
      }
    }
  }

  return "active";
};

const extractCurrency = (value: unknown): string | null => {
  if (Array.isArray(value)) {
    for (const entry of value) {
      const record = asRecord(entry);
      const currency = readString(record?.currency);
      if (currency) {
        return currency;
      }
    }
    return null;
  }

  const record = asRecord(value);
  return readString(record?.currency);
};

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const secretKey = Deno.env.get("PAYSTACK_SECRET_KEY");

    if (!secretKey) {
      return json({ error: "Payment configuration error" }, 500);
    }

    // This documented endpoint reliably confirms whether the secret key is valid.
    const timeoutData = await requestPaystackData("/integration/payment_session_timeout", secretKey);

    // Business metadata is not consistently exposed by Paystack's public API, so keep these best-effort.
    const [integrationData, balanceData] = await Promise.all([
      requestPaystackData("/integration", secretKey, { allowNotFound: true, swallowFailure: true }),
      requestPaystackData("/balance", secretKey, { swallowFailure: true }),
    ]);

    return json({
      business_name: extractBusinessName(integrationData),
      account_status: extractAccountStatus(integrationData, timeoutData),
      currency: extractCurrency(balanceData),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return json({ error: message }, 500);
  }
});
