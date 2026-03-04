import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../src/lib/db/schema';

async function setupDatabase() {
  console.log('🚀 Setting up database...');
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  const connectionString = process.env.DATABASE_URL;
  const sql = postgres(connectionString, { max: 1 });

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        clerk_id TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        full_name TEXT,
        avatar_url TEXT,
        subscription_tier TEXT DEFAULT 'free' NOT NULL,
        paypal_customer_id TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;
    console.log('✅ Users table created');

    await sql`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        paypal_subscription_id TEXT UNIQUE NOT NULL,
        paypal_plan_id TEXT,
        status TEXT NOT NULL,
        plan TEXT NOT NULL,
        billing_cycle TEXT NOT NULL,
        current_period_start TIMESTAMP,
        current_period_end TIMESTAMP,
        cancel_at_period_end BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;
    console.log('✅ Subscriptions table created');

    await sql`
      CREATE TABLE IF NOT EXISTS plan_features (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        plan TEXT NOT NULL,
        feature_name TEXT NOT NULL,
        feature_key TEXT UNIQUE NOT NULL,
        is_enabled BOOLEAN DEFAULT TRUE,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;
    console.log('✅ Plan features table created');

    await sql`CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON users(subscription_tier)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_plan_features_plan ON plan_features(plan)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_plan_features_key ON plan_features(feature_key)`;
    console.log('✅ Indexes created');

    await sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `;
    console.log('✅ Update trigger function created');

    await sql`
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
    `;
    await sql`
      CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `;

    await sql`
      DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
    `;
    await sql`
      CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `;
    console.log('✅ Update triggers created');

    console.log('\n✅ Database setup complete!');
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

setupDatabase();
