import { useAnalytics } from '../hooks/useAnalytics';
import { useDarkMode } from '../hooks/useDarkMode';
import Navbar from '../components/Navbar';
import { CardSkeleton } from '../components/SkeletonLoader';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

const Analytics = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { analytics, loading, error } = useAnalytics();

  const totalExperienceCount = analytics?.experienceDistribution?.reduce((sum, item) => sum + item.count, 0) || 0;
  const getExperiencePercent = (count) => {
    return totalExperienceCount ? ((count / totalExperienceCount) * 100).toFixed(0) : '0';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center text-red-500 dark:text-red-400">{error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
      
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Insights into your talent pool
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-slide-up">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Total Candidates</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.totalCandidates}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Top Skill</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {analytics.skillDistribution[0]?.skill || 'N/A'}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Top Location</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {analytics.locationDistribution[0]?.location?.toString().trim() || 'N/A'}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Avg Experience</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {analytics.experienceDistribution?.reduce((acc, curr) => {
                const avg = curr.range.match(/\d+/)?.[0] || 0;
                return acc + (parseInt(avg) * curr.count);
              }, 0) / (analytics.totalCandidates || 1)} years
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Skill Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-slide-up">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Top Skills</h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={analytics.skillDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#E5E7EB'} />
                <XAxis 
                  type="number"
                  tick={{ fill: isDarkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }}
                />
                <YAxis 
                  type="category"
                  dataKey="skill" 
                  tick={{ fill: isDarkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }}
                  width={120}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Experience Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Experience Distribution</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.experienceDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="count"
                      paddingAngle={3}
                    >
                      {analytics.experienceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2">
                {analytics.experienceDistribution.map((entry, index) => (
                  <div key={entry.range} className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                    <div className="flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span>{entry.range}</span>
                    </div>
                    <span>{getExperiencePercent(entry.count)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Location Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 animate-slide-up">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Top Locations</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.locationDistribution} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#E5E7EB'} />
              <XAxis type="number" tick={{ fill: isDarkMode ? '#9CA3AF' : '#6B7280' }} />
              <YAxis 
                type="category" 
                dataKey="location" 
                tick={{ fill: isDarkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }}
                width={100}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Upload Trends */}
        {analytics.uploadTrends.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-slide-up">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Upload Trends (Last 30 Days)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.uploadTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#E5E7EB'} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: isDarkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }}
                />
                <YAxis tick={{ fill: isDarkMode ? '#9CA3AF' : '#6B7280' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8B5CF6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </main>
    </div>
  );
};

export default Analytics;
