import { Grid, List, ArrowUpDown } from 'lucide-react';

interface ToolbarProps {
  viewMode: 'grid' | 'table';
  setViewMode: (mode: 'grid' | 'table') => void;
  sortBy: string;
  sortOrder: string;
  handleSort: (field: string) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  filteredLength: number;
}

export default function Toolbar({ viewMode, setViewMode, sortBy, sortOrder, handleSort, pageSize, setPageSize, currentPage, setCurrentPage, filteredLength }: ToolbarProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-md transition-colors ${viewMode === 'table' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <button
            onClick={() => handleSort('name')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              sortBy === 'name' ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Name
            <ArrowUpDown className="w-3 h-3" />
          </button>
          <button
            onClick={() => handleSort('rating')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              sortBy === 'rating' ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Rating
            <ArrowUpDown className="w-3 h-3" />
          </button>
          <button
            onClick={() => handleSort('reviews')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              sortBy === 'reviews' ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Reviews
            <ArrowUpDown className="w-3 h-3" />
          </button>
          <button
            onClick={() => handleSort('price')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              sortBy === 'price' ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Price
            <ArrowUpDown className="w-3 h-3" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value={12}>12 per page</option>
          <option value={24}>24 per page</option>
          <option value={48}>48 per page</option>
          <option value={96}>96 per page</option>
        </select>
        <span className="text-sm text-gray-600">
          {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, filteredLength)} of {filteredLength}
        </span>
      </div>
    </div>
  );
}
