import { Grid, List } from 'lucide-react';

interface ToolbarProps {
  viewMode: 'grid' | 'table';
  setViewMode: (mode: 'grid' | 'table') => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  filteredLength: number;
}

export default function Toolbar({ viewMode, setViewMode, pageSize, setPageSize, currentPage, setCurrentPage, filteredLength }: ToolbarProps) {
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
