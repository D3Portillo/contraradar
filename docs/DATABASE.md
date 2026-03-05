# Database Schema

## Tables

### users
Stores user information synced from Clerk.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| clerk_id | TEXT | Clerk user ID (unique) |
| email | TEXT | User email (unique) |
| full_name | TEXT | User's full name |
| avatar_url | TEXT | Profile picture URL |
| subscription_tier | TEXT | Current plan (free/lite/pro) |
| paypal_customer_id | TEXT | PayPal customer ID |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

**Indexes:**
- `idx_users_clerk_id` - Fast Clerk ID lookups
- `idx_users_email` - Fast email lookups
- `idx_users_subscription_tier` - Filter by tier

### subscriptions
Stores subscription information from PayPal.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| paypal_subscription_id | TEXT | PayPal subscription ID (unique) |
| paypal_plan_id | TEXT | PayPal plan ID |
| status | TEXT | Subscription status (active/cancelled/expired/paused) |
| plan | TEXT | Plan type (lite/pro) |
| billing_cycle | TEXT | Billing cycle (monthly/yearly) |
| current_period_start | TIMESTAMP | Billing period start |
| current_period_end | TIMESTAMP | Billing period end |
| cancel_at_period_end | BOOLEAN | Will cancel at period end |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

**Indexes:**
- `idx_subscriptions_user_id` - User subscription lookups
- `idx_subscriptions_status` - Filter by status

## Relationships

- `subscriptions.user_id` → `users.id` (CASCADE DELETE)
- One user can have multiple subscriptions (history)

## Migrations

Initialize schema with the SQL file:

1. Open Supabase Dashboard → SQL Editor
2. Run `docs/sql/schema.sql`

## Queries

### Get user with subscription
```typescript
const { data } = await supabaseAdmin
  .from('users')
  .select('id, clerk_id, subscriptions(*)')
  .eq('clerk_id', clerkId)
  .single();
```

### Update user subscription tier
```typescript
await supabaseAdmin
  .from('users')
  .update({ subscription_tier: 'pro', updated_at: new Date().toISOString() })
  .eq('id', userId);
```

## Caching

Subscription status is cached in Redis for 5 minutes:
```typescript
const cacheKey = `subscription:${clerkId}`;
await redis.setex(cacheKey, 300, JSON.stringify(subscription));
```

## Webhooks

### Clerk Webhook (`/api/webhooks/clerk`)
- `user.created` - Creates new user record with free tier
- `user.updated` - Updates user information

### PayPal Webhook (`/api/webhooks/paypal`)
- `BILLING.SUBSCRIPTION.ACTIVATED` - Creates subscription record, updates user tier
- `BILLING.SUBSCRIPTION.CANCELLED` - Updates status to cancelled
- `BILLING.SUBSCRIPTION.SUSPENDED` - Updates status to suspended
- `BILLING.SUBSCRIPTION.EXPIRED` - Updates status to expired, sets user to free tier
- `PAYMENT.SALE.COMPLETED` - Updates billing period
