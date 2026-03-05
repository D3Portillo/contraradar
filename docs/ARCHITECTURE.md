# System Architecture

## Overview

contraradar is a SaaS platform built with Next.js 14+ using the App Router pattern. It provides subscription-based access to features through Lite and Pro tiers.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js Application                   │
├─────────────────────────────────────────────────────────┤
│  Public Routes (/, /pricing, /terms, etc.)              │
│  Protected Routes (/dashboard, /settings, /billing)     │
│  API Routes (/api/checkout, /api/webhooks, etc.)        │
└─────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
      ┌──────────┐      ┌──────────┐      ┌──────────┐
      │  Clerk   │      │ Upstash  │      │  PayPal  │
      │  (Auth)  │      │  Redis   │      │          │
      └──────────┘      └──────────┘      └──────────┘
        │                 │                 │
        └─────────────────┼─────────────────┘
                          ▼
                  ┌──────────────┐
                  │   Supabase   │
                  │ (PostgreSQL) │
                  └──────────────┘
```

## Components

### Frontend (Next.js)
- **Pages**: App Router with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: React hooks + server state
- **Auth**: Clerk React SDK

### Backend (API Routes)
- **Authentication**: Clerk middleware
- **Validation**: Zod schemas
- **Database**: Supabase client
- **Caching**: Upstash Redis

### Database (Supabase)
- **PostgreSQL**: Primary data store
- **Supabase JS**: Server-side queries
- **Connection Pooling**: Via Supabase

### Authentication (Clerk)
- **User Management**: Sign-up, sign-in, profile
- **Session Management**: JWT tokens
- **Webhooks**: Sync users to database

### Payments (PayPal)
- **Checkout**: PayPal subscription approvals
- **Subscriptions**: Recurring billing
- **Webhooks**: Subscription and payment events
- **Customer Portal**: PayPal autopay management

### Caching (Upstash Redis)
- **Subscription Status**: Cache for 5 min
- **Feature Flags**: Cache for 1 hour
- **Session Data**: Optional

## Data Flow

### User Registration Flow
```
1. User signs up via Clerk
2. User record is upserted on first protected action (e.g. checkout)
3. Set default subscription_tier = 'free'
4. Redirect to /dashboard
```

### Subscription Flow
```
1. User clicks "Upgrade" button
2. POST /api/checkout with planId
3. Create PayPal subscription
4. Redirect to PayPal approval page
5. Payment completed
6. PayPal webhook triggers /api/webhooks/paypal
7. Create subscription record in Supabase
8. Update user.subscription_tier
9. Cache subscription in Redis
10. Redirect to /dashboard
```

### Tier Access Flow
```
1. User accesses protected section
2. Check Redis cache for subscription
3. If not cached, query Supabase
4. Compare tier (free/lite/pro)
5. Show content or upgrade modal
```

## Security

### Authentication
- All protected routes use Clerk middleware
- API routes validate Clerk session
- PayPal webhooks verify signatures

### Authorization
- Tier access checked based on subscription_tier
- Subscription status validated on each request
- Redis cache prevents DB overload

### Data Protection
- Environment variables for secrets
- No secrets in client-side code
- HTTPS only in production
- Webhook signature verification

## Performance

### Optimization Strategies
- Static generation for public pages
- Dynamic rendering for protected pages
- Redis caching for frequent queries
- Database connection pooling via Supabase
- Image optimization via Next.js

### Caching Strategy
- **Subscription Status**: 5 minutes
- **User Data**: Not cached (always fresh)

### Database Optimization
- Indexes on frequently queried columns
- Efficient joins with proper foreign keys
- Connection pooling via Supabase

## Scalability

### Horizontal Scaling
- Serverless functions (Vercel recommended)
- Stateless API routes
- Redis for shared state

### Database Scaling
- Supabase handles connection pooling
- Read replicas available if needed
- Indexes on frequently queried columns

### Caching Layer
- Redis reduces database load
- Automatic cache invalidation on updates
- TTL-based expiration

## Development Workflow

### Local Development
```bash
npm run dev          # Start dev server
```

### Database Management
```bash
# Run docs/sql/schema.sql once in Supabase SQL Editor
```

### Deployment
```bash
npm run build        # Build for production
npm run start        # Start production server
```

## API Endpoints

### Public
- `POST /api/webhooks/paypal` - PayPal webhook

### Protected (Requires Auth)
- `POST /api/checkout` - Create checkout session
- `GET /api/subscription` - Get subscription status
- `POST /api/subscription/cancel` - Cancel subscription
- `GET /api/customer-portal` - Get customer portal URL

## Environment Variables

See `.env.local.example` for all required variables.

### Required for Development
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `SUPABASE_SECRET_KEY` - Supabase secret server key for backend queries
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key
- `UPSTASH_REDIS_REST_URL` - Upstash Redis URL
- `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis token
- `PAYPAL_CLIENT_ID` - PayPal client ID
- `PAYPAL_CLIENT_SECRET` - PayPal client secret
- `PAYPAL_LITE_MONTHLY_PLAN_ID` - PayPal Lite monthly plan ID
- `PAYPAL_LITE_YEARLY_PLAN_ID` - PayPal Lite yearly plan ID
- `PAYPAL_PRO_MONTHLY_PLAN_ID` - PayPal Pro monthly plan ID
- `PAYPAL_PRO_YEARLY_PLAN_ID` - PayPal Pro yearly plan ID

## Monitoring

### Recommended Tools
- **Vercel Analytics** (if deployed on Vercel)
- **Clerk Dashboard** - Auth metrics
- **PayPal Developer Dashboard** - Payment metrics
- **Supabase Dashboard** - Database metrics
- **Upstash Dashboard** - Redis metrics

### Key Metrics
- User sign-ups
- Subscription conversions
- API response times
- Database query performance
- Cache hit rates

## Backup and Recovery

### Database
- Supabase provides automatic backups
- Manual backups via `pg_dump`

### Code
- Git repository (GitHub, GitLab, etc.)
- Regular commits and pushes

### Environment Variables
- Store in secure vault (1Password, etc.)
- Never commit to git

## Future Improvements

### Potential Enhancements
- Add rate limiting to API routes
- Implement webhook retry logic
- Add email notifications
- Implement team/organization features
- Add more detailed analytics
- Implement A/B testing
- Add internationalization (i18n)
- Implement real-time features with WebSockets
