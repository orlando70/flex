import { useQuery } from '@tanstack/react-query';

export function useListing(listingId: string) {
  return useQuery({
    queryKey: ['listing', listingId],
    queryFn: async () => {
      const res = await fetch(`/api/listings/${listingId}`);
      if (!res.ok) throw new Error('Failed to fetch listing');
      return res.json();
    },
    enabled: !!listingId,
  });
}

export function useListings() {
  return useQuery({
    queryKey: ['listings'],
    queryFn: async () => {
      const res = await fetch('/api/listings');
      if (!res.ok) throw new Error('Failed to fetch listings');
      return res.json();
    },
  });
}