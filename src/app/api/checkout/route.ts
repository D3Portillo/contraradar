import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { paypal, PLAN_IDS } from '@/lib/paypal/client';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tier, billingCycle } = await req.json();

    if (!tier || !billingCycle) {
      return NextResponse.json({ error: 'Missing plan selection' }, { status: 400 });
    }

    const planMap = {
      lite: {
        monthly: PLAN_IDS.liteMonthly,
        yearly: PLAN_IDS.liteYearly,
      },
      pro: {
        monthly: PLAN_IDS.proMonthly,
        yearly: PLAN_IDS.proYearly,
      },
    } as const;

    if (!(tier in planMap) || (billingCycle !== 'monthly' && billingCycle !== 'yearly')) {
      return NextResponse.json({ error: 'Invalid plan selection' }, { status: 400 });
    }

    const planId = planMap[tier as keyof typeof planMap][billingCycle as 'monthly' | 'yearly'];

    if (!planId || planId === 'P-...' || !planId.startsWith('P-')) {
      return NextResponse.json(
        {
          error:
            'Invalid PayPal plan configuration. Set real PAYPAL_*_PLAN_ID values in your environment.',
        },
        { status: 500 }
      );
    }

    const { data: existingUser, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, email, full_name')
      .eq('clerk_id', userId)
      .maybeSingle();

    if (userError) {
      throw userError;
    }

    let user = existingUser;

    if (!user) {
      const clerkUser = await currentUser();
      const email = clerkUser?.emailAddresses?.[0]?.emailAddress;

      if (!email) {
        return NextResponse.json({ error: 'User email not found' }, { status: 400 });
      }

      const fullName = [clerkUser?.firstName, clerkUser?.lastName]
        .filter(Boolean)
        .join(' ')
        .trim() || null;

      const { data: createdUser, error: createError } = await supabaseAdmin
        .from('users')
        .upsert(
          {
            clerk_id: userId,
            email,
            full_name: fullName,
            avatar_url: clerkUser?.imageUrl ?? null,
            subscription_tier: 'free',
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'clerk_id' }
        )
        .select('id, email, full_name')
        .single();

      if (createError) {
        throw createError;
      }

      user = createdUser;
    }

    const appOrigin = req.nextUrl.origin;

    const subscription = await paypal.createSubscription({
      planId,
      returnUrl: `${appOrigin}/dashboard/billing?success=true`,
      cancelUrl: `${appOrigin}/dashboard/billing?cancelled=true`,
      subscriber: {
        name: user.full_name
          ? {
              given_name: user.full_name.split(' ')[0] || '',
              surname: user.full_name.split(' ').slice(1).join(' ') || '',
            }
          : undefined,
        email_address: user.email,
      },
      customId: user.id,
    });

    return NextResponse.json({
      subscriptionId: subscription.id,
      approvalUrl: subscription.links.find((link: any) => link.rel === 'approve')?.href,
    });
  } catch (error) {
    console.error('Checkout error:', error);

    const supabaseErrorCode =
      typeof error === 'object' && error !== null && 'code' in error
        ? String((error as { code?: string }).code)
        : undefined;

    if (supabaseErrorCode === 'PGRST205') {
      return NextResponse.json(
        {
          error:
            'Database schema is not initialized. Run docs/sql/schema.sql in Supabase SQL Editor.',
        },
        { status: 503 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : '';

    if (
      errorMessage.includes('RESOURCE_NOT_FOUND') ||
      errorMessage.includes('INVALID_RESOURCE_ID')
    ) {
      return NextResponse.json(
        {
          error:
            'PayPal plan ID not found. Verify PAYPAL_*_PLAN_ID values exist in the same PayPal environment as your API keys (Sandbox vs Live).',
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}
