'use client';

import { useState, useMemo, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StatsCards from '../components/StatsCards';
import Filters from '../components/Filters';
import Toolbar from '../components/Toolbar';
import PropertiesGrid from '../components/PropertiesGrid';
import PropertiesTable from '../components/PropertiesTable';
import Pagination from '../components/Pagination';
import ReviewModal from '../components/ReviewModal';
import AnalyticsView from '../components/AnalyticsView';
import ReviewsView from '../components/ReviewsView';
import { useListings } from '../lib/hooks/listings';
import { useAllReviews } from '../lib/hooks/reviews';



// Types
interface ReviewCategory {
  category: string;
  rating: number;
}
interface Review {
  id: number;
  type?: string;
  status?: string;
  rating: number;
  privateFeedback?: string | null;
  reviewCategory?: ReviewCategory[];
  property: string;
  guest: string;
  comment: string;
  channel?: string;
  date: string;
  is_hidden?: boolean;
  hasCategories?: boolean;
  categoryCount?: number;
}

export default function ScalableDashboard() {
  // Fetch listings from API
  const { data: listingsData, isLoading: listingsLoading, error: listingsError } = useListings();
  // Fetch reviews from API
  const { data: reviewsData, isLoading: reviewsLoading, error: reviewsError } = useAllReviews();

  // Use API reviews everywhere
  const allReviews = reviewsData?.result || [];

  // UI State
  const [activeView, setActiveView] = useState('overview');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(24);
  const [globalSearch, setGlobalSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'reviews' | 'price'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Filter State
  const [filter, setFilter] = useState({
    rating: '',
    category: '',
    channel: '',
    time: '',
    city: '',
    roomType: '',
    priceMin: '',
    priceMax: ''
  });

  // Review Management
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  const [reviewSearch, setReviewSearch] = useState('');
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewPageSize] = useState(50);

  // Helper functions
  const getReviewCount = (propertyId: number, propertyName?: string) => {
    try {
      // Use propertyName if provided, else fallback to id
      if (propertyName) {
        return allReviews.filter((r: any) => r.property === propertyName).length || 0;
      }
      // fallback for legacy usage - find property by id in listings data
      const propertyObj = listingsData?.result?.find((p: any) => p.id === propertyId);
      if (!propertyObj) return 0;
      return allReviews.filter((r: any) => r.property === propertyObj.name).length || 0;
    } catch (error) {
      console.error('Error getting review count:', error);
      return 0;
    }
  };

  const getAverageRating = (propertyId: number, propertyName?: string) => {
    try {
      if (propertyName) {
        const reviews = allReviews.filter((r: any) => r.property === propertyName) || [];
        if (reviews.length === 0) return null;
        const ratings = reviews.map((r: any) => r.rating).filter(Boolean);
        if (ratings.length === 0) return null;
        return (ratings.reduce((a: any, b: any) => a + b, 0) / ratings.length).toFixed(1);
      }
      // fallback for legacy usage - find property by id in listings data
      const propertyObj = listingsData?.result?.find((p: any) => p.id === propertyId);
      if (!propertyObj) return null;
      const reviews = allReviews.filter((r: any) => r.property === propertyObj.name) || [];
      if (reviews.length === 0) return null;
      const ratings = reviews.map((r: any) => r.rating).filter(Boolean);
      if (ratings.length === 0) return null;
      return (ratings.reduce((a: any, b: any) => a + b, 0) / ratings.length).toFixed(1);
    } catch (error) {
      console.error('Error getting average rating:', error);
      return null;
    }
  };

  // Filtered and sorted data with pagination
  const filteredAndSortedProperties = useMemo(() => {
    let filtered = listingsData?.result || [];

    // Global search
    if (globalSearch) {
      filtered = filtered.filter((property: any) =>
        property.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
        property.city.toLowerCase().includes(globalSearch.toLowerCase())
      );
    }

    // Apply filters
    if (filter.rating) {
      filtered = filtered.filter((property: any) => {
        const avg = getAverageRating(property.id, property.name);
        return avg && Number(avg) >= Number(filter.rating);
      });
    }
    
    // Category filter - filter by review categories
    if (filter.category) {
      filtered = filtered.filter((property: any) => {
        const propertyReviews = allReviews.filter((r: any) => r.property === property.name);
        return propertyReviews.some((review: any) => 
          review.reviewCategory?.some((cat: any) => cat.category === filter.category)
        );
      });
    }
    
    // Channel filter - filter by review channels
    if (filter.channel) {
      filtered = filtered.filter((property: any) => {
        const propertyReviews = allReviews.filter((r: any) => r.property === property.name);
        return propertyReviews.some((review: any) => review.channel === filter.channel);
      });
    }
    
    // Time filter - filter by review dates
    if (filter.time) {
      filtered = filtered.filter((property: any) => {
        const propertyReviews = allReviews.filter((r: any) => r.property === property.name);
        const now = new Date();
        let cutoffDate = new Date();
        
        switch (filter.time) {
          case 'last_week':
            cutoffDate.setDate(now.getDate() - 7);
            break;
          case 'last_month':
            cutoffDate.setMonth(now.getMonth() - 1);
            break;
          case 'last_3_months':
            cutoffDate.setMonth(now.getMonth() - 3);
            break;
          case 'last_6_months':
            cutoffDate.setMonth(now.getMonth() - 6);
            break;
          case 'last_year':
            cutoffDate.setFullYear(now.getFullYear() - 1);
            break;
        }
        
        return propertyReviews.some((review: any) => {
          const reviewDate = new Date(review.date);
          return reviewDate >= cutoffDate;
        });
      });
    }
    
    if (filter.city) {
      filtered = filtered.filter((property: any) => 
        property.city.toLowerCase().includes(filter.city.toLowerCase())
      );
    }
    
    if (filter.roomType) {
      filtered = filtered.filter((property: any) => property.roomType === filter.roomType);
    }
    
    if (filter.priceMin) {
      filtered = filtered.filter((property: any) => property.price >= Number(filter.priceMin));
    }
    
    if (filter.priceMax) {
      filtered = filtered.filter((property: any) => property.price <= Number(filter.priceMax));
    }

    // Sorting
    filtered.sort((a: any, b: any) => {
      let aVal, bVal;
      
      switch (sortBy) {
        case 'rating':
          aVal = Number(getAverageRating(a.id, a.name)) || 0;
          bVal = Number(getAverageRating(b.id, b.name)) || 0;
          break;
        case 'reviews':
          aVal = getReviewCount(a.id, a.name);
          bVal = getReviewCount(b.id, b.name);
          break;
        case 'price':
          aVal = a.price || 0;
          bVal = b.price || 0;
          break;
        default:
          aVal = a.name?.toLowerCase() || '';
          bVal = b.name?.toLowerCase() || '';
      }
      
      // Debug logging for sorting issues
      if (process.env.NODE_ENV === 'development') {
        console.log(`Sorting ${sortBy}: ${a.name} (${aVal}) vs ${b.name} (${bVal})`);
      }
      
      if (sortOrder === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });

    return filtered;
  }, [listingsData?.result, globalSearch, filter, sortBy, sortOrder, allReviews]);

  // Paginated properties
  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedProperties.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedProperties, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredAndSortedProperties.length / pageSize);

  // Property reviews with pagination
  const propertyReviews = useMemo(() => {
    if (!selectedProperty) return [];
    const selectedPropertyObj = filteredAndSortedProperties.find((p: any) => p.id === selectedProperty);
    if (!selectedPropertyObj) return [];
    let reviews = allReviews.filter((r: any) => r.property === selectedPropertyObj.name) || [];
    if (reviewSearch) {
      reviews = reviews.filter((r: any) =>
        r.guest.toLowerCase().includes(reviewSearch.toLowerCase()) ||
        r.comment.toLowerCase().includes(reviewSearch.toLowerCase())
      );
    }
    return reviews.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [selectedProperty, allReviews, reviewSearch, filteredAndSortedProperties]);

  const paginatedReviews = useMemo(() => {
    const startIndex = (reviewPage - 1) * reviewPageSize;
    return propertyReviews.slice(startIndex, startIndex + reviewPageSize);
  }, [propertyReviews, reviewPage, reviewPageSize]);

  const totalReviewPages = Math.ceil(propertyReviews.length / reviewPageSize);

  // Stats calculations
  const stats = useMemo(() => {
    const totalRevenue = filteredAndSortedProperties.reduce((sum: number, prop: any) => sum + (prop.price * getReviewCount(prop.id, prop.name)), 0);
    const totalReviews = filteredAndSortedProperties.reduce((sum: number, prop: any) => sum + getReviewCount(prop.id, prop.name), 0);
    const ratingsSum = filteredAndSortedProperties.reduce((sum: number, prop: any) => {
      const rating = getAverageRating(prop.id, prop.name);
      return sum + (rating ? Number(rating) : 0);
    }, 0);
    const avgRating = filteredAndSortedProperties.length > 0 ? (ratingsSum / filteredAndSortedProperties.length).toFixed(1) : '0';
    
    return {
      totalRevenue,
      totalProperties: filteredAndSortedProperties.length,
      totalReviews,
      avgRating
    };
  }, [filteredAndSortedProperties, allReviews]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, globalSearch, sortBy, sortOrder]);

  // Reset review page when property changes
  useEffect(() => {
    setReviewPage(1);
  }, [selectedProperty]);

  const handleSort = (field: 'name' | 'rating' | 'reviews' | 'price') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const clearFilters = () => {
    setFilter({
      rating: '',
      category: '',
      channel: '',
      time: '',
      city: '',
      roomType: '',
      priceMin: '',
      priceMax: ''
    });
    setGlobalSearch('');
    setCurrentPage(1);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activeView={activeView} setActiveView={setActiveView} stats={stats} />
      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col ml-64">
        {/* Header */}
        <Header activeView={activeView} globalSearch={globalSearch} setGlobalSearch={setGlobalSearch} />
        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Revenue Header */}
            
            {activeView === 'reviews' && (
              <>
                <Filters filter={filter} setFilter={setFilter} clearFilters={clearFilters} />
                <Toolbar
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                  pageSize={pageSize}
                  setPageSize={setPageSize}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  filteredLength={filteredAndSortedProperties.length}
                />
                {listingsLoading && (
                  <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                  </div>
                )}
                {listingsError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                    <p className="text-red-800">Error fetching data. Check the console for details.</p>
                  </div>
                )}
                {viewMode === 'grid' ? (
                  <PropertiesGrid
                    properties={paginatedProperties}
                    getAverageRating={getAverageRating}
                    getReviewCount={getReviewCount}
                    selectedProperty={selectedProperty}
                    setSelectedProperty={setSelectedProperty}
                  />
                ) : (
                  <PropertiesTable
                    properties={paginatedProperties}
                    getAverageRating={getAverageRating}
                    getReviewCount={getReviewCount}
                    selectedProperty={selectedProperty}
                    setSelectedProperty={setSelectedProperty}
                  />
                )}
                <Pagination
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  filteredLength={filteredAndSortedProperties.length}
                />
                <ReviewModal
                  selectedProperty={selectedProperty}
                  setSelectedProperty={setSelectedProperty}
                  listingsData={listingsData}
                  propertyReviews={propertyReviews}
                  paginatedReviews={paginatedReviews}
                  reviewSearch={reviewSearch}
                  setReviewSearch={setReviewSearch}
                  reviewPage={reviewPage}
                  setReviewPage={setReviewPage}
                  totalReviewPages={totalReviewPages}
                  reviewPageSize={reviewPageSize}
                />
              </>
            )}
            {activeView === 'overview' && (
              <>
                <Filters filter={filter} setFilter={setFilter} clearFilters={clearFilters} />
                <AnalyticsView reviews={allReviews.length > 0 ? allReviews : undefined} isLoading={reviewsLoading} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
