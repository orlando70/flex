import { useGoogleReviews } from '../lib/hooks/google-reviews';
import { GoogleReview } from '../lib/google-places';
import TruncatedReview from './TruncatedReview';

interface GoogleReviewsProps {
  placeId?: string;
  propertyId?: string;
  propertyName?: string;
  showHeader?: boolean;
}

const GoogleReviews = ({ placeId, propertyId, propertyName, showHeader = true }: GoogleReviewsProps) => {
  const { data, isLoading, error } = useGoogleReviews({ placeId, propertyId });

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-2">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-gray-600">Unable to load Google reviews at this time.</p>
      </div>
    );
  }

  if (!data?.data?.reviews || data.data.reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-2">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <p className="text-gray-600">No Google reviews available for this property.</p>
      </div>
    );
  }

  const { reviews, ratingData, source } = data.data;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <h3 className="text-xl font-semibold text-gray-900">Google Reviews</h3>
            </div>
            {source === 'mock' && (
              <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                Demo Data
              </span>
            )}
          </div>
          {ratingData && (
            <div className="text-right">
              <div className="flex items-center space-x-2">
                {renderStars(ratingData.rating)}
                <span className="text-lg font-semibold text-gray-900">
                  {ratingData.rating.toFixed(1)}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {ratingData.totalReviews} reviews
              </p>
            </div>
          )}
        </div>
      )}

      <div className="max-h-96 overflow-y-auto space-y-4 pr-2 reviews-scrollable">
        {reviews.map((review: GoogleReview, index: number) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow min-h-[120px]">
            <div className="flex items-start space-x-3">
              {review.profile_photo_url && (
                <img
                  src={review.profile_photo_url}
                  alt={review.author_name}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40';
                  }}
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {review.author_name}
                  </h4>
                  <div className="flex items-center space-x-2">
                    {renderStars(review.rating)}
                    <span className="text-xs text-gray-500">
                      {review.relative_time_description}
                    </span>
                  </div>
                </div>
                <div className="min-h-[60px]">
                  <TruncatedReview className="text-sm text-gray-700 leading-relaxed">
                    {review.text}
                  </TruncatedReview>
                </div>
                <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
                  {review.language !== 'en' && (
                    <span className="px-2 py-1 bg-gray-100 rounded">
                      {review.language.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {source === 'mock' && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-blue-800">
              This is demo data. To see real Google reviews, configure the Google Places API key.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleReviews;
