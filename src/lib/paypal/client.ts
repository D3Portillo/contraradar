const isSandBox = true //process.env.NODE_ENV !== 'production';
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET
const PAYPAL_API_BASE = isSandBox
  ? "https://api-m.paypal.com"
  : "https://api-m.sandbox.paypal.com"

if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
  throw new Error("PayPal environment variables are not set")
}

let cachedAccessToken: { token: string; expiresAt: number } | null = null

async function getAccessToken(): Promise<string> {
  if (cachedAccessToken && cachedAccessToken.expiresAt > Date.now()) {
    return cachedAccessToken.token
  }

  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`,
  ).toString("base64")

  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-Language": "en_US",
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  })

  if (!res.ok) {
    throw new Error(`Failed to get PayPal access token: ${res.status}`)
  }

  const data = await res.json()

  cachedAccessToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  }

  return data.access_token
}

export async function paypalFetch(endpoint: string, options: RequestInit = {}) {
  const accessToken = await getAccessToken()

  const res = await fetch(`${PAYPAL_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...options.headers,
    },
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`PayPal API error: ${res.status} - ${error}`)
  }

  return res.json()
}

export const paypal = {
  async createProduct(data: {
    name: string
    description: string
    type?: string
  }) {
    return paypalFetch("/v1/catalogs/products", {
      method: "POST",
      body: JSON.stringify({
        name: data.name,
        description: data.description,
        type: data.type || "SERVICE",
      }),
    })
  },

  async createPlan(data: {
    productId: string
    name: string
    description: string
    billingCycles: any[]
  }) {
    return paypalFetch("/v1/billing/plans", {
      method: "POST",
      body: JSON.stringify({
        product_id: data.productId,
        name: data.name,
        description: data.description,
        billing_cycles: data.billingCycles,
        payment_preferences: {
          auto_bill_outstanding: true,
          setup_fee_failure_action: "CONTINUE",
          payment_failure_threshold: 3,
        },
      }),
    })
  },

  async createSubscription(data: {
    planId: string
    returnUrl: string
    cancelUrl: string
    subscriber?: {
      name?: { given_name: string; surname: string }
      email_address: string
    }
    customId?: string
  }) {
    const body: any = {
      plan_id: data.planId,
      application_context: {
        brand_name: "Contraradar",
        locale: "en-US",
        user_action: "SUBSCRIBE_NOW",
        shipping_preference: "NO_SHIPPING",
        payment_method: {
          payer_selected: "PAYPAL",
          payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED",
        },
        return_url: data.returnUrl,
        cancel_url: data.cancelUrl,
      },
    }

    if (data.subscriber) {
      body.subscriber = data.subscriber
    }

    if (data.customId) {
      body.custom_id = data.customId
    }

    return paypalFetch("/v1/billing/subscriptions", {
      method: "POST",
      body: JSON.stringify(body),
    })
  },

  async getSubscription(subscriptionId: string) {
    return paypalFetch(`/v1/billing/subscriptions/${subscriptionId}`)
  },

  async cancelSubscription(subscriptionId: string, reason: string) {
    return paypalFetch(`/v1/billing/subscriptions/${subscriptionId}/cancel`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    })
  },

  async suspendSubscription(subscriptionId: string, reason: string) {
    return paypalFetch(`/v1/billing/subscriptions/${subscriptionId}/suspend`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    })
  },

  async activateSubscription(subscriptionId: string, reason: string) {
    return paypalFetch(`/v1/billing/subscriptions/${subscriptionId}/activate`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    })
  },

  async captureSubscriptionPayment(subscriptionId: string) {
    return paypalFetch(`/v1/billing/subscriptions/${subscriptionId}/capture`, {
      method: "POST",
      body: JSON.stringify({ note: "Capture payment" }),
    })
  },
}

export const PLAN_IDS = {
  liteMonthly: process.env.PAYPAL_LITE_MONTHLY_PLAN_ID!,
  liteYearly: process.env.PAYPAL_LITE_YEARLY_PLAN_ID!,
  proMonthly: process.env.PAYPAL_PRO_MONTHLY_PLAN_ID!,
  proYearly: process.env.PAYPAL_PRO_YEARLY_PLAN_ID!,
}
