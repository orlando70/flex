import { NextRequest, NextResponse } from 'next/server';
import { googlePlacesService, mockGoogleReviews, mockGoogleRatingData } from '../../../lib/google-places';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get('placeId');
  const propertyId = searchParams.get('propertyId');

  if (!placeId && !propertyId) {
    return NextResponse.json(
      { error: 'placeId or propertyId parameter is required' },
      { status: 400 }
    );
  }

  try {
    if (!placeId) {
      // Return mock data when no placeId is available
      return NextResponse.json({
        status: 'success',
        data: {
          reviews: mockGoogleReviews,
          ratingData: mockGoogleRatingData,
          source: 'mock',
        },
      });
    }


    // Check if Google Places API is configured
    if (!googlePlacesService.isConfigured()) {
      // Return mock data when API is not configured
      return NextResponse.json({
        status: 'success',
        data: {
          reviews: mockGoogleReviews,
          ratingData: mockGoogleRatingData,
          source: 'mock',
        },
      });
    }

    // Fetch real Google reviews
    const reviews = await googlePlacesService.getReviews(placeId);
    const ratingData = await googlePlacesService.getRatingData(placeId);

    return NextResponse.json({
      status: 'success',
      data: {
        reviews,
        ratingData,
        source: 'google',
      },
    });
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    
    // Fallback to mock data on error
    return NextResponse.json({
      status: 'success',
      data: {
        reviews: mockGoogleReviews,
        ratingData: mockGoogleRatingData,
        source: 'mock',
        error: 'Failed to fetch Google reviews, using mock data',
      },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query, location, latitude, longitude, propertyName, address } = await request.json();

    // Check if Google Places API is configured
    if (!googlePlacesService.isConfigured()) {
      return NextResponse.json({
        status: 'success',
        data: {
          placeId: null,
          message: 'Google Places API not configured',
        },
      });
    }

    let placeId: string | null = null;

    // If we have coordinates, use them for more accurate search
    if (latitude && longitude) {
      placeId = await googlePlacesService.searchPlaceByCoordinates(latitude, longitude, propertyName, address);
    }
    // Fallback to text-based search
    else if (query) {
      placeId = await googlePlacesService.searchPlace(query, location);
    }
    else {
      return NextResponse.json(
        { error: 'Either query or latitude/longitude parameters are required' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      status: 'success',
      data: {
        placeId,
        query: query || `${propertyName}, ${address}`,
        coordinates: latitude && longitude ? { latitude, longitude } : null,
      },
    });
  } catch (error) {
    console.error('Error searching Google place:', error);
    return NextResponse.json(
      { error: 'Failed to search for place' },
      { status: 500 }
    );
  }
}
