import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, subscriptions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { updateUserSubscriptionTier } from '@/lib/utils/subscription';
import { redis } from '@/lib/redis/client';
import { paypal } from '@/lib/paypal/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headers = req.headers;
    
    const transmissionId = headers.get('paypal-transmission-id');
    const transmissionTime = headers.get('paypal-transmission-time');
    const certUrl = headers.get('paypal-cert-url');
    const authAlgo = headers.get('paypal-auth-algo');
    const transmissionSig = headers.get('paypal-transmission-sig');

    if (!transmissionId || !transmissionSig) {
      return NextResponse.json({ error: 'Missing PayPal signature headers' }, { status: 400 });
    }

    const data = JSON.parse(body);
    const { event_type, resource } = data;

    console.log(`PayPal webhook received: ${event_type}`);

    if (event_type === 'BILLING.SUBSCRIPTION.ACTIVATED') {
      const subscriptionId = resource.id;
      const customId = resource.custom_id;

      if (!customId) {
        return NextResponse.json({ error: 'Missing custom_id' }, { status: 400 });
      }

      const subscriptionDetails = await paypal.getSubscription(subscriptionId);
      const planId = subscriptionDetails.plan_id;
      
      const plan = planId.includes('pro') ? 'pro' : 'lite';
      const billingCycle = planId.includes('yearly') ? 'yearly' : 'monthly';

      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, customId))
        .limit(1);

      if (!user[0]) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const existingSubscription = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.paypalSubscriptionId, subscriptionId))
        .limit(1);

      if (existingSubscription[0]) {
        await db
          .update(subscriptions)
          .set({
            status: 'active',
            plan,
            billingCycle,
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.id, existingSubscription[0].id));
      } else {
        await db.insert(subscriptions).values({
          userId: customId,
          paypalSubscriptionId: subscriptionId,
          paypalPlanId: planId,
          status: 'active',
          plan,
          billingCycle,
          currentPeriodStart: new Date(),
        });
      }

      await updateUserSubscriptionTier(customId, plan);
      await redis.del(`subscription:${user[0].clerkId}`);
    }

    if (event_type === 'BILLING.SUBSCRIPTION.CANCELLED' || event_type === 'BILLING.SUBSCRIPTION.SUSPENDED') {
      const subscriptionId = resource.id;
      const customId = resource.custom_id;

      await db
        .update(subscriptions)
        .set({
          status: event_type.includes('CANCELLED') ? 'cancelled' : 'suspended',
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.paypalSubscriptionId, subscriptionId));

      if (customId) {
        await updateUserSubscriptionTier(customId, 'free');
        
        const user = await db
          .select({ clerkId: users.clerkId })
          .from(users)
          .where(eq(users.id, customId))
          .limit(1);

        if (user[0]) {
          await redis.del(`subscription:${user[0].clerkId}`);
        }
      }
    }

    if (event_type === 'BILLING.SUBSCRIPTION.EXPIRED') {
      const subscriptionId = resource.id;
      const customId = resource.custom_id;

      await db
        .update(subscriptions)
        .set({
          status: 'expired',
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.paypalSubscriptionId, subscriptionId));

      if (customId) {
        await updateUserSubscriptionTier(customId, 'free');
        
        const user = await db
          .select({ clerkId: users.clerkId })
          .from(users)
          .where(eq(users.id, customId))
          .limit(1);

        if (user[0]) {
          await redis.del(`subscription:${user[0].clerkId}`);
        }
      }
    }

    if (event_type === 'PAYMENT.SALE.COMPLETED') {
      const subscriptionId = resource.billing_agreement_id;
      
      await db
        .update(subscriptions)
        .set({
          currentPeriodStart: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.paypalSubscriptionId, subscriptionId));
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('PayPal webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
