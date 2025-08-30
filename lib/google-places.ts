

export interface GoogleReview {
  author_name: string;
  author_url?: string;
  language: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

export interface GooglePlaceDetails {
  place_id: string;
  name: string;
  reviews: GoogleReview[];
  rating: number;
  user_ratings_total: number;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export interface GooglePlacesResponse {
  status: string;
  result: GooglePlaceDetails;
  error_message?: string;
}

export interface GooglePlacesSearchResponse {
  status: string;
  results: any[];
  error_message?: string;
}

export interface PropertyPlaceMapping {
  propertyId: string;
  propertyName: string;
  googlePlaceId: string;
  address: string;
  lastUpdated: Date;
}

class GooglePlacesService {
  private apiKey: string;
  private baseUrl = 'https://maps.googleapis.com/maps/api/place';

  constructor() {
    this.apiKey = process.env.GOOGLE_PLACES_API_KEY || '';
    if (!this.apiKey) {
      console.warn('❌ Google Places API key not found. Google reviews will not be available.');
    } else {
      console.log('✅ Google Places API key is configured');
    }
  }

  /**
   * Get place details including reviews by place ID
   */
  async getPlaceDetails(placeId: string): Promise<GooglePlaceDetails | null> {
    if (!this.apiKey) {
      console.warn('Google Places API key not configured');
      return null;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/details/json?place_id=${placeId}&fields=place_id,name,reviews,rating,user_ratings_total,formatted_address,geometry&key=${this.apiKey}`
      );
      const data: GooglePlacesResponse = await response.json();

      if (data.status === 'OK') {
        return data.result;
      } else {
        console.error('Google Places API error:', data.status, data.error_message);
        return null;
      }
    } catch (error) {
      console.error('Error fetching Google place details:', error);
      return null;
    }
  }

  /**
   * Search for a place by coordinates and return place ID
   */
  async searchPlaceByCoordinates(
    latitude: number, 
    longitude: number, 
    propertyName?: string, 
    address?: string
  ): Promise<string | null> {
    
    if (!this.apiKey) {
      console.warn('Google Places API key not configured');
      return null;
    }

    try {
      // First, try to find nearby places using the coordinates
      const nearbyParams: any = {
        location: `${latitude},${longitude}`,
        radius: 100, // 100m radius for very precise search
        type: 'lodging', // Focus on accommodation/businesses
        key: this.apiKey,
      };

      const nearbyResponse = await fetch(
        `${this.baseUrl}/nearbysearch/json?${new URLSearchParams(nearbyParams).toString()}`
      );
      const nearbyData: GooglePlacesSearchResponse = await nearbyResponse.json();


      if (nearbyData.status === 'OK' && nearbyData.results.length > 0) {
        
        // If we have property name, try to match it with nearby results
        if (propertyName) {
          const matchingPlace = nearbyData.results.find((place: any) =>
            place.name.toLowerCase().includes(propertyName.toLowerCase()) ||
            propertyName.toLowerCase().includes(place.name.toLowerCase())
          );
          
          if (matchingPlace) {
            return matchingPlace.place_id;
          }
        }

        // Return the closest place if no name match found
        return nearbyData.results[0].place_id;
      }

      // If nearby search fails, try text search with coordinates as bias
      if (propertyName || address) {
        const query = propertyName || address || '';
        const textSearchParams: any = {
          query,
          location: `${latitude},${longitude}`,
          radius: 1000, // 1km radius
          key: this.apiKey,
        };

        const textResponse = await fetch(
          `${this.baseUrl}/textsearch/json?${new URLSearchParams(textSearchParams).toString()}`
        );
        const textData: GooglePlacesSearchResponse = await textResponse.json();


        if (textData.status === 'OK' && textData.results.length > 0) {
          return textData.results[0].place_id;
        }
      }

      console.error('❌ No places found near the given coordinates');
      return null;
    } catch (error) {
      console.error('Error searching Google place by coordinates:', error);
      return null;
    }
  }

  /**
   * Search for a place by text query and return place ID
   */
  async searchPlace(query: string, location?: { lat: number; lng: number }): Promise<string | null> {
    if (!this.apiKey) {
      console.warn('Google Places API key not configured');
      return null;
    }

    try {
      const params: any = {
        query,
        key: this.apiKey,
      };

      if (location) {
        params.location = `${location.lat},${location.lng}`;
        params.radius = 5000; // 5km radius
      }

      const response = await fetch(
        `${this.baseUrl}/textsearch/json?${new URLSearchParams(params).toString()}`
      );
      const searchData: GooglePlacesSearchResponse = await response.json();

      if (searchData.status === 'OK' && searchData.results.length > 0) {
        return searchData.results[0].place_id;
      } else {
        console.error('Google Places search error:', searchData.status);
        return null;
      }
    } catch (error) {
      console.error('Error searching Google place:', error);
      return null;
    }
  }

  /**
   * Get reviews for a property by place ID
   */
  async getReviews(placeId: string): Promise<GoogleReview[]> {
    const placeDetails = await this.getPlaceDetails(placeId);
    return placeDetails?.reviews || [];
  }

  /**
   * Get aggregated rating data for a property
   */
  async getRatingData(placeId: string): Promise<{ rating: number; totalReviews: number } | null> {
    const placeDetails = await this.getPlaceDetails(placeId);
    if (!placeDetails) return null;

    return {
      rating: placeDetails.rating,
      totalReviews: placeDetails.user_ratings_total,
    };
  }

  /**
   * Check if the service is properly configured
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }
}

// Export singleton instance
export const googlePlacesService = new GooglePlacesService();

// Mock data for development/testing when API key is not available
export const mockGoogleReviews: GoogleReview[] = [
  {
    author_name: 'Sarah Johnson',
    rating: 5,
    relative_time_description: '2 months ago',
    text: 'Excellent property management service! The team was very responsive and professional. Highly recommend The Flex for anyone looking for quality accommodation.',
    time: Date.now() - 60 * 24 * 60 * 60 * 1000, // 2 months ago
    language: 'en',
    profile_photo_url: 'https://via.placeholder.com/40',
  },
  {
    author_name: 'Michael Chen',
    rating: 4,
    relative_time_description: '3 months ago',
    text: 'Great experience with The Flex. The property was clean and well-maintained. The booking process was smooth and the staff was helpful.',
    time: Date.now() - 90 * 24 * 60 * 60 * 1000, // 3 months ago
    language: 'en',
    profile_photo_url: 'https://via.placeholder.com/40',
  },
  {
    author_name: 'Emma Wilson',
    rating: 5,
    relative_time_description: '1 month ago',
    text: 'Outstanding service! The property exceeded our expectations. The location was perfect and the amenities were top-notch. Will definitely use The Flex again.',
    time: Date.now() - 30 * 24 * 60 * 60 * 1000, // 1 month ago
    language: 'en',
    profile_photo_url: 'https://via.placeholder.com/40',
  },
];

export const mockGoogleRatingData = {
  rating: 4.7,
  totalReviews: 156,
};
