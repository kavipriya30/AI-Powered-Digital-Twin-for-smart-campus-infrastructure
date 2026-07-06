import { useState } from 'react';
import {
  Leaf,
  Droplets,
  Wind,
  Recycle,
  TreePine,
  Zap,
  TrendingUp,
  TrendingDown,
  Award,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Globe,
  Factory
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

const mockCarbonData = [
  { month: 'Jan', emissions: 450, saved: 120 },
  { month: 'Feb', emissions: 420, saved: 145 },
  { month: 'Mar', emissions: 480, saved: 130 },
  { month: 'Apr', emissions: 390, saved: 160 },
  { month: 'May', emissions: 360, saved: 180 },
  { month: 'Jun', emissions: 340, saved: 200 }
];

const mockWaterData = [
  { month: 'Jan', usage: 1200, recycled: 300 },
  { month: 'Feb', usage: 1150, recycled: 320 },
  { month: 'Mar', usage: 1080, recycled: 350 },
  { month: 'Apr', usage: 950, recycled: 380 },
  { month: 'May', usage: 890, recycled: 420 },
  { month: 'Jun', usage: 820, recycled: 450 }
];

const mockWasteData = [
  { name: 'Recycled', value: 45, color: '#10b981' },
  { name: 'Composted', value: 25, color: '#22c55e' },
  { name: 'Landfill', value: 20, color: '#f59e0b' },
  { name: 'Hazardous', value: 10, color: '#ef4444' }
];

const mockInitiatives = [
  { id: 1, name: 'Solar Panel Installation', progress: 75, target: '1 MW', status: 'in_progress', impact: 'High' },
  { id: 2, name: 'LED Lighting Upgrade', progress: 90, target: '100% campus', status: 'in_progress', impact: 'Medium' },
  { id: 3, name: 'Rainwater Harvesting', progress: 40, target: '50000 L', status: 'planning', impact: 'Medium' },
  { id: 4, name: 'Electric Vehicle Charging', progress: 60, target: '50 stations', status: 'in_progress', impact: 'High' },
  { id: 5, name: 'Green Roof Initiative', progress: 25, target: '5000 sqm', status: 'planning', impact: 'Low' }
];

export default function Sustainability() {
  const stats = {
    carbonScore: 82,
    waterEfficiency: 78,
    wasteDiverted: 75,
    energyFromRenewable: 42,
    treesEquivalent: 1250,
    sustainabilityRank: 'A+'
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Sustainability Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Track campus environmental impact and sustainability goals</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 rounded-lg">
          <Award className="w-5 h-5" />
          <span className="font-medium">Sustainability Score: {stats.sustainabilityRank}</span>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Carbon Score</p>
              <p className="text-3xl font-bold mt-1">{stats.carbonScore}%</p>
            </div>
            <Leaf className="w-8 h-8 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Water Efficiency</p>
              <p className="text-3xl font-bold mt-1">{stats.waterEfficiency}%</p>
            </div>
            <Droplets className="w-8 h-8 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Waste Diverted</p>
              <p className="text-3xl font-bold mt-1">{stats.wasteDiverted}%</p>
            </div>
            <Recycle className="w-8 h-8 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100">Renewable Energy</p>
              <p className="text-3xl font-bold mt-1">{stats.energyFromRenewable}%</p>
            </div>
            <Zap className="w-8 h-8 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Trees Equivalent</p>
              <p className="text-3xl font-bold mt-1">{stats.treesEquivalent}</p>
            </div>
            <TreePine className="w-8 h-8 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-100">CO2 Reduced</p>
              <p className="text-3xl font-bold mt-1">940t</p>
            </div>
            <Wind className="w-8 h-8 opacity-50" />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Carbon Emissions */}
        <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Carbon Emissions & Savings</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-sm text-gray-500">Emissions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-sm text-gray-500">Saved</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={mockCarbonData}>
              <defs>
                <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSaved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Area type="monotone" dataKey="emissions" stroke="#ef4444" fillOpacity={1} fill="url(#colorEmissions)" strokeWidth={2} name="Emissions (tCO2e)" />
              <Area type="monotone" dataKey="saved" stroke="#10b981" fillOpacity={1} fill="url(#colorSaved)" strokeWidth={2} name="Saved (tCO2e)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Water Usage */}
        <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Water Usage & Recycling</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="text-sm text-gray-500">Usage</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-cyan-500 rounded-full" />
                <span className="text-sm text-gray-500">Recycled</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockWaterData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="usage" name="Usage (m³)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="recycled" name="Recycled (m³)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Waste & Initiatives */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Waste Distribution */}
        <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-dark-border">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Waste Distribution</h2>
          <div className="flex items-center gap-8">
            <ResponsiveContainer width="50%" height={200}>
              <RePieChart>
                <Pie
                  data={mockWasteData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {mockWasteData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
              </RePieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {mockWasteData.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                  <span className="font-medium text-gray-800 dark:text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sustainability Initiatives */}
        <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-dark-border">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Green Initiatives</h2>
          <div className="space-y-4">
            {mockInitiatives.map((initiative) => (
              <div key={initiative.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white">{initiative.name}</h3>
                    <p className="text-sm text-gray-500">Target: {initiative.target}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    initiative.status === 'in_progress' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {initiative.status === 'in_progress' ? 'In Progress' : 'Planning'}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-medium">{initiative.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{ width: `${initiative.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Environmental Goals */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">2030 Environmental Goals</h2>
            <p className="text-green-100">Committing to carbon neutrality by 2030</p>
          </div>
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold">50%</p>
              <p className="text-sm text-green-100">Carbon Reduction</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">80%</p>
              <p className="text-sm text-green-100">Renewable Energy</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">90%</p>
              <p className="text-sm text-green-100">Waste Diverted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
