import "dotenv/config"

const CONFIG = {
  environment: "sandbox",
  productId: "",
  productName: "Contraradar Subscriptions",
  productDescription: "Subscription plans for Contraradar",
  currencyCode: "USD",
  plans: [
    {
      envVar: "PAYPAL_LITE_MONTHLY_PLAN_ID",
      name: "Lite Monthly",
      description: "Lite plan billed monthly",
      price: "19",
      intervalUnit: "MONTH",
      intervalCount: 1,
    },
    {
      envVar: "PAYPAL_LITE_YEARLY_PLAN_ID",
      name: "Lite Yearly",
      description: "Lite plan billed yearly",
      price: "190",
      intervalUnit: "YEAR",
      intervalCount: 1,
    },
    {
      envVar: "PAYPAL_PRO_MONTHLY_PLAN_ID",
      name: "Pro Monthly",
      description: "Pro plan billed monthly",
      price: "35",
      intervalUnit: "MONTH",
      intervalCount: 1,
    },
    {
      envVar: "PAYPAL_PRO_YEARLY_PLAN_ID",
      name: "Pro Yearly",
      description: "Pro plan billed yearly",
      price: "350",
      intervalUnit: "YEAR",
      intervalCount: 1,
    },
  ],
}

function requireEnv(name) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`)
  }
  return value
}

function getApiBase(environment) {
  return environment === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com"
}

async function getAccessToken(apiBase) {
  const clientId = requireEnv("PAYPAL_CLIENT_ID")
  const clientSecret = requireEnv("PAYPAL_CLIENT_SECRET")

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")

  const res = await fetch(`${apiBase}/v1/oauth2/token`, {
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
    const body = await res.text()
    throw new Error(`Failed to get token (${res.status}): ${body}`)
  }

  const data = await res.json()
  return data.access_token
}

async function paypalRequest(apiBase, token, endpoint, body) {
  const res = await fetch(`${apiBase}${endpoint}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(
      `PayPal request failed (${endpoint}) ${res.status}: ${text}`,
    )
  }

  return res.json()
}

async function createProduct(apiBase, token) {
  const product = await paypalRequest(apiBase, token, "/v1/catalogs/products", {
    name: CONFIG.productName,
    description: CONFIG.productDescription,
    type: "SERVICE",
    category: "SOFTWARE",
  })

  return product.id
}

async function createPlan(apiBase, token, productId, plan) {
  const payload = {
    product_id: productId,
    name: plan.name,
    description: plan.description,
    status: "ACTIVE",
    billing_cycles: [
      {
        frequency: {
          interval_unit: plan.intervalUnit,
          interval_count: plan.intervalCount,
        },
        tenure_type: "REGULAR",
        sequence: 1,
        total_cycles: 0,
        pricing_scheme: {
          fixed_price: {
            value: plan.price,
            currency_code: CONFIG.currencyCode,
          },
        },
      },
    ],
    payment_preferences: {
      auto_bill_outstanding: true,
      setup_fee_failure_action: "CONTINUE",
      payment_failure_threshold: 3,
    },
  }

  const created = await paypalRequest(
    apiBase,
    token,
    "/v1/billing/plans",
    payload,
  )
  return created.id
}

async function main() {
  const apiBase = getApiBase(CONFIG.environment)
  const token = await getAccessToken(apiBase)

  const productId = CONFIG.productId || (await createProduct(apiBase, token))

  console.log(`Using PayPal ${CONFIG.environment} environment`)
  console.log(`Product ID: ${productId}`)

  const createdPlans = []
  for (const plan of CONFIG.plans) {
    const planId = await createPlan(apiBase, token, productId, plan)
    createdPlans.push({ envVar: plan.envVar, planId, name: plan.name })
    console.log(`Created plan: ${plan.name} -> ${planId}`)
  }

  console.log("\nAdd these to your .env.local:")
  for (const plan of createdPlans) {
    console.log(`${plan.envVar}="${plan.planId}"`)
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
