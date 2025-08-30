import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const accountId = process.env.NEXT_PUBLIC_HOSTAWAY_ACCOUNT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_HOSTAWAY_CLIENT_SECRET;
  const { id } = await params;

  if (!accountId || !clientSecret) {
    return NextResponse.json({ error: 'Missing Hostaway API credentials' }, { status: 400 });
  }

  // Step 1: Get access token
  const tokenRes = await fetch('https://api.hostaway.com/v1/accessTokens', {
    method: 'POST',
    headers: {
      'Cache-control': 'no-cache',
      'Content-type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=client_credentials&client_id=${accountId}&client_secret=${clientSecret}&scope=general`,
  });

  if (!tokenRes.ok) {
    return NextResponse.json({ error: 'Failed to fetch access token' }, { status: 401 });
  }

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;

  // Step 2: Use access token to fetch listing by ID
  const listingUrl = `https://api.hostaway.com/v1/listings/${id}`;
  const listingRes = await fetch(listingUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Cache-control': 'no-cache',
      'Content-Type': 'application/json',
    },
  });

  if (!listingRes.ok) {
    return NextResponse.json({ error: 'Failed to fetch listing' }, { status: 500 });
  }

  const listing = await listingRes.json();
  return NextResponse.json(listing);
}
