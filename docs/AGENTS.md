# Agent Instructions

## Project Overview
contraradar - Framer-like SaaS platform with subscription tiers (Lite/Pro)

## Tech Stack
- Next.js 14+ (App Router, TypeScript)
- Supabase
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
- Run `docs/sql/schema.sql` in Supabase SQL Editor to create tables and seed features

## Environment Variables
Required environment variables are listed in `.env.local.example`

## Architecture
- `/src/app/(public)` - Public pages (landing, pricing, legal)
- `/src/app/(auth)` - Protected pages (dashboard, settings)
- `/src/app/api` - API routes
- `/src/lib/supabase` - Supabase server clients
- `/src/lib/redis` - Upstash Redis client
- `/src/lib/paypal` - Payment integration
- `/src/components` - React components

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
