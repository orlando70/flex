import { Filter } from 'lucide-react';

interface FiltersProps {
  filter: any;
  setFilter: (f: any) => void;
  clearFilters: () => void;
}

export default function Filters({ filter, setFilter, clearFilters }: FiltersProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Advanced Filters</span>
        </div>
        <button
          onClick={clearFilters}
          className="text-sm text-purple-600 hover:text-purple-700 font-medium"
        >
          Clear all
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <select 
          className="px-2 py-1 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={filter.rating} 
          onChange={e => setFilter((f: any) => ({ ...f, rating: e.target.value }))}
        >
          <option value="">Min Rating</option>
          <option value="8">8+</option>
          <option value="9">9+</option>
          <option value="10">10</option>
        </select>
        <select 
          className="px-2 py-1 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={filter.category} 
          onChange={e => setFilter((f: any) => ({ ...f, category: e.target.value }))}
        >
          <option value="">Category</option>
          <option value="cleanliness">Cleanliness</option>
          <option value="communication">Communication</option>
          <option value="check_in">Check-in</option>
          <option value="accuracy">Accuracy</option>
          <option value="location">Location</option>
          <option value="value">Value</option>
          <option value="respect_house_rules">Respect House Rules</option>
        </select>
        <select 
          className="px-2 py-1 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={filter.channel} 
          onChange={e => setFilter((f: any) => ({ ...f, channel: e.target.value }))}
        >
          <option value="">Channel</option>
          <option value="Airbnb">Airbnb</option>
          <option value="Booking.com">Booking.com</option>
          <option value="VRBO">VRBO</option>
          <option value="Expedia">Expedia</option>
          <option value="Direct">Direct</option>
          <option value="TripAdvisor">TripAdvisor</option>
        </select>
        <select 
          className="px-2 py-1 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={filter.time} 
          onChange={e => setFilter((f: any) => ({ ...f, time: e.target.value }))}
        >
          <option value="">Time Period</option>
          <option value="last_week">Last Week</option>
          <option value="last_month">Last Month</option>
          <option value="last_3_months">Last 3 Months</option>
          <option value="last_6_months">Last 6 Months</option>
          <option value="last_year">Last Year</option>
        </select>
      </div>
    </div>
  );
}
