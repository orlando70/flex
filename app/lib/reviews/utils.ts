// Channel mapping based on the provided channel IDs
export const channelMap: { [key: number]: string } = {
  2018: "Airbnb",
  2002: "HomeAway", 
  2005: "Booking.com",
  2007: "Expedia",
  2009: "HomeAway iCal",
  2010: "VRBO iCal",
  2000: "Direct",
  2013: "Booking Engine",
  2015: "Custom iCal",
  2016: "TripAdvisor iCal", 
  2017: "WordPress",
  2019: "Marriott",
  2020: "Partner",
  2021: "GDS",
  2022: "Google"
};

export function getChannelName(channelId: number): string {
  return channelMap[channelId] || "Unknown Channel";
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

export function calculateOverallRating(reviewCategories: { category: string; rating: number }[]): number | null {
  if (!reviewCategories || reviewCategories.length === 0) {
    return null;
  }
  const totalRating = reviewCategories.reduce((sum, cat) => sum + cat.rating, 0);
  const averageRating = totalRating / reviewCategories.length;
  return Math.round((averageRating / 10) * 5 * 10) / 10;
}

export function normalizeReview(review: any, visibilityState: any = null, channelId?: number): any {
  return {
    id: review.id,
    type: review.type,
    status: review.status,
    rating: review.rating || calculateOverallRating(review.reviewCategory),
    privateFeedback: review.privateFeedback || null,
    reviewCategory: review.reviewCategory || [],
    property: review.listingName,
    guest: review.guestName,
    comment: review.publicReview,
    channel: channelId ? getChannelName(channelId) : "Direct",
    date: formatDate(review.submittedAt),
    is_hidden: visibilityState?.is_hidden || false,
}}


