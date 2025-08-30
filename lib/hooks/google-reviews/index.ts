import { useQuery } from '@tanstack/react-query';
import { GoogleReview } from '../../google-places';

interface GoogleReviewsResponse {
  status: string;
  data: {
    reviews: GoogleReview[];
    ratingData: {
      rating: number;
      totalReviews: number;
    };
    source: 'google' | 'mock';
    error?: string;
  };
}

interface UseGoogleReviewsOptions {
  placeId?: string;
  propertyId?: string;
  enabled?: boolean;
}

export function useGoogleReviews({ placeId, propertyId, enabled = true }: UseGoogleReviewsOptions) {
  return useQuery({
    queryKey: ['google-reviews', placeId, propertyId],
    queryFn: async (): Promise<GoogleReviewsResponse> => {
      const params = new URLSearchParams();
      if (placeId) params.append('placeId', placeId);
      if (propertyId) params.append('propertyId', propertyId);

      const response = await fetch(`/api/google-reviews?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch Google reviews');
      }
      return response.json();
    },
    enabled: enabled && (!!placeId || !!propertyId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useGoogleReviewsSearch() {
  return useQuery({
    queryKey: ['google-reviews-search'],
    queryFn: async ({ query, location }: { query: string; location?: { lat: number; lng: number } }) => {
      const response = await fetch('/api/google-reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, location }),
      });
      if (!response.ok) {
        throw new Error('Failed to search for place');
      }
      return response.json();
    },
    enabled: false, // This query should be triggered manually
  });
}
