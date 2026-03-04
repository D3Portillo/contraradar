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

### plan_features
Stores feature flags for each plan.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| plan | TEXT | Plan type (free/lite/pro) |
| feature_name | TEXT | Display name |
| feature_key | TEXT | Unique feature identifier |
| is_enabled | BOOLEAN | Feature status |
| metadata | JSONB | Additional configuration |
| created_at | TIMESTAMP | Creation timestamp |

**Indexes:**
- `idx_plan_features_plan` - Filter by plan
- `idx_plan_features_key` - Feature key lookups

## Relationships

- `subscriptions.user_id` → `users.id` (CASCADE DELETE)
- One user can have multiple subscriptions (history)

## Migrations

### Generate Migrations
```bash
npm run db:generate
```

### Push to Database
```bash
npm run db:push
```

### Setup Database (Create Tables)
```bash
npm run db:setup
```

### Seed Plan Features
```bash
npm run db:seed
```

## Queries

### Get user with subscription
```typescript
const userWithSubscription = await db
  .select()
  .from(users)
  .leftJoin(subscriptions, eq(users.id, subscriptions.userId))
  .where(eq(users.clerkId, clerkId));
```

### Check feature access
```typescript
const feature = await db
  .select()
  .from(planFeatures)
  .where(eq(planFeatures.featureKey, 'advanced_analytics'))
  .limit(1);
```

### Update user subscription tier
```typescript
await db
  .update(users)
  .set({ subscriptionTier: 'pro', updatedAt: new Date() })
  .where(eq(users.id, userId));
```

## Plan Hierarchy

Features are hierarchical:
- **Free** features are available to all users
- **Lite** features include Free + Lite features
- **Pro** features include Free + Lite + Pro features

This is enforced in `/src/lib/utils/features.ts`:

```typescript
const PLAN_HIERARCHY = {
  free: 0,
  lite: 1,
  pro: 2,
};

const hasAccess = PLAN_HIERARCHY[userTier] >= PLAN_HIERARCHY[requiredTier];
```

## Caching

Subscription status is cached in Redis for 5 minutes:
```typescript
const cacheKey = `subscription:${clerkId}`;
await redis.setex(cacheKey, 300, JSON.stringify(subscription));
```

Feature flags are cached for 1 hour:
```typescript
const cacheKey = `feature:${featureKey}:${userTier}`;
await redis.setex(cacheKey, 3600, hasAccess.toString());
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
