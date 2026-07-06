import { useState, useEffect } from 'react';
import socketService from '../services/socket';
import {
  Activity,
  Thermometer,
  Droplets,
  Zap,
  Wifi,
  AlertTriangle,
  Search,
  Filter,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Battery,
  Signal
} from 'lucide-react';

const mockSensors = [
  { id: 'S001', name: 'Temperature Sensor A1', type: 'temperature', building: 'Main Library', floor: '1', value: 22.5, unit: '°C', status: 'active', battery: 85, lastReading: '2 min ago', trend: 'stable' },
  { id: 'S002', name: 'Humidity Sensor B2', type: 'humidity', building: 'Engineering Block', floor: '2', value: 45, unit: '%', status: 'active', battery: 92, lastReading: '1 min ago', trend: 'up' },
  { id: 'S003', name: 'Power Meter M1', type: 'energy', building: 'Student Center', floor: '1', value: 125.8, unit: 'kW', status: 'active', battery: null, lastReading: '30 sec ago', trend: 'down' },
  { id: 'S004', name: 'Water Flow Sensor W1', type: 'water', building: 'Science Lab', floor: '1', value: 2.3, unit: 'L/s', status: 'active', battery: 78, lastReading: '5 min ago', trend: 'stable' },
  { id: 'S005', name: 'CO2 Sensor C1', type: 'co2', building: 'Main Library', floor: '3', value: 450, unit: 'ppm', status: 'warning', battery: 65, lastReading: '3 min ago', trend: 'up' },
  { id: 'S006', name: 'Motion Sensor M2', type: 'motion', building: 'Admin Building', floor: '1', value: 0, unit: '', status: 'active', battery: 95, lastReading: '10 sec ago', trend: 'stable' },
  { id: 'S007', name: 'HVAC Status H1', type: 'hvac_status', building: 'Engineering Block', floor: '3', value: 1, unit: '', status: 'active', battery: null, lastReading: '1 min ago', trend: 'stable' },
  { id: 'S008', name: 'Server Room Temp', type: 'temperature', building: 'Main Library', floor: '4', value: 18.2, unit: '°C', status: 'critical', battery: 45, lastReading: '30 sec ago', trend: 'up' },
  { id: 'S009', name: 'Light Sensor L1', type: 'light', building: 'Student Center', floor: '2', value: 450, unit: 'lux', status: 'active', battery: 88, lastReading: '2 min ago', trend: 'down' },
  { id: 'S010', name: 'WiFi Signal W1', type: 'wifi_signal', building: 'Science Lab', floor: '1', value: -45, unit: 'dBm', status: 'active', battery: null, lastReading: '10 sec ago', trend: 'stable' }
];

const sensorTypes = [
  { type: 'temperature', icon: Thermometer, color: 'bg-red-500', label: 'Temperature' },
  { type: 'humidity', icon: Droplets, color: 'bg-blue-500', label: 'Humidity' },
  { type: 'energy', icon: Zap, color: 'bg-yellow-500', label: 'Energy' },
  { type: 'water', icon: Droplets, color: 'bg-cyan-500', label: 'Water' },
  { type: 'co2', icon: Activity, color: 'bg-purple-500', label: 'CO2' },
  { type: 'motion', icon: Activity, color: 'bg-green-500', label: 'Motion' },
  { type: 'wifi_signal', icon: Wifi, color: 'bg-pink-500', label: 'WiFi' }
];

export default function Sensors() {
  const [sensors, setSensors] = useState(mockSensors);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    // Listen for real-time sensor updates
    socketService.onSensorUpdate((data) => {
      setSensors(prev => prev.map(s => 
        s.id === data.sensorId ? { ...s, value: data.value, lastReading: 'Just now' } : s
      ));
      setLastUpdate(new Date());
    });

    return () => {
      socketService.off('sensor:update');
    };
  }, []);

  const getSensorIcon = (type) => {
    const sensorType = sensorTypes.find(t => t.type === type);
    return sensorType ? sensorType.icon : Activity;
  };

  const getSensorColor = (type) => {
    const sensorType = sensorTypes.find(t => t.type === type);
    return sensorType ? sensorType.color : 'bg-gray-500';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-500 bg-green-500/10';
      case 'warning': return 'text-yellow-500 bg-yellow-500/10';
      case 'critical': return 'text-red-500 bg-red-500/10';
      case 'inactive': return 'text-gray-500 bg-gray-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-green-500" />;
      default: return <span className="w-4 h-4" />;
    }
  };

  const filteredSensors = sensors.filter(sensor => {
    const matchesSearch = sensor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sensor.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sensor.building.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || sensor.type === filterType;
    const matchesStatus = filterStatus === 'all' || sensor.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const activeCount = sensors.filter(s => s.status === 'active').length;
  const warningCount = sensors.filter(s => s.status === 'warning').length;
  const criticalCount = sensors.filter(s => s.status === 'critical').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Sensors</h1>
          <p className="text-gray-500 dark:text-gray-400">Real-time IoT sensor monitoring</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <RefreshCw className="w-4 h-4" />
          Last update: {lastUpdate.toLocaleTimeString()}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Sensors</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{sensors.length}</p>
            </div>
            <Activity className="w-8 h-8 text-primary-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-green-500">{activeCount}</p>
            </div>
            <Signal className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Warning</p>
              <p className="text-2xl font-bold text-yellow-500">{warningCount}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Critical</p>
              <p className="text-2xl font-bold text-red-500">{criticalCount}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search sensors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Types</option>
          {sensorTypes.map(type => (
            <option key={type.type} value={type.type}>{type.label}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="warning">Warning</option>
          <option value="critical">Critical</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Sensor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSensors.map((sensor) => {
          const Icon = getSensorIcon(sensor.type);
          return (
            <div key={sensor.id} className="bg-white dark:bg-dark-card rounded-xl p-5 border border-gray-200 dark:border-dark-border hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getSensorColor(sensor.type)}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white text-sm">{sensor.name}</p>
                    <p className="text-xs text-gray-500">{sensor.id}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sensor.status)}`}>
                  {sensor.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-800 dark:text-white">
                      {sensor.value}
                      <span className="text-sm font-normal text-gray-500 ml-1">{sensor.unit}</span>
                    </p>
                    <p className="text-sm text-gray-500">{sensor.building} - Floor {sensor.floor}</p>
                  </div>
                  {getTrendIcon(sensor.trend)}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Last reading: {sensor.lastReading}</span>
                  </div>
                  {sensor.battery !== null && (
                    <div className="flex items-center gap-1">
                      <Battery className={`w-4 h-4 ${sensor.battery > 20 ? 'text-green-500' : 'text-red-500'}`} />
                      <span className="text-xs text-gray-500">{sensor.battery}%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
