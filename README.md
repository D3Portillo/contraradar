# Contraradar

Professional SaaS platform with subscription-based feature access.

## Tech Stack

- **Framework**: Next.js 14+ (App Router, TypeScript)
- **Database**: Supabase (PostgreSQL) + Drizzle ORM
- **Caching**: Upstash Redis
- **Auth**: Clerk
- **Payments**: PayPal Subscriptions
- **UI**: Tailwind CSS + shadcn/ui

## Features

- ✅ Subscription tiers (Free, Lite, Pro)
- ✅ Feature access control
- ✅ User authentication
- ✅ Payment processing
- ✅ Customer portal
- ✅ Webhook handlers
- ✅ Redis caching
- ✅ Responsive design
- ✅ Stripe-compliant (Terms, Privacy, Refund policies)

## Pricing

- **Free**: Basic dashboard
- **Lite**: $19/month or $190/year - Limited projects + basic support
- **Pro**: $35/month or $350/year - Unlimited projects + priority support + advanced features

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Setup database
npm run db:setup
npm run db:seed

# Start development server
npm run dev
```

Visit http://localhost:3000

## Documentation

- [Setup Guide](./docs/SETUP.md)
- [Database Schema](./docs/DATABASE.md)
- [PayPal Integration](./docs/PAYPAL.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Agent Instructions](./docs/AGENTS.md)

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check

# Database
npm run db:setup     # Create database tables
npm run db:seed      # Seed plan features
npm run db:studio    # Open Drizzle Studio
npm run db:generate  # Generate migrations
npm run db:push      # Push schema to database
```

## Project Structure

```
contraradar/
├── docs/                    # Documentation
├── scripts/                 # Setup and utility scripts
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── (public)/       # Public pages
│   │   ├── (auth)/         # Protected pages
│   │   └── api/            # API routes
│   ├── components/         # React components
│   ├── lib/                # Utilities and clients
│   ├── hooks/              # Custom React hooks
│   └── types/              # TypeScript types
└── package.json
```

## Environment Variables

See `.env.local.example` for required environment variables.

## License

MIT
