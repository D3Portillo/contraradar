# Agent Instructions

## Project Overview
contraradar - Framer-like SaaS platform with subscription tiers (Lite/Pro)

## Tech Stack
- Next.js 14+ (App Router, TypeScript)
- Drizzle ORM + Supabase (PostgreSQL)
- Upstash Redis
- Clerk (Authentication)
- PayPal (Subscriptions)
- Tailwind CSS + shadcn/ui

## Common Commands

### Development
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript check
```

### Database
```bash
npm run db:generate      # Generate Drizzle migrations
npm run db:push          # Push schema to database
npm run db:setup         # Create database tables
npm run db:seed          # Seed plan features
npm run db:studio        # Open Drizzle Studio
```

### Setup
```bash
npm run setup            # Full development setup
```

## Environment Variables
Required environment variables are listed in `.env.local.example`

## Architecture
- `/src/app/(public)` - Public pages (landing, pricing, legal)
- `/src/app/(auth)` - Protected pages (dashboard, settings)
- `/src/app/api` - API routes
- `/src/lib/db` - Database schema and client
- `/src/lib/redis` - Upstash Redis client
- `/src/lib/paypal` - Payment integration
- `/src/components` - React components

## Feature Access Control
Use `useFeatureAccess` hook to check if user has access to a feature:
```typescript
const { hasAccess } = useFeatureAccess('advanced_analytics');
if (!hasAccess) return <UpgradeModal />;
```

## Subscription Tiers
- **Free**: Basic dashboard only
- **Lite ($19/mo or $190/year)**: Limited projects + basic support
- **Pro ($35/mo or $350/year)**: Unlimited projects + priority support + advanced features

## Database Schema
See `/docs/DATABASE.md` for detailed schema documentation

## PayPal Integration
See `/docs/PAYPAL.md` for payment integration guide

## Code Style
- Use TypeScript strict mode
- Follow Next.js App Router conventions
- Use server components by default, client components only when needed
- Keep components small and focused
- Use shadcn/ui components for UI
- Run `npm run lint` and `npm run type-check` before committing

## Testing Payments
1. Use PayPal sandbox credentials
2. Create sandbox test accounts in PayPal Developer Dashboard
3. Test subscription flow end-to-end

## Webhooks
- Clerk webhook: `/api/webhooks/clerk` - Syncs users to database
- PayPal webhook: `/api/webhooks/paypal` - Handles subscription events
