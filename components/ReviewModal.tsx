import { Search, Star, Eye, EyeOff, MessageSquare, CheckCircle, AlertCircle, Filter } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { usePatchReview } from '@/lib/hooks/reviews';
import { useState } from 'react';

interface ReviewModalProps {
  selectedProperty: number | null;
  setSelectedProperty: (id: number | null) => void;
  listingsData: any;
  propertyReviews: any[];
  paginatedReviews: any[];
  reviewSearch: string;
  setReviewSearch: (val: string) => void;
  reviewPage: number;
  setReviewPage: (page: number) => void;
  totalReviewPages: number;
  reviewPageSize: number;
}

export default function ReviewModal({ selectedProperty, setSelectedProperty, listingsData, propertyReviews, paginatedReviews, reviewSearch, setReviewSearch, reviewPage, setReviewPage, totalReviewPages, reviewPageSize }: ReviewModalProps) {
  const queryClient = useQueryClient();
  const [pendingReviewId, setPendingReviewId] = useState<number | null>(null);
  const { mutate: patchReview, isPending } = usePatchReview({
    onMutate: async (newReviewData) => {
      setPendingReviewId(newReviewData.hostaway_review_id);
      await queryClient.cancelQueries({ queryKey: ['reviews'] });
      const previousReviews = queryClient.getQueryData(['reviews']);
      queryClient.setQueryData(['reviews'], (old: any) => {
        if (!old) return old;
        const updatedResult = old.result.map((review: any) =>
          review.id === newReviewData.hostaway_review_id
            ? { ...review, is_hidden: newReviewData.is_hidden }
            : review
        );
        return { ...old, result: updatedResult };
      });
      return { previousReviews };
    },
    onSuccess: () => {
      setPendingReviewId(null);
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
    onError: (err, newReviewData, context) => {
      setPendingReviewId(null);
      if (context?.previousReviews) {
        queryClient.setQueryData(['reviews'], context.previousReviews);
      }
      console.error("Failed to update review:", err);
    },
  });
  const [showHiddenReviews, setShowHiddenReviews] = useState(true);

  if (!selectedProperty) return null;

  // Filter reviews based on visibility preference
  const filteredReviews = showHiddenReviews 
    ? paginatedReviews 
    : paginatedReviews.filter(review => !review.is_hidden);

  const hiddenCount = propertyReviews.filter(review => review.is_hidden).length;
  const visibleCount = propertyReviews.filter(review => !review.is_hidden).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Reviews for {listingsData.result.find((p: any) => p.id === selectedProperty)?.name}
            </h2>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
              <span>{propertyReviews.length} total reviews</span>
              <span className="text-green-600">• {visibleCount} visible</span>
              <span className="text-gray-500">• {hiddenCount} hidden</span>
            </div>
          </div>
          <button
            onClick={() => setSelectedProperty(null)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6 border-b border-gray-200 space-y-4">
          {/* Search and Filter Controls */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Search reviews by guest name or comment..."
              value={reviewSearch}
              onChange={(e) => setReviewSearch(e.target.value)}
            />
          </div>
          
          {/* Visibility Filter Toggle */}
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-gray-500" />
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={showHiddenReviews}
                onChange={(e) => setShowHiddenReviews(e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              Show hidden reviews
            </label>
            {!showHiddenReviews && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Showing only visible reviews
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-4">
            {filteredReviews.map((review: any) => (
              <div key={review.id} className={`rounded-lg p-4 border transition-all duration-200 ${
                review.is_hidden 
                  ? 'bg-gray-100 border-gray-300 opacity-75' 
                  : 'bg-white border-gray-200 shadow-sm'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`font-medium ${review.is_hidden ? 'text-gray-500' : 'text-gray-900'}`}>
                        {review.guest}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className={`w-4 h-4 ${review.is_hidden ? 'text-gray-400' : 'text-yellow-400'} fill-current`} />
                        <span className={`text-sm font-medium ${review.is_hidden ? 'text-gray-500' : 'text-gray-900'}`}>
                          {review.rating}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                      {/* Status Badge */}
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        review.is_hidden 
                          ? 'bg-gray-200 text-gray-600' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {review.is_hidden ? (
                          <>
                            <AlertCircle className="w-3 h-3" />
                            Hidden
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            Visible
                          </>
                        )}
                      </div>
                    </div>
                    <p className={`mb-3 ${review.is_hidden ? 'text-gray-500' : 'text-gray-700'}`}>
                      {review.comment}
                    </p>
                    {review.reviewCategory && review.reviewCategory.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {review.reviewCategory.map((cat: any, idx: number) => (
                          <div key={idx} className={`px-2 py-1 rounded text-xs border ${
                            review.is_hidden 
                              ? 'bg-gray-200 border-gray-300 text-gray-500' 
                              : 'bg-white border-gray-200 text-gray-600'
                          }`}>
                            <span className="capitalize">{cat.category.replace('_', ' ')}: </span>
                            <span className="font-medium">{cat.rating}/10</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    {/* Toggle Switch */}
                    <div className="flex flex-col items-center gap-2">
                      <label className="text-xs font-medium text-gray-600">
                        {review.is_hidden ? 'Hidden' : 'Visible'}
                      </label>
                      <button
                        onClick={() => patchReview({ 
                          hostaway_review_id: review.id, 
                          is_hidden: !review.is_hidden 
                        })}
                        disabled={isPending && pendingReviewId === review.id}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                          review.is_hidden 
                            ? 'bg-gray-300' 
                            : 'bg-green-500'
                        } ${isPending && pendingReviewId === review.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <span
                          className={`inline-flex items-center justify-center h-4 w-4 rounded-full bg-white transition-transform ${
                            review.is_hidden ? 'translate-x-1' : 'translate-x-6'
                          }`}
                        >
                          {isPending && pendingReviewId === review.id ? (
                            <svg className="animate-spin h-3 w-3 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <span
                              className={`h-4 w-4 rounded-full bg-white transform ${
                                review.is_hidden ? 'translate-x-1' : 'translate-x-6'
                              }`}
                            />
                          )}
                        </span>
                      </button>
                      <span className="text-xs text-gray-500">
                        {review.is_hidden ? 'Click to show' : 'Click to hide'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filteredReviews.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {showHiddenReviews ? 'No reviews found.' : 'No visible reviews found.'}
                </p>
                {!showHiddenReviews && (
                  <p className="text-sm text-gray-400 mt-2">
                    Try enabling "Show hidden reviews" to see all reviews
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Review Pagination */}
        {totalReviewPages > 1 && (
          <div className="p-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Showing {((reviewPage - 1) * reviewPageSize) + 1} to {Math.min(reviewPage * reviewPageSize, propertyReviews.length)} of {propertyReviews.length} reviews
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setReviewPage(Math.max(1, reviewPage - 1))}
                  disabled={reviewPage === 1}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(3, totalReviewPages) }, (_, i) => {
                    const page = reviewPage <= 2 ? i + 1 : reviewPage - 1 + i;
                    if (page > totalReviewPages) return null;
                    return (
                      <button
                        key={page}
                        onClick={() => setReviewPage(page)}
                        className={`px-3 py-2 rounded-lg text-sm ${
                          reviewPage === page
                            ? 'bg-purple-600 text-white'
                            : 'border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  {totalReviewPages > 3 && reviewPage < totalReviewPages - 1 && (
                    <>
                      <span className="px-2 text-gray-500">...</span>
                      <button
                        onClick={() => setReviewPage(totalReviewPages)}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
                      >
                        {totalReviewPages}
                      </button>
                    </>
                  )}
                </div>
                <button
                  onClick={() => setReviewPage(Math.min(totalReviewPages, reviewPage + 1))}
                  disabled={reviewPage === totalReviewPages}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
