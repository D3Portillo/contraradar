import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
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

      const { data: user, error: userError } = await supabaseAdmin
        .from('users')
        .select('id, clerk_id')
        .eq('id', customId)
        .maybeSingle();

      if (userError) {
        throw userError;
      }

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const { data: existingSubscription, error: existingSubscriptionError } = await supabaseAdmin
        .from('subscriptions')
        .select('id')
        .eq('paypal_subscription_id', subscriptionId)
        .maybeSingle();

      if (existingSubscriptionError) {
        throw existingSubscriptionError;
      }

      if (existingSubscription) {
        const { error: updateError } = await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'active',
            plan,
            billing_cycle: billingCycle,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingSubscription.id);

        if (updateError) {
          throw updateError;
        }
      } else {
        const { error: insertError } = await supabaseAdmin.from('subscriptions').insert({
          user_id: customId,
          paypal_subscription_id: subscriptionId,
          paypal_plan_id: planId,
          status: 'active',
          plan,
          billing_cycle: billingCycle,
          current_period_start: new Date().toISOString(),
        });

        if (insertError) {
          throw insertError;
        }
      }

      await updateUserSubscriptionTier(customId, plan);
      await redis.del(`subscription:${user.clerk_id}`);
    }

    if (event_type === 'BILLING.SUBSCRIPTION.CANCELLED' || event_type === 'BILLING.SUBSCRIPTION.SUSPENDED') {
      const subscriptionId = resource.id;
      const customId = resource.custom_id;

      const { error: updateError } = await supabaseAdmin
        .from('subscriptions')
        .update({
          status: event_type.includes('CANCELLED') ? 'cancelled' : 'suspended',
          updated_at: new Date().toISOString(),
        })
        .eq('paypal_subscription_id', subscriptionId);

      if (updateError) {
        throw updateError;
      }

      if (customId) {
        await updateUserSubscriptionTier(customId, 'free');

        const { data: user, error: userError } = await supabaseAdmin
          .from('users')
          .select('clerk_id')
          .eq('id', customId)
          .maybeSingle();

        if (userError) {
          throw userError;
        }

        if (user?.clerk_id) {
          await redis.del(`subscription:${user.clerk_id}`);
        }
      }
    }

    if (event_type === 'BILLING.SUBSCRIPTION.EXPIRED') {
      const subscriptionId = resource.id;
      const customId = resource.custom_id;

      const { error: updateError } = await supabaseAdmin
        .from('subscriptions')
        .update({
          status: 'expired',
          updated_at: new Date().toISOString(),
        })
        .eq('paypal_subscription_id', subscriptionId);

      if (updateError) {
        throw updateError;
      }

      if (customId) {
        await updateUserSubscriptionTier(customId, 'free');

        const { data: user, error: userError } = await supabaseAdmin
          .from('users')
          .select('clerk_id')
          .eq('id', customId)
          .maybeSingle();

        if (userError) {
          throw userError;
        }

        if (user?.clerk_id) {
          await redis.del(`subscription:${user.clerk_id}`);
        }
      }
    }

    if (event_type === 'PAYMENT.SALE.COMPLETED') {
      const subscriptionId = resource.billing_agreement_id;

      const { error: updateError } = await supabaseAdmin
        .from('subscriptions')
        .update({
          current_period_start: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('paypal_subscription_id', subscriptionId);

      if (updateError) {
        throw updateError;
      }
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
