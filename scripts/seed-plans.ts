import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { planFeatures } from '../src/lib/db/schema';

async function seedFeatures() {
  console.log('🌱 Seeding plan features...');
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  const connectionString = process.env.DATABASE_URL;
  const sql = postgres(connectionString, { max: 1 });
  const db = drizzle(sql, { schema: { planFeatures } });

  const features = [
    { plan: 'free', featureName: 'Basic Dashboard', featureKey: 'basic_dashboard', isEnabled: true },
    { plan: 'lite', featureName: 'Limited Projects (5)', featureKey: 'limited_projects', isEnabled: true },
    { plan: 'lite', featureName: 'Basic Support', featureKey: 'basic_support', isEnabled: true },
    { plan: 'pro', featureName: 'Unlimited Projects', featureKey: 'unlimited_projects', isEnabled: true },
    { plan: 'pro', featureName: 'Priority Support', featureKey: 'priority_support', isEnabled: true },
    { plan: 'pro', featureName: 'Advanced Analytics', featureKey: 'advanced_analytics', isEnabled: true },
    { plan: 'pro', featureName: 'Custom Domains', featureKey: 'custom_domains', isEnabled: true },
    { plan: 'pro', featureName: 'API Access', featureKey: 'api_access', isEnabled: true },
  ];

  try {
    for (const feature of features) {
      await sql`
        INSERT INTO plan_features (plan, feature_name, feature_key, is_enabled)
        VALUES (${feature.plan}, ${feature.featureName}, ${feature.featureKey}, ${feature.isEnabled})
        ON CONFLICT (feature_key) DO NOTHING
      `;
    }
    
    console.log('✅ Plan features seeded successfully');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

seedFeatures();
