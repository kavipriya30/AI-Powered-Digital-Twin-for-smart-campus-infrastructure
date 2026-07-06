import { useState } from 'react';
import {
  Zap,
  TrendingUp,
  TrendingDown,
  Sun,
  Battery,
  DollarSign,
  Leaf,
  BarChart3,
  PieChart,
  Activity,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const mockEnergyData = [
  { time: '00:00', usage: 320, solar: 120, cost: 45 },
  { time: '04:00', usage: 280, solar: 80, cost: 40 },
  { time: '08:00', usage: 450, solar: 200, cost: 65 },
  { time: '12:00', usage: 680, solar: 380, cost: 95 },
  { time: '16:00', usage: 720, solar: 320, cost: 100 },
  { time: '20:00', usage: 580, solar: 150, cost: 80 },
  { time: '24:00', usage: 380, solar: 90, cost: 55 }
];

const mockBuildingEnergy = [
  { name: 'Main Library', electricity: 1250, water: 180, efficiency: 85 },
  { name: 'Engineering Block', electricity: 2100, water: 320, efficiency: 72 },
  { name: 'Student Center', electricity: 890, water: 450, efficiency: 68 },
  { name: 'Science Lab', electricity: 1560, water: 280, efficiency: 78 },
  { name: 'Admin Building', electricity: 450, water: 90, efficiency: 92 }
];

const mockOptimizationTips = [
  { id: 1, title: 'Reduce HVAC usage', savings: '15%', impact: 'high', description: 'Adjust temperature setpoints during off-peak hours in Engineering Block' },
  { id: 2, title: 'Optimize lighting schedule', savings: '8%', impact: 'medium', description: 'Implement motion-sensor lighting in common areas' },
  { id: 3, title: 'Peak load shifting', savings: '12%', impact: 'high', description: 'Schedule high-power equipment during solar peak hours' },
  { id: 4, title: 'Solar utilization', savings: '22%', impact: 'high', description: 'Maximize solar panel efficiency with regular cleaning' }
];

const mockSolarData = [
  { name: 'Solar', value: 35, color: '#10b981' },
  { name: 'Grid', value: 50, color: '#3b82f6' },
  { name: 'Storage', value: 15, color: '#f59e0b' }
];

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

export default function Energy() {
  const [timeRange, setTimeRange] = useState('24h');

  const stats = {
    totalUsage: 3840,
    solarGenerated: 1340,
    savings: 892,
    efficiency: 78,
    peakDemand: 720,
    carbonSaved: 1240
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Energy Management</h1>
          <p className="text-gray-500 dark:text-gray-400">Monitor and optimize campus energy consumption</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-white"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <button className="p-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-dark-card rounded-xl p-5 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Usage</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                {stats.totalUsage} <span className="text-sm font-normal">kWh</span>
              </p>
            </div>
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <Zap className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-sm">
            <ArrowDownRight className="w-4 h-4 text-green-500" />
            <span className="text-green-500">12%</span>
            <span className="text-gray-500">vs yesterday</span>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-xl p-5 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Solar Generated</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                {stats.solarGenerated} <span className="text-sm font-normal">kWh</span>
              </p>
            </div>
            <div className="p-3 bg-green-500/10 rounded-lg">
              <Sun className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-sm">
            <ArrowUpRight className="w-4 h-4 text-green-500" />
            <span className="text-green-500">8%</span>
            <span className="text-gray-500">vs yesterday</span>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-xl p-5 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Cost Savings</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                ${stats.savings}
              </p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-sm">
            <ArrowUpRight className="w-4 h-4 text-green-500" />
            <span className="text-green-500">5%</span>
            <span className="text-gray-500">this month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-xl p-5 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Efficiency</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                {stats.efficiency}%
              </p>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Activity className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-sm">
            <ArrowUpRight className="w-4 h-4 text-green-500" />
            <span className="text-green-500">3%</span>
            <span className="text-gray-500">improvement</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Energy Usage Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Energy Usage & Solar Generation</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary-500 rounded-full" />
                <span className="text-sm text-gray-500">Usage</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-sm text-gray-500">Solar</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={mockEnergyData}>
              <defs>
                <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Area type="monotone" dataKey="usage" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsage)" strokeWidth={2} name="Usage (kWh)" />
              <Area type="monotone" dataKey="solar" stroke="#10b981" fillOpacity={1} fill="url(#colorSolar)" strokeWidth={2} name="Solar (kWh)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Power Source Distribution */}
        <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-dark-border">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Power Sources</h2>
          <ResponsiveContainer width="100%" height={250}>
            <RePieChart>
              <Pie
                data={mockSolarData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {mockSolarData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
            </RePieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4">
            {mockSolarData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-sm text-gray-500">{entry.name} ({entry.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Building Energy & Optimization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Building Energy */}
        <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-dark-border">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Energy by Building</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockBuildingEnergy} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis type="number" stroke="#6b7280" fontSize={12} />
              <YAxis dataKey="name" type="category" stroke="#6b7280" fontSize={12} width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="electricity" fill="#3b82f6" name="Electricity (kWh)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* AI Optimization Tips */}
        <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">AI Optimization Tips</h2>
            <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm">Save up to 22%</span>
          </div>
          <div className="space-y-4">
            {mockOptimizationTips.map((tip) => (
              <div key={tip.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white">{tip.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{tip.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-green-500">{tip.savings}</span>
                    <span className="text-xs text-gray-500 block">potential savings</span>
                  </div>
                </div>
                <div className="mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    tip.impact === 'high' ? 'bg-red-100 text-red-600' :
                    tip.impact === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {tip.impact} impact
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Carbon Savings */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100">Carbon Emissions Saved</p>
            <p className="text-4xl font-bold mt-1">{stats.carbonSaved} kg</p>
            <p className="text-green-100 mt-2">Equivalent to planting 56 trees</p>
          </div>
          <div className="p-4 bg-white/10 rounded-xl">
            <Leaf className="w-12 h-12 opacity-50" />
          </div>
        </div>
      </div>
    </div>
  );
}
