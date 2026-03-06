# PayPal Integration Guide

## Setup PayPal Business Account

### 1. Create PayPal Developer Account
1. Go to https://developer.paypal.com/
2. Log in with your PayPal account or create one
3. Go to Dashboard → My Apps & Credentials

### 2. Create REST API App
1. Click "Create App"
2. Name it "Contraradar"
3. Copy the Client ID and Client Secret
4. Add to `.env.local`:
   - `PAYPAL_CLIENT_ID`
   - `PAYPAL_CLIENT_SECRET`

### 3. Create Products & Plans

Use the PayPal API or dashboard to create subscription plans.

#### Using the API (Recommended):

```bash
# Get access token
curl -X POST https://api-m.sandbox.paypal.com/v1/oauth2/token \
  -H "Accept: application/json" \
  -H "Accept-Language: en_US" \
  -u "CLIENT_ID:CLIENT_SECRET" \
  -d "grant_type=client_credentials"

# Create Product
curl -X POST https://api-m.sandbox.paypal.com/v1/catalogs/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -d '{
    "name": "Contraradar Lite",
    "description": "Lite subscription plan",
    "type": "SERVICE"
  }'

# Create Monthly Plan ($19/month)
curl -X POST https://api-m.sandbox.paypal.com/v1/billing/plans \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -d '{
    "product_id": "PRODUCT_ID",
    "name": "Lite Monthly",
    "description": "$19/month",
    "billing_cycles": [{
      "frequency": {
        "interval_unit": "MONTH",
        "interval_count": 1
      },
      "tenure_type": "REGULAR",
      "sequence": 1,
      "total_cycles": 0,
      "pricing_scheme": {
        "fixed_price": {
          "value": "19",
          "currency_code": "USD"
        }
      }
    }],
    "payment_preferences": {
      "auto_bill_outstanding": true,
      "setup_fee_failure_action": "CONTINUE",
      "payment_failure_threshold": 3
    }
  }'

# Create Yearly Plan ($190/year)
curl -X POST https://api-m.sandbox.paypal.com/v1/billing/plans \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -d '{
    "product_id": "PRODUCT_ID",
    "name": "Lite Yearly",
    "description": "$190/year",
    "billing_cycles": [{
      "frequency": {
        "interval_unit": "YEAR",
        "interval_count": 1
      },
      "tenure_type": "REGULAR",
      "sequence": 1,
      "total_cycles": 0,
      "pricing_scheme": {
        "fixed_price": {
          "value": "190",
          "currency_code": "USD"
        }
      }
    }],
    "payment_preferences": {
      "auto_bill_outstanding": true,
      "setup_fee_failure_action": "CONTINUE",
      "payment_failure_threshold": 3
    }
  }'
```

Repeat for Pro plan ($35/month, $350/year)

### 4. Copy Plan IDs
After creating plans, copy the Plan IDs to `.env.local`:
- `PAYPAL_LITE_MONTHLY_PLAN_ID`
- `PAYPAL_LITE_YEARLY_PLAN_ID`
- `PAYPAL_PRO_MONTHLY_PLAN_ID`
- `PAYPAL_PRO_YEARLY_PLAN_ID`

## Webhook Setup

### 1. Create Webhook
1. Go to https://developer.paypal.com/dashboard/
2. Click on your app → Webhooks
3. Add webhook URL: `https://yourdomain.com/api/webhooks/paypal`
4. Select events:
   - `BILLING.SUBSCRIPTION.ACTIVATED`
   - `BILLING.SUBSCRIPTION.CANCELLED`
   - `BILLING.SUBSCRIPTION.SUSPENDED`
   - `BILLING.SUBSCRIPTION.EXPIRED`
   - `PAYMENT.SALE.COMPLETED`

### 2. Webhook Handler
Located at `/src/app/api/webhooks/paypal/route.ts`

Handles:
- Subscription activation → Updates user tier
- Subscription cancellation → Sets user to free
- Subscription suspension → Sets user to free
- Subscription expiration → Sets user to free
- Payment completion → Updates billing period

## Subscription Flow

### 1. Create Subscription
```typescript
const res = await fetch('/api/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ tier: 'pro', billingCycle: 'monthly' }),
});

const { approvalUrl } = await res.json();
window.location.href = approvalUrl;
```

### 2. User Approval
User is redirected to PayPal to approve subscription

### 3. Webhook Processing
PayPal sends webhook to `/api/webhooks/paypal` with subscription details

### 4. User Redirected Back
User returns to `/dashboard/billing?success=true`

## Testing

### Sandbox Mode
- Use sandbox credentials (from PayPal Developer Dashboard)
- Test with sandbox PayPal account
- No real charges

### Test Credit Cards
PayPal provides test card numbers in sandbox mode

### Webhook Testing (Local)
Use ngrok for local webhook testing:
```bash
ngrok http 3000
```

Update webhook URL to: `https://your-ngrok-url.ngrok.io/api/webhooks/paypal`

## Subscription States

- **ACTIVE**: Subscription is active
- **CANCELLED**: User cancelled subscription
- **SUSPENDED**: Payment failed, subscription paused
- **EXPIRED**: Subscription period ended

## Customer Management

Users manage subscriptions directly in their PayPal account dashboard.

## Pricing Structure

- **Lite Monthly**: $19/month
- **Lite Yearly**: $190/year (2 months free)
- **Pro Monthly**: $35/month
- **Pro Yearly**: $350/year (2 months free)

## Production Checklist

Before going live:
- [ ] Switch to production PayPal credentials
- [ ] Update webhook URL to production domain
- [ ] Create production products and plans
- [ ] Test complete subscription flow
- [ ] Verify webhook delivery
- [ ] Test cancellation flow
- [ ] Set up proper error handling
- [ ] Configure PayPal IPN (optional)

## Troubleshooting

### Common Issues

**Invalid Client ID/Secret**
- Verify credentials are correct
- Check if using sandbox vs production credentials

**Webhook Not Received**
- Verify webhook URL is publicly accessible
- Check PayPal webhook logs in dashboard
- Ensure correct events are selected

**Subscription Not Created**
- Check plan IDs are correct
- Verify user has valid email
- Check PayPal API response in logs

### Debug Mode
Add logging to webhook handler:
```typescript
console.log('PayPal webhook:', event_type, resource);
```
