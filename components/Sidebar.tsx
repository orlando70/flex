import { Building, TrendingUp, MessageSquare } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (id: string) => void;
  stats: { totalProperties: number; totalReviews: number; avgRating: string };
}

const sidebarItems = [
  { id: 'overview', label: 'Overview', icon: Building },
  { id: 'reviews', label: 'Review Management', icon: MessageSquare },
];

export default function Sidebar({ activeView, setActiveView, stats }: SidebarProps) {
  return (
    <div className="w-64 h-screen bg-white shadow-sm border-r border-gray-200 flex-shrink-0 flex flex-col fixed top-0 left-0 z-30">
      <div className="p-6">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mb-8"></div>
      </div>
      <nav className="px-4 flex-1">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Navigation</p>
          <ul className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveView(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      activeView === item.id
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </div>
  );
}
