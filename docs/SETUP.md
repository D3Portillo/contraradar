# Setup Guide

## Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Upstash Redis account
- Clerk account
- PayPal Business account

## Step-by-Step Setup

### 1. Clone and Install
```bash
cd /Desktop/code/contraradar
npm install
```

### 2. Set Up Supabase
1. Create a new Supabase project at https://supabase.com
2. Go to Settings → Database → Connection string
3. Copy the connection string (replace `[YOUR-PASSWORD]` with your database password)
4. Add to `.env.local` as `DATABASE_URL`

### 3. Set Up Upstash Redis
1. Create a new Upstash Redis database at https://upstash.com
2. Copy the REST URL and REST Token from the dashboard
3. Add to `.env.local` as `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

### 4. Set Up Clerk
1. Create a new Clerk application at https://clerk.com
2. Copy Publishable Key and Secret Key from the dashboard
3. Add to `.env.local`:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
4. Configure sign-in/sign-up URLs in Clerk dashboard
5. Create a webhook endpoint: `https://yourdomain.com/api/webhooks/clerk`
   - Select `user.created` and `user.updated` events
   - Copy webhook secret to `CLERK_WEBHOOK_SECRET`

### 5. Set Up PayPal
1. Create a PayPal Developer account at https://developer.paypal.com/
2. Create a REST API app in the dashboard
3. Copy Client ID and Client Secret to `.env.local`:
   - `PAYPAL_CLIENT_ID`
   - `PAYPAL_CLIENT_SECRET`
4. Create subscription products and plans (see `/docs/PAYPAL.md` for detailed instructions)
5. Copy Plan IDs to `.env.local`:
   - `PAYPAL_LITE_MONTHLY_PLAN_ID`
   - `PAYPAL_LITE_YEARLY_PLAN_ID`
   - `PAYPAL_PRO_MONTHLY_PLAN_ID`
   - `PAYPAL_PRO_YEARLY_PLAN_ID`
   - `NEXT_PUBLIC_PAYPAL_LITE_MONTHLY_PLAN_ID`
   - `NEXT_PUBLIC_PAYPAL_LITE_YEARLY_PLAN_ID`
   - `NEXT_PUBLIC_PAYPAL_PRO_MONTHLY_PLAN_ID`
   - `NEXT_PUBLIC_PAYPAL_PRO_YEARLY_PLAN_ID`
6. Set up webhook: `https://yourdomain.com/api/webhooks/paypal`
   - Select subscription events (see `/docs/PAYPAL.md`)

### 6. Configure Environment
```bash
cp .env.local.example .env.local
# Edit .env.local with your credentials
```

### 7. Run Setup Script
```bash
npm run setup
```

This will:
- Install dependencies
- Create database tables
- Seed plan features

### 8. Start Development
```bash
npm run dev
```

Visit http://localhost:3000

## Environment Variables

### Required Variables
```bash
# Database (Supabase)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
CLERK_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"

# Upstash Redis
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# PayPal
PAYPAL_CLIENT_ID="..."
PAYPAL_CLIENT_SECRET="..."
PAYPAL_LITE_MONTHLY_PLAN_ID="P-..."
PAYPAL_LITE_YEARLY_PLAN_ID="P-..."
PAYPAL_PRO_MONTHLY_PLAN_ID="P-..."
PAYPAL_PRO_YEARLY_PLAN_ID="P-..."
NEXT_PUBLIC_PAYPAL_LITE_MONTHLY_PLAN_ID="P-..."
NEXT_PUBLIC_PAYPAL_LITE_YEARLY_PLAN_ID="P-..."
NEXT_PUBLIC_PAYPAL_PRO_MONTHLY_PLAN_ID="P-..."
NEXT_PUBLIC_PAYPAL_PRO_YEARLY_PLAN_ID="P-..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct
- Ensure your IP is whitelisted in Supabase
- Check if Supabase project is running

### Clerk Webhook Issues
- Verify webhook secret is correct
- Check Clerk dashboard for webhook logs
- Ensure webhook URL is publicly accessible (use ngrok for local testing)

### PayPal Webhook Issues
- Verify webhook URL is accessible
- Check PayPal webhook logs in developer dashboard
- Ensure correct events are selected

### Redis Connection Issues
- Verify Upstash Redis URL and token are correct
- Check if Redis database is active in Upstash dashboard

## Next Steps
1. Test the complete user flow (sign up → subscribe → access features)
2. Customize landing page content
3. Add your own features and pages
4. Deploy to production (Vercel recommended)
