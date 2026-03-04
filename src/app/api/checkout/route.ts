import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { paypal, PLAN_IDS } from '@/lib/paypal/client';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planId } = await req.json();

    if (!planId) {
      return NextResponse.json({ error: 'Missing plan ID' }, { status: 400 });
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (!user[0]) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const subscription = await paypal.createSubscription({
      planId,
      subscriber: {
        name: user[0].fullName
          ? {
              given_name: user[0].fullName.split(' ')[0] || '',
              surname: user[0].fullName.split(' ').slice(1).join(' ') || '',
            }
          : undefined,
        email_address: user[0].email,
      },
      customId: user[0].id,
    });

    return NextResponse.json({ 
      subscriptionId: subscription.id,
      approvalUrl: subscription.links.find((link: any) => link.rel === 'approve')?.href,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}
