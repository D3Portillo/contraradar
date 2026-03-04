import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { paypal } from '@/lib/paypal/client';
import { db } from '@/lib/db';
import { subscriptions, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { redis } from '@/lib/redis/client';

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (!user[0]) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const subscription = await db
      .select()
      .from(subscriptions)
      .where(and(
        eq(subscriptions.userId, user[0].id),
        eq(subscriptions.status, 'active')
      ))
      .limit(1);

    if (!subscription[0]) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    await paypal.cancelSubscription(
      subscription[0].paypalSubscriptionId,
      'User requested cancellation'
    );

    await db
      .update(subscriptions)
      .set({
        cancelAtPeriodEnd: true,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.id, subscription[0].id));

    await redis.del(`subscription:${userId}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}
