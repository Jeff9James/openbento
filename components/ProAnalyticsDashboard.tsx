import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  TrendingUp,
  Users,
  MousePointerClick,
  Globe,
  Clock,
  Smartphone,
  Monitor,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from 'lucide-react';
import { useProFeatures } from '../hooks/useProFeatures';
import { ProGuard } from './ProGuard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  clicks: number;
  avgSessionDuration: number;
  bounceRate: number;
  viewsOverTime: { date: string; views: number }[];
  topPages: { path: string; views: number }[];
  topReferrers: { source: string; count: number }[];
  deviceBreakdown: { device: string; percentage: number }[];
  geoData: { country: string; city: string; count: number }[];
  hourlyDistribution: { hour: number; views: number }[];
}

interface ProAnalyticsDashboardProps {
  data: AnalyticsData;
  dateRange: number;
  onDateRangeChange: (days: number) => void;
  isLoading?: boolean;
  onUpgradeClick?: () => void;
}

const dateRangeOptions = [
  { value: 7, label: '7 Days' },
  { value: 30, label: '30 Days' },
  { value: 90, label: '90 Days' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    },
  }),
};

export const ProAnalyticsDashboard: React.FC<ProAnalyticsDashboardProps> = ({
  data,
  dateRange,
  onDateRangeChange,
  isLoading = false,
  onUpgradeClick,
}) => {
  const { canUseAdvancedAnalytics } = useProFeatures();

  const lineChartData = useMemo(() => {
    return {
      labels: data.viewsOverTime.map((d) =>
        new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      ),
      datasets: [
        {
          label: 'Page Views',
          data: data.viewsOverTime.map((d) => d.views),
          borderColor: 'rgb(139, 92, 246)',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [data.viewsOverTime]);

  const deviceChartData = useMemo(() => {
    return {
      labels: data.deviceBreakdown.map((d) => d.device),
      datasets: [
        {
          data: data.deviceBreakdown.map((d) => d.percentage),
          backgroundColor: [
            'rgba(139, 92, 246, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
          ],
          borderWidth: 0,
        },
      ],
    };
  }, [data.deviceBreakdown]);

  const referrerChartData = useMemo(() => {
    return {
      labels: data.topReferrers.slice(0, 5).map((r) => r.source),
      datasets: [
        {
          label: 'Referrals',
          data: data.topReferrers.slice(0, 5).map((r) => r.count),
          backgroundColor: 'rgba(139, 92, 246, 0.8)',
          borderRadius: 6,
        },
      ],
    };
  }, [data.topReferrers]);

  const hourlyChartData = useMemo(() => {
    return {
      labels: data.hourlyDistribution.map((h) => `${h.hour}:00`),
      datasets: [
        {
          label: 'Activity',
          data: data.hourlyDistribution.map((h) => h.views),
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderRadius: 4,
        },
      ],
    };
  }, [data.hourlyDistribution]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        padding: 12,
        cornerRadius: 8,
        titleFont: { size: 13 },
        bodyFont: { size: 13 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: { size: 11 },
          color: '#6B7280',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: { size: 11 },
          color: '#6B7280',
        },
      },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        display: false,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <ProGuard
      feature="canUseAdvancedAnalytics"
      onUpgradeClick={onUpgradeClick}
      showUpgradePrompt={!canUseAdvancedAnalytics}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
            <p className="text-sm text-gray-500">Track your page performance and visitor insights</p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div className="flex rounded-lg bg-gray-100 p-1">
              {dateRangeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onDateRangeChange(option.value)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                    dateRange === option.value
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            icon={Users}
            label="Unique Visitors"
            value={data.uniqueVisitors.toLocaleString()}
            change={+12.5}
            color="violet"
            index={0}
          />
          <MetricCard
            icon={TrendingUp}
            label="Page Views"
            value={data.pageViews.toLocaleString()}
            change={+8.3}
            color="blue"
            index={1}
          />
          <MetricCard
            icon={MousePointerClick}
            label="Total Clicks"
            value={data.clicks.toLocaleString()}
            change={-2.1}
            color="green"
            index={2}
          />
          <MetricCard
            icon={Clock}
            label="Avg. Session"
            value={`${Math.floor(data.avgSessionDuration / 60)}m ${data.avgSessionDuration % 60}s`}
            change={+5.7}
            color="amber"
            index={3}
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Traffic Over Time */}
          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 lg:col-span-2"
          >
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Traffic Over Time</h3>
            <div className="h-72">
              <Line data={lineChartData} options={chartOptions} />
            </div>
          </motion.div>

          {/* Device Breakdown */}
          <motion.div
            custom={5}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200"
          >
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Devices</h3>
            <div className="h-48">
              <Doughnut
                data={deviceChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        usePointStyle: true,
                        padding: 16,
                        font: { size: 12 },
                      },
                    },
                  },
                }}
              />
            </div>
            <div className="mt-4 space-y-2">
              {data.deviceBreakdown.map((device) => (
                <div key={device.device} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-600">
                    {device.device === 'Desktop' && <Monitor className="h-4 w-4" />}
                    {device.device === 'Mobile' && <Smartphone className="h-4 w-4" />}
                    {device.device}
                  </span>
                  <span className="font-medium text-gray-900">{device.percentage}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Top Referrers */}
          <motion.div
            custom={6}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200"
          >
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Globe className="h-5 w-5 text-gray-400" />
              Top Referrers
            </h3>
            <div className="h-64">
              <Bar data={referrerChartData} options={barChartOptions} />
            </div>
          </motion.div>

          {/* Hourly Activity */}
          <motion.div
            custom={7}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200"
          >
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Clock className="h-5 w-5 text-gray-400" />
              Activity by Hour
            </h3>
            <div className="h-64">
              <Bar data={hourlyChartData} options={barChartOptions} />
            </div>
          </motion.div>
        </div>

        {/* Geographic Data */}
        <motion.div
          custom={8}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200"
        >
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <MapPin className="h-5 w-5 text-gray-400" />
            Visitor Locations
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.geoData.slice(0, 8).map((location) => (
              <div
                key={`${location.country}-${location.city}`}
                className="flex items-center justify-between rounded-xl bg-gray-50 p-4"
              >
                <div>
                  <p className="font-medium text-gray-900">{location.city}</p>
                  <p className="text-sm text-gray-500">{location.country}</p>
                </div>
                <span className="text-lg font-bold text-violet-600">{location.count}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Pages */}
        <motion.div
          custom={9}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200"
        >
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Top Pages</h3>
          <div className="space-y-3">
            {data.topPages.map((page, index) => (
              <div
                key={page.path}
                className="flex items-center justify-between rounded-xl border border-gray-100 p-4"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 font-bold text-violet-600">
                    {index + 1}
                  </span>
                  <span className="font-medium text-gray-900">{page.path}</span>
                </div>
                <span className="text-sm font-medium text-gray-500">{page.views} views</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </ProGuard>
  );
};

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  change: number;
  color: 'violet' | 'blue' | 'green' | 'amber' | 'pink' | 'cyan';
  index: number;
}

const MetricCard: React.FC<MetricCardProps> = ({
  icon: Icon,
  label,
  value,
  change,
  color,
  index,
}) => {
  const colorClasses = {
    violet: 'bg-violet-50 text-violet-600',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
    pink: 'bg-pink-50 text-pink-600',
    cyan: 'bg-cyan-50 text-cyan-600',
  };

  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200"
    >
      <div className="flex items-start justify-between">
        <div className={`rounded-xl p-3 ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div
          className={`flex items-center gap-1 text-sm font-medium ${
            change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {change >= 0 ? (
            <ArrowUpRight className="h-4 w-4" />
          ) : (
            <ArrowDownRight className="h-4 w-4" />
          )}
          {Math.abs(change)}%
        </div>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </motion.div>
  );
};

export default ProAnalyticsDashboard;
