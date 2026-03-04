import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserSubscription } from '@/lib/utils/subscription';
import { checkFeatureAccess } from '@/lib/utils/features';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const featureKey = searchParams.get('key');

    if (!featureKey) {
      return NextResponse.json({ error: 'Missing feature key' }, { status: 400 });
    }

    const subscription = await getUserSubscription(userId);
    const hasAccess = await checkFeatureAccess(featureKey, subscription.tier);

    return NextResponse.json({ hasAccess });
  } catch (error) {
    console.error('Feature check error:', error);
    return NextResponse.json(
      { error: 'Failed to check feature access' },
      { status: 500 }
    );
  }
}
