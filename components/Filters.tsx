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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
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
        <input
          placeholder="City"
          className="px-2 py-1 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={filter.city}
          onChange={e => setFilter((f: any) => ({ ...f, city: e.target.value }))}
        />
        <select 
          className="px-2 py-1 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={filter.roomType} 
          onChange={e => setFilter((f: any) => ({ ...f, roomType: e.target.value }))}
        >
          <option value="">Room Type</option>
          <option value="entire_home">Entire Home</option>
          <option value="private_room">Private Room</option>
          <option value="shared_room">Shared Room</option>
        </select>
        <input
          placeholder="Min £"
          type="number"
          className="px-2 py-1 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={filter.priceMin}
          onChange={e => setFilter((f: any) => ({ ...f, priceMin: e.target.value }))}
        />
        <input
          placeholder="Max £"
          type="number"
          className="px-2 py-1 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={filter.priceMax}
          onChange={e => setFilter((f: any) => ({ ...f, priceMax: e.target.value }))}
        />
      </div>
    </div>
  );
}
