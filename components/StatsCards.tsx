import { Building, MessageSquare, Star } from 'lucide-react';

interface StatsCardsProps {
  stats: { totalProperties: number; totalReviews: number; avgRating: string; totalRevenue: number };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Properties</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <Building className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <p className="text-sm text-green-600">Showing filtered results</p>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Reviews</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalReviews}</p>
          </div>
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-orange-600" />
          </div>
        </div>
        <p className="text-sm text-blue-600">Across all properties</p>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
            <p className="text-2xl font-bold text-gray-900">{stats.avgRating}</p>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
            <Star className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <p className="text-sm text-green-600">Overall performance</p>
      </div>
    </div>
  );
}
