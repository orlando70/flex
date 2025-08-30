import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell, RadialBarChart, RadialBar, AreaChart, Area, ComposedChart, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Star, Users, Calendar, Filter, Download, RefreshCw, Eye, EyeOff, AlertTriangle, Award, Target, Activity, ChevronDown, Info, MessageSquare } from 'lucide-react';

// Enhanced Types
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

interface Property {
  id: number;
  name: string;
  city: string;
  roomType: string;
  price: number;
}

// Advanced Mock Data Generator
const generateAdvancedMockData = () => {
  const cities = ['London', 'Manchester', 'Birmingham', 'Glasgow', 'Liverpool', 'Edinburgh', 'Brighton', 'Bristol'];
  const categories = ['cleanliness', 'communication', 'location', 'value', 'checkin', 'accuracy'];
  
  const properties: Property[] = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Property ${i + 1}`,
    city: cities[Math.floor(Math.random() * cities.length)],
    roomType: ['entire_home', 'private_room'][Math.floor(Math.random() * 2)],
    price: Math.floor(Math.random() * 200) + 50
  }));

  const reviews: Review[] = [];
  properties.forEach(property => {
    const numReviews = Math.floor(Math.random() * 20) + 5;
    for (let i = 0; i < numReviews; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 365));
      reviews.push({
        id: reviews.length + 1,
        property: property.name,
        guest: `Guest ${reviews.length + 1}`,
        comment: 'Sample review text',
        date: date.toISOString(),
        rating: Math.floor(Math.random() * 3) + 8,
        is_hidden: Math.random() > 0.2,
        reviewCategory: categories.slice(0, 3 + Math.floor(Math.random() * 3)).map(cat => ({
          category: cat,
          rating: Math.floor(Math.random() * 3) + 8
        })),
        channel: 'Airbnb',
        hasCategories: true,
        categoryCount: 3
      });
    }
  });

  return { reviews, properties };
};

const { reviews: mockReviews, properties: mockProperties } = generateAdvancedMockData();

// Advanced Analytics Functions
const getTimeSeriesData = (reviews: Review[], period: 'week' | 'month' | 'quarter' = 'month') => {
  const periods: { [key: string]: { count: number; totalRating: number; revenue: number } } = {};
  
  reviews.forEach(review => {
    const date = new Date(review.date);
    let key: string;
    
    switch (period) {
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
        break;
      case 'quarter':
        key = `${date.getFullYear()}-Q${Math.floor(date.getMonth() / 3) + 1}`;
        break;
      default:
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }
    
    if (!periods[key]) {
      periods[key] = { count: 0, totalRating: 0, revenue: 0 };
    }
    
    periods[key].count++;
    periods[key].totalRating += review.rating;
    periods[key].revenue += Math.floor(Math.random() * 500) + 100; // Mock revenue
  });
  
  return Object.entries(periods)
    .map(([period, data]) => ({
      period,
      avgRating: +(data.totalRating / data.count).toFixed(1),
      reviewCount: data.count,
      revenue: data.revenue,
      satisfactionRate: ((data.totalRating / data.count / 10) * 100).toFixed(1)
    }))
    .sort((a, b) => a.period.localeCompare(b.period));
};

const getCategoryInsights = (reviews: Review[]) => {
  const categoryData: { [key: string]: { total: number; ratings: number[]; } } = {};
  
  reviews.forEach(review => {
    review.reviewCategory?.forEach(cat => {
      if (!categoryData[cat.category]) {
        categoryData[cat.category] = { 
          total: 0, 
          ratings: [], 
        };
      }
      categoryData[cat.category].total++;
      categoryData[cat.category].ratings.push(cat.rating);
    });
  });
  
  return Object.entries(categoryData).map(([category, data]) => ({
    category: category.replace('_', ' '),
    avgRating: +(data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length).toFixed(1),
    count: data.total,
    satisfactionRate: +((data.ratings.filter(r => r >= 8).length / data.ratings.length) * 100).toFixed(1),
    trend: Math.random() > 0.5 ? 'up' : 'down',
    improvement: +(Math.random() * 20 - 10).toFixed(1) // Mock improvement percentage
  })).sort((a, b) => b.avgRating - a.avgRating);
};

const getPerformanceMetrics = (reviews: Review[]) => {
  const total = reviews.length;
  const avgRating = +(reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1);
  const approvalRate = +((reviews.filter(r => r.is_hidden).length / total) * 100).toFixed(1);
  
  return {
    totalReviews: total,
    avgRating,
    approvalRate,
    satisfactionRate: +((reviews.filter(r => r.rating >= 8).length / total) * 100).toFixed(1),
    monthlyGrowth: +(Math.random() * 30 - 5).toFixed(1), // Mock growth
    repeatGuestRate: +(Math.random() * 40 + 20).toFixed(1) // Mock repeat rate
  };
};

// Modern Color Palettes (subtle, less saturated)
const COLORS = {
  primary: ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'], // subtle indigo
  success: ['#22c55e', '#4ade80', '#bbf7d0', '#dcfce7'], // subtle green
  warning: ['#eab308', '#fde047', '#fef9c3', '#fefce8'], // subtle yellow
  danger: ['#ef4444', '#fca5a5', '#fee2e2', '#fef2f2'], // subtle red
  gradient: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)', // gray gradient
  glassmorphism: 'rgba(255,255,255,0.85)'
};

// Custom Components
const MetricCard = ({ title, value, change, icon: Icon, trend, subtitle }: any) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow hover:shadow-md transition-all duration-300">
    <div className="flex items-start justify-between mb-4">
      <div className="p-3 rounded-xl bg-gray-100">
        <Icon className="w-6 h-6 text-gray-700" />
      </div>
      {change && (
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
          trend === 'up' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.abs(change)}%
        </div>
      )}
    </div>
    <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
    {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
  </div>
);

const GlassCard = ({ children, className = '' }: any) => (
  <div className={`bg-white rounded-2xl border border-gray-200 shadow ${className}`}>{children}</div>
);

export default function ModernAnalyticsView({ reviews = mockReviews }: { reviews?: Review[] }) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview');
  const [showInsights, setShowInsights] = useState(true);

  const timeSeriesData = useMemo(() => getTimeSeriesData(reviews, timeRange), [reviews, timeRange]);
  const categoryInsights = useMemo(() => getCategoryInsights(reviews), [reviews]);
  const performanceMetrics = useMemo(() => getPerformanceMetrics(reviews), [reviews]);

  const categoryRadialData = categoryInsights.slice(0, 6).map((cat, index) => ({
    ...cat,
    fill: COLORS.primary[index % COLORS.primary.length]
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Analytics
            </h1>
            <p className="text-gray-600 mt-2">Real-time insights and performance metrics</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 border border-gray-200">
              <Calendar className="w-4 h-4 text-gray-500" />
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="bg-transparent text-sm font-medium focus:outline-none"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
            </div>
            
            <button className="p-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-100 transition-all">
              <RefreshCw className="w-4 h-4 text-gray-600" />
            </button>
            
            <button className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Total Reviews"
          value={performanceMetrics.totalReviews.toLocaleString()}
          change={performanceMetrics.monthlyGrowth}
          trend={performanceMetrics.monthlyGrowth > 0 ? 'up' : 'down'}
          icon={MessageSquare}
          subtitle="This period"
        />
        <MetricCard
          title="Average Rating"
          value={performanceMetrics.avgRating}
          change={5.2}
          trend="up"
          icon={Star}
          subtitle={`${performanceMetrics.satisfactionRate}% satisfaction`}
        />
        <MetricCard
          title="Approval Rate"
          value={`${performanceMetrics.approvalRate}%`}
          change={8.1}
          trend="up"
          icon={Award}
          subtitle="Published reviews"
        />
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        {/* Rating Trends Over Time */}
        <GlassCard className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Rating Trends & Revenue</h3>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-gray-600">Rating</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                <span className="text-gray-600">Revenue</span>
              </div>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={timeSeriesData}>
              <defs>
                <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
              <XAxis dataKey="period" stroke="#64748b" fontSize={12} />
              <YAxis yAxisId="left" stroke="#64748b" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: 'none',
                  borderRadius: '16px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="avgRating"
                stroke="#8b5cf6"
                strokeWidth={3}
                fill="url(#ratingGradient)"
              />
              <Bar yAxisId="right" dataKey="revenue" fill="#ec4899" radius={[4, 4, 0, 0]} opacity={0.7} />
            </ComposedChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Category Performance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Category Satisfaction Radar */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Category Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="80%" data={categoryRadialData}>
              <RadialBar
                label={{ position: 'insideStart', fill: '#fff', fontSize: 12 }}
                background
                dataKey="satisfactionRate"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: 'none',
                  borderRadius: '12px'
                }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Detailed Category Insights */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Category Insights</h3>
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {categoryInsights.map((category, index) => (
              <div
                key={category.category}
                className="p-4 rounded-xl bg-gradient-to-r from-white to-gray-50 border border-gray-200 hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSelectedCategory(selectedCategory === category.category ? null : category.category)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{category.avgRating}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 capitalize">{category.category}</h4>
                      <p className="text-sm text-gray-600">{category.count} reviews</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      category.trend === 'up' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {category.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {Math.abs(category.improvement)}%
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Satisfaction: {category.satisfactionRate}%</span>
                </div>
                
                {selectedCategory === category.category && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="p-2 bg-white rounded-lg">
                        <div className="font-medium text-gray-700">Performance</div>
                        <div className="text-gray-600">Above average</div>
                      </div>
                      <div className="p-2 bg-white rounded-lg">
                        <div className="font-medium text-gray-700">Recommendation</div>
                        <div className="text-gray-600">Maintain quality</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* AI Insights Panel */}
      {showInsights && (
        <GlassCard className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">AI-Powered Insights</h3>
            </div>
            <button
              onClick={() => setShowInsights(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <EyeOff className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">Key Strength</span>
              </div>
              <p className="text-sm text-green-800">Communication scores are consistently high across all properties. Keep up the great work!</p>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-700">Attention Needed</span>
              </div>
              <p className="text-sm text-amber-800">Cleanliness ratings have declined by 8% this month. Consider reviewing cleaning protocols.</p>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Growth Opportunity</span>
              </div>
              <p className="text-sm text-blue-800">Properties in Edinburgh show 23% higher satisfaction rates. Consider expanding there.</p>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}