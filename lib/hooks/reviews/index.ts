import { useQuery } from '@tanstack/react-query';
import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';

export interface NormalizedReview {
  id: number;
  type?: string;
  status?: string;
  rating: number;
  privateFeedback?: string | null;
  reviewCategory?: { category: string; rating: number }[];
  property: string;
  guest: string;
  comment: string;
  channel?: string;
  date: string;
  is_hidden?: boolean;
  hasCategories?: boolean;
  categoryCount?: number;
}

export function useReviews() {
  return useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      const res = await fetch('/api/reviews');
      if (!res.ok) throw new Error('Failed to fetch reviews');
      return res.json();
    },
  });
};

export function useAllReviews() {
  return useQuery({
    queryKey: ['reviews', 'all'],
    queryFn: async () => {
      const res = await fetch('/api/reviews?includeHidden=true');
      if (!res.ok) throw new Error('Failed to fetch all reviews');
      return res.json();
    },
  });
};

interface PatchReviewArgs {
  hostaway_review_id: number;
  is_hidden: boolean;
}

export function usePatchReview(options?: UseMutationOptions<any, Error, PatchReviewArgs, any>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ hostaway_review_id, is_hidden }: PatchReviewArgs) => {
      const res = await fetch('/api/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ review: { hostaway_review_id, is_hidden } })
      });
      if (!res.ok) throw new Error('Failed to update review status');
      return res.json();
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', 'all'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      options?.onError?.(error, variables, context);
    },
    onMutate: (variables) => {
      return options?.onMutate?.(variables);
    },
    ...options,
  });
}