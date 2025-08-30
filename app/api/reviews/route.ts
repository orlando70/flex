import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Review, connectMongo } from '../../lib/reviews/model';
import { normalizeReview } from '@/app/lib/reviews/utils';
// import { normalizeHostawayResponse } from '../../lib/reviews/utils';

export async function GET(request: NextRequest) {
  // Get review visibility states from database
  async function getReviewStates(reviewIds: number[]): Promise<Map<number, any>> {
    await connectMongo();
    const states = await Review.find({
      hostaway_review_id: { $in: reviewIds }
    });
    const stateMap = new Map();
    states.forEach(state => {
      stateMap.set(state.hostaway_review_id, state);
    });
    return stateMap;
  }

  async function normalizeHostawayResponse(hostawayResponse: any, includeHidden: boolean) {
    if (!hostawayResponse.result || !Array.isArray(hostawayResponse.result)) {
      return {
        status: hostawayResponse.status || "success",
        result: [],
        count: 0
      };
    }
    // Get all review IDs
    const reviewIds = hostawayResponse.result.map((review: any) => review.id);
    // Fetch visibility states from database
    const visibilityStates = await getReviewStates(reviewIds);
    // Normalize reviews with visibility data
    const normalizedReviews = hostawayResponse.result.map((review: any) => {
      const visibilityState = visibilityStates.get(review.id);
      return normalizeReview(review, visibilityState, review.channelId);
    });
    const filteredReviews = includeHidden
      ? normalizedReviews
      : normalizedReviews.filter((review: any) => !review.is_hidden);
    return {
      status: hostawayResponse.status,
      result: filteredReviews,
      count: filteredReviews.length,
    };
  }

  const accountId = process.env.NEXT_PUBLIC_HOSTAWAY_ACCOUNT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_HOSTAWAY_CLIENT_SECRET;

  if (!accountId || !clientSecret) {
    return NextResponse.json({ error: 'Missing Hostaway API credentials' }, { status: 400 });
  }

  // Parse includeHidden from query string
  const includeHiddenParam = request.nextUrl.searchParams.get('includeHidden');
  const includeHidden = includeHiddenParam === 'true';

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

  // Step 2: Use access token to fetch reviews
  const { search } = request.nextUrl;
  const reviewsUrl = `https://api.hostaway.com/v1/reviews${search}`;
  const reviewsRes = await fetch(reviewsUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Cache-control': 'no-cache',
      'Content-Type': 'application/json',
    },
  });

  if (!reviewsRes.ok) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }

  const reviews = await reviewsRes.json();

  // If reviews are empty, use mock-data.json as fallback
  if (!reviews.result || reviews.result.length === 0) {
    const fs = require('fs');
    const path = require('path');
    const mockPath = path.resolve(process.cwd(), 'mock-data.json');
    const mockData = JSON.parse(fs.readFileSync(mockPath, 'utf-8'));
    // Normalize mock data before returning
    const normalizedMockData = await normalizeHostawayResponse(mockData, includeHidden);
    return NextResponse.json(normalizedMockData);
  }

  // Normalize real data before returning
  const normalizedReviews = await normalizeHostawayResponse(reviews, includeHidden);
  return NextResponse.json(normalizedReviews);
}

export async function PATCH(request: NextRequest) {
  await connectMongo();
  // Expect payload: { review: { hostaway_review_id, is_hidden } }
  const { review } = await request.json();
  const { hostaway_review_id, is_hidden } = review;
  let updatedReview = await Review.findOneAndUpdate(
    { hostaway_review_id },
    { is_hidden },
    { new: true, upsert: true }
  );
  return NextResponse.json({ success: true, review: updatedReview });
}