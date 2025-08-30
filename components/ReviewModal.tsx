import { Search, Star, Eye, EyeOff, MessageSquare } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { usePatchReview } from '@/lib/hooks/reviews';

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
  const patchReviewMutation = usePatchReview();

  if (!selectedProperty) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Reviews for {listingsData.result.find((p: any) => p.id === selectedProperty)?.name}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {propertyReviews.length} total reviews
            </p>
          </div>
          <button
            onClick={() => setSelectedProperty(null)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Search reviews by guest name or comment..."
              value={reviewSearch}
              onChange={(e) => setReviewSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-4">
            {paginatedReviews.map((review: any) => (
              <div key={review.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium text-gray-900">{review.guest}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{review.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{review.comment}</p>
                    {review.reviewCategory && review.reviewCategory.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {review.reviewCategory.map((cat: any, idx: number) => (
                          <div key={idx} className="bg-white px-2 py-1 rounded text-xs border">
                            <span className="text-gray-600 capitalize">{cat.category.replace('_', ' ')}: </span>
                            <span className="font-medium">{cat.rating}/10</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => patchReviewMutation.mutate({ hostaway_review_id: review.id, is_hidden: !review.is_hidden })}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        !review.is_hidden 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      disabled={patchReviewMutation.isPending}
                    >
                      {!review.is_hidden ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {!review.is_hidden ? 'Published' : 'Hidden'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {paginatedReviews.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No reviews found.</p>
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
