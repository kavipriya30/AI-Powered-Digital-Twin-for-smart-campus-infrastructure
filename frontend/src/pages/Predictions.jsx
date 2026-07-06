import { useState } from 'react';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Activity,
  Cpu,
  Zap,
  Thermometer,
  Droplets,
  Shield,
  RefreshCw,
  Calendar,
  Target,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const mockPredictions = [
  { id: 1, type: 'Equipment Failure', model: 'Random Forest', accuracy: 94, risk: 'medium', probability: 45, building: 'Engineering Block', component: 'HVAC Unit 3', daysUntil: 7, recommendation: 'Schedule preventive maintenance' },
  { id: 2, type: 'Power Overload', model: 'Neural Network', accuracy: 91, risk: 'low', probability: 22, building: 'Student Center', component: 'Main Panel', daysUntil: 14, recommendation: 'Monitor load patterns' },
  { id: 3, type: 'Water Leakage', model: 'Gradient Boosting', accuracy: 89, risk: 'medium', probability: 38, building: 'Science Lab', component: 'Water Main', daysUntil: 5, recommendation: 'Inspect pipe joints' },
  { id: 4, type: 'Temperature Anomaly', model: 'LSTM', accuracy: 96, risk: 'low', probability: 18, building: 'Server Room', component: 'Cooling System', daysUntil: 21, recommendation: 'Clean cooling filters' },
  { id: 5, type: 'Elevator Failure', model: 'Random Forest', accuracy: 92, risk: 'high', probability: 62, building: 'Main Library', component: 'Elevator A', daysUntil: 3, recommendation: 'Immediate inspection required' }
];

const mockTrends = [
  { month: 'Jan', failures: 2, savings: 4500 },
  { month: 'Feb', failures: 1, savings: 5200 },
  { month: 'Mar', failures: 3, savings: 3800 },
  { month: 'Apr', failures: 1, savings: 6100 },
  { month: 'May', failures: 2, savings: 4900 },
  { month: 'Jun', failures: 1, savings: 5500 }
];

const mockRiskFactors = [
  { factor: 'HVAC Systems', count: 12, risk: 'high' },
  { factor: 'Electrical', count: 8, risk: 'medium' },
  { factor: 'Plumbing', count: 5, risk: 'medium' },
  { factor: 'Elevators', count: 3, risk: 'high' },
  { factor: 'Security', count: 2, risk: 'low' }
];

export default function Predictions() {
  const [timeRange, setTimeRange] = useState('30d');

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'low': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const stats = {
    totalPredictions: 156,
    accuracy: 93,
    prevented: 12,
    savings: 34500,
    avgResponseTime: '2.5 days'
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">AI Predictions</h1>
          <p className="text-gray-500 dark:text-gray-400">Machine learning powered predictive maintenance</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-white"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button className="p-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-dark-card rounded-xl p-5 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Predictions</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stats.totalPredictions}</p>
            </div>
            <Brain className="w-8 h-8 text-primary-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-xl p-5 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Model Accuracy</p>
              <p className="text-2xl font-bold text-green-500 mt-1">{stats.accuracy}%</p>
            </div>
            <Target className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-xl p-5 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Failures Prevented</p>
              <p className="text-2xl font-bold text-blue-500 mt-1">{stats.prevented}</p>
            </div>
            <Shield className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-xl p-5 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Cost Savings</p>
              <p className="text-2xl font-bold text-yellow-500 mt-1">${stats.savings.toLocaleString()}</p>
            </div>
            <Zap className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-xl p-5 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg Response</p>
              <p className="text-2xl font-bold text-purple-500 mt-1">{stats.avgResponseTime}</p>
            </div>
            <Activity className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Predictions Trend */}
        <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-dark-border">
          <h2 className="text-lg font-800 dark:text-semibold text-gray-white mb-6">Predictions & Savings Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis yAxisId="left" stroke="#6b7280" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" stroke="#6b7280" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Bar yAxisId="left" dataKey="failures" name="Failures" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="savings" name="Savings ($)" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Factors */}
        <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-dark-border">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Risk Factors by Category</h2>
          <div className="space-y-4">
            {mockRiskFactors.map((factor, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className={`w-5 h-5 ${factor.risk === 'high' ? 'text-red-500' : factor.risk === 'medium' ? 'text-yellow-500' : 'text-green-500'}`} />
                  <span className="font-medium text-gray-800 dark:text-white">{factor.factor}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-500">{factor.count} issues</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(factor.risk)}`}>
                    {factor.risk}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Predictions List */}
      <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-dark-border">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Active Predictions</h2>
        <div className="space-y-4">
          {mockPredictions.map((prediction) => (
            <div key={prediction.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${prediction.risk === 'high' ? 'bg-red-500/10' : prediction.risk === 'medium' ? 'bg-yellow-500/10' : 'bg-green-500/10'}`}>
                    {prediction.risk === 'high' ? <AlertCircle className="w-5 h-5 text-red-500" /> : 
                     prediction.risk === 'medium' ? <AlertTriangle className="w-5 h-5 text-yellow-500" /> :
                     <CheckCircle className="w-5 h-5 text-green-500" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">{prediction.type}</h3>
                    <p className="text-sm text-gray-500">{prediction.building} - {prediction.component}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Cpu className="w-4 h-4" />
                        {prediction.model}
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        {prediction.accuracy}% accuracy
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {prediction.daysUntil} days
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${prediction.risk === 'high' ? 'bg-red-500' : prediction.risk === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${prediction.probability}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{prediction.probability}%</span>
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(prediction.risk)}`}>
                    {prediction.risk} risk
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Recommendation:</span> {prediction.recommendation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
