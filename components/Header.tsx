import { Search } from 'lucide-react';

interface HeaderProps {
  activeView: string;
  globalSearch: string;
  setGlobalSearch: (val: string) => void;
}

export default function Header({ activeView, globalSearch, setGlobalSearch }: HeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-4 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Property Management</span>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-medium text-gray-900 capitalize">{activeView}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
