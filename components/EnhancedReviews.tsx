import { useState } from 'react';
import { useReviews } from '../lib/hooks/reviews';
import { useGoogleReviews } from '../lib/hooks/google-reviews';
import GoogleReviews from './GoogleReviews';
import TruncatedReview from './TruncatedReview';

interface EnhancedReviewsProps {
  propertyId?: string;
  propertyName?: string;
  googlePlaceId?: string;
  isLoadingGooglePlaceId?: boolean;
}

const EnhancedReviews = ({ propertyId, propertyName, googlePlaceId, isLoadingGooglePlaceId }: EnhancedReviewsProps) => {
  const [activeTab, setActiveTab] = useState<'all' | 'hostaway' | 'google'>('all');
  
  const { data: reviewsData, isLoading: hostawayLoading, error: hostawayError } = useReviews();
  const allReviews = reviewsData?.result || [];
  
  // Get Google Reviews data for accurate count
  const { data: googleReviewsData } = useGoogleReviews({ placeId: googlePlaceId, propertyId });
  const googleReviews = googleReviewsData?.data?.reviews || [];
  
  // Filter reviews for this specific property
  const hostawayReviews = propertyName 
    ? allReviews.filter((r: any) => r.property === propertyName)
    : propertyId 
    ? allReviews.filter((r: any) => r.propertyId === propertyId || r.property === propertyId)
    : allReviews;

  const getRating = (review: { rating?: number; reviewCategory?: { rating: number }[] }) => {
    if (review.rating) {
      return review.rating;
    }
    if (review.reviewCategory) {
      const total = review.reviewCategory.reduce((acc, curr) => acc + curr.rating, 0);
      const avg = total / review.reviewCategory.length;
      return Math.round(avg / 2); // Scale from 10 to 5
    }
    return 0;
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

  const renderHostawayReview = (review: any) => {
    const rating = getRating(review);
    return (
      <div key={`hostaway-${review.id}`} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow min-h-[120px]">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {review.guest}
              </h4>
              <div className="flex items-center space-x-2">
                {renderStars(rating)}
                <span className="text-xs text-gray-500">
                  {new Date(review.date).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="min-h-[60px]">
              <TruncatedReview className="text-sm text-gray-700 leading-relaxed">
                {review.comment}
              </TruncatedReview>
            </div>
            <div className="flex items-center mt-2">
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                Hostaway
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderGoogleReview = (review: any, index: number) => {
    return (
      <div key={`google-${index}`} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow min-h-[120px]">
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
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                Google
              </span>
              {review.language !== 'en' && (
                <span className="px-2 py-1 bg-gray-100 rounded">
                  {review.language.toUpperCase()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAllReviews = () => {
    if (hostawayLoading) {
      return (
        <div className="animate-pulse space-y-4">
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
      );
    }

    if (hostawayError) {
      return (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-2">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-gray-600">Unable to load reviews at this time.</p>
        </div>
      );
    }

    // Combine and sort all reviews by date (newest first)
    const allCombinedReviews = [
      ...hostawayReviews.map((review: any) => ({
        ...review,
        source: 'hostaway',
        sortDate: new Date(review.date).getTime()
      })),
      ...googleReviews.map((review: any) => ({
        ...review,
        source: 'google',
        sortDate: new Date(review.time * 1000).getTime() // Google reviews use timestamp
      }))
    ].sort((a, b) => b.sortDate - a.sortDate);

    if (allCombinedReviews.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-2">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-gray-600">No reviews available for this property.</p>
        </div>
      );
    }

    return (
      <div className="max-h-[calc(3*120px+2rem)] overflow-y-auto space-y-4 pr-2 reviews-scrollable">
        {allCombinedReviews.map((review: any) => {
          if (review.source === 'hostaway') {
            return renderHostawayReview(review);
          } else {
            return renderGoogleReview(review, review.place_id || Math.random());
          }
        })}
      </div>
    );
  };

  const totalReviews = hostawayReviews.length + ((googlePlaceId || isLoadingGooglePlaceId) ? googleReviews.length : 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Reviews ({totalReviews})</h2>
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All Reviews ({totalReviews})
          </button>
          <button
            onClick={() => setActiveTab('hostaway')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'hostaway'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Hostaway ({hostawayReviews.length})
          </button>
          {(googlePlaceId || isLoadingGooglePlaceId) && (
            <button
              onClick={() => setActiveTab('google')}
              disabled={isLoadingGooglePlaceId}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'google'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } ${isLoadingGooglePlaceId ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Google {isLoadingGooglePlaceId ? '(Loading...)' : `(${googleReviews.length})`}
            </button>
          )}
        </nav>
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === 'all' && renderAllReviews()}

        {activeTab === 'hostaway' && (
          <div className="max-h-[calc(3*120px+2rem)] overflow-y-auto space-y-4 pr-2 reviews-scrollable">
            {hostawayReviews.map((review: any) => renderHostawayReview(review))}
          </div>
        )}

        {activeTab === 'google' && (googlePlaceId || isLoadingGooglePlaceId) && (
          <div className="max-h-[calc(3*120px+2rem)] overflow-y-auto space-y-4 pr-2 reviews-scrollable">
            {googleReviews.map((review: any, index: number) => renderGoogleReview(review, index))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedReviews;
