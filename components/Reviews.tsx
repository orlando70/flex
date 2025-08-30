import { useState, useEffect } from 'react';
import { PropertyMappingService } from '../lib/property-mapping';
import EnhancedReviews from './EnhancedReviews';

interface ReviewsProps {
  propertyId?: string;
  propertyName?: string;
  propertyAddress?: string;
  latitude?: number;
  longitude?: number;
}

const Reviews = ({ propertyId, propertyName, propertyAddress, latitude, longitude }: ReviewsProps) => {
  const [googlePlaceId, setGooglePlaceId] = useState<string | null>(null);
  const [isLoadingPlaceId, setIsLoadingPlaceId] = useState(false);

  useEffect(() => {
    const loadGooglePlaceId = async () => {
      if (!propertyId) return;

      setIsLoadingPlaceId(true);
      try {
        // Try to get place ID with fallback search
        const placeId = await PropertyMappingService.getPlaceIdWithFallback(
          propertyId, 
          propertyName, 
          propertyAddress,
          latitude,
          longitude
        );
        setGooglePlaceId(placeId);
      } catch (error) {
        console.warn('Failed to load Google Place ID:', error);
        setGooglePlaceId(null);
      } finally {
        setIsLoadingPlaceId(false);
      }
    };

    loadGooglePlaceId();
  }, [propertyId, propertyName, propertyAddress, latitude, longitude]);

  return (
    <EnhancedReviews
      propertyId={propertyId}
      propertyName={propertyName}
      googlePlaceId={googlePlaceId || undefined}
      isLoadingGooglePlaceId={isLoadingPlaceId}
    />
  );
};

export default Reviews;