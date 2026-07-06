import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import socketService from '../services/socket';
import {
  Building2,
  Activity,
  Zap,
  AlertTriangle,
  Thermometer,
  Droplets,
  Wind,
  Users,
  Shield,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Brain,
  Leaf,
  MapPin,
  Clock,
  Wifi,
  Eye
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
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Mock data for the dashboard
const mockBuildings = [
  { id: 1, name: 'Main Library', health: 95, status: 'excellent', occupancy: 78 },
  { id: 2, name: 'Engineering Block', health: 82, status: 'good', occupancy: 92 },
  { id: 3, name: 'Student Center', health: 71, status: 'fair', occupancy: 65 },
  { id: 4, name: 'Science Lab', health: 88, status: 'good', occupancy: 45 },
  { id: 5, name: 'Admin Building', health: 96, status: 'excellent', occupancy: 30 }
];

const mockEnergyData = [
  { time: '00:00', usage: 320, solar: 120 },
  { time: '04:00', usage: 280, solar: 80 },
  { time: '08:00', usage: 450, solar: 200 },
  { time: '12:00', usage: 680, solar: 380 },
  { time: '16:00', usage: 720, solar: 320 },
  { time: '20:00', usage: 580, solar: 150 },
  { time: '24:00', usage: 380, solar: 90 }
];

const mockAlerts = [
  { id: 1, severity: 'critical', message: 'Server room temperature high', building: 'Main Library', time: '2 min ago' },
  { id: 2, severity: 'warning', message: 'Elevator maintenance due', building: 'Engineering Block', time: '15 min ago' },
  { id: 3, severity: 'info', message: 'Energy usage optimized', building: 'Student Center', time: '1 hour ago' }
];

const mockPredictions = [
  { type: 'Equipment Failure', risk: 'medium', probability: 45 },
  { type: 'Power Overload', risk: 'low', probability: 22 },
  { type: 'Water Leakage', risk: 'low', probability: 18 },
  { type: 'HVAC Failure', risk: 'medium', probability: 38 }
];

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

const StatCard = ({ icon: Icon, title, value, unit, trend, trendValue, color }) => (
  <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-dark-border">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
          {value} <span className="text-sm font-normal text-gray-500">{unit}</span>
        </p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    {trend && (
      <div className="flex items-center gap-1 mt-4">
        {trend === 'up' ? (
          <TrendingUp className="w-4 h-4 text-green-500" />
        ) : (
          <TrendingDown className="w-4 h-4 text-red-500" />
        )}
        <span className={trend === 'up' ? 'text-green-500' : 'text-red-500'}>{trendValue}</span>
        <span className="text-gray-400 text-sm ml-1">vs last week</span>
      </div>
    )}
  </div>
);

const BuildingCard = ({ building }) => {
  const getHealthColor = (health) => {
    if (health >= 90) return 'bg-green-500';
    if (health >= 70) return 'bg-blue-500';
    if (health >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-gray-200 dark:border-dark-border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${getHealthColor(building.health)}`} />
          <span className="font-medium text-gray-800 dark:text-white">{building.name}</span>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">{building.status}</span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Health Score</span>
          <span className="font-medium text-gray-800 dark:text-white">{building.health}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${getHealthColor(building.health)}`}
            style={{ width: `${building.health}%` }}
          />
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span className="text-gray-500 dark:text-gray-400">Occupancy</span>
          <span className="font-medium text-gray-800 dark:text-white">{building.occupancy}%</span>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const [buildings, setBuildings] = useState(mockBuildings);
  const [alerts, setAlerts] = useState(mockAlerts);
  const [stats, setStats] = useState({
    totalBuildings: 12,
    activeSensors: 156,
    totalEnergy: 2847,
    activeAlerts: 5,
    avgHealth: 86,
    carbonSaved: 1240
  });

  useEffect(() => {
    // Listen for real-time updates
    socketService.onCampusUpdate((data) => {
      // Update dashboard with new data
    });

    socketService.onAlert((alert) => {
      setAlerts(prev => [alert, ...prev].slice(0, 5));
    });

    return () => {
      socketService.off('campus:update');
      socketService.off('alert:new');
    };
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'warning': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'info': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Welcome back, {user?.firstName || user?.username || 'User'}!
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Here's what's happening at your campus today
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 rounded-lg">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            System Online
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Building2}
          title="Total Buildings"
          value={stats.totalBuildings}
          unit=""
          trend="up"
          trendValue="+2"
          color="bg-primary-500"
        />
        <StatCard
          icon={Activity}
          title="Active Sensors"
          value={stats.activeSensors}
          unit=""
          trend="up"
          trendValue="+12"
          color="bg-cyan-500"
        />
        <StatCard
          icon={Zap}
          title="Energy Today"
          value={stats.totalEnergy}
          unit="kWh"
          trend="down"
          trendValue="8%"
          color="bg-amber-500"
        />
        <StatCard
          icon={AlertTriangle}
          title="Active Alerts"
          value={stats.activeAlerts}
          unit=""
          color="bg-red-500"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Energy Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Energy Overview</h2>
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
              <Area
                type="monotone"
                dataKey="usage"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorUsage)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="solar"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorSolar)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Alerts Panel */}
        <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Alerts</h2>
            <Link to="/alerts" className="text-primary-500 text-sm hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}
              >
                <p className="font-medium text-sm">{alert.message}</p>
                <div className="flex items-center gap-2 mt-2 text-xs opacity-75">
                  <MapPin className="w-3 h-3" />
                  <span>{alert.building}</span>
                  <span>•</span>
                  <Clock className="w-3 h-3" />
                  <span>{alert.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Buildings and Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Buildings */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Building Health</h2>
            <Link to="/buildings" className="text-primary-500 text-sm hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {buildings.map((building) => (
              <BuildingCard key={building.id} building={building} />
            ))}
          </div>
        </div>

        {/* AI Predictions */}
        <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">AI Predictions</h2>
            <Brain className="w-5 h-5 text-primary-500" />
          </div>
          <div className="space-y-4">
            {mockPredictions.map((prediction, index) => (
              <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800 dark:text-white text-sm">{prediction.type}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    prediction.risk === 'high' ? 'bg-red-100 text-red-600' :
                    prediction.risk === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {prediction.risk}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        prediction.risk === 'high' ? 'bg-red-500' :
                        prediction.risk === 'medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${prediction.probability}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500">{prediction.probability}%</span>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/predictions"
            className="mt-4 w-full py-2 px-4 bg-primary-500/10 text-primary-500 rounded-lg text-center block hover:bg-primary-500/20 transition-colors"
          >
            View All Predictions
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Avg. Health Score</p>
              <p className="text-3xl font-bold mt-1">{stats.avgHealth}%</p>
            </div>
            <Shield className="w-8 h-8 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Carbon Saved</p>
              <p className="text-3xl font-bold mt-1">{stats.carbonSaved} kg</p>
            </div>
            <Leaf className="w-8 h-8 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">WiFi Coverage</p>
              <p className="text-3xl font-bold mt-1">99.8%</p>
            </div>
            <Wifi className="w-8 h-8 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Avg. Occupancy</p>
              <p className="text-3xl font-bold mt-1">62%</p>
            </div>
            <Users className="w-8 h-8 opacity-50" />
          </div>
        </div>
      </div>
    </div>
  );
}
