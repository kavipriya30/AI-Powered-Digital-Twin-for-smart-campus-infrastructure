import { useState } from 'react';
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  Clock,
  MapPin,
  Building2,
  Eye,
  EyeOff,
  RefreshCw,
  Info,
  AlertCircle
} from 'lucide-react';

const mockAlerts = [
  { id: 1, title: 'Server Room Temperature High', description: 'Main Library server room temperature exceeded threshold', severity: 'critical', category: 'infrastructure', building: 'Main Library', location: 'Floor 4, Room 401', timestamp: '2 min ago', status: 'active', isRead: false },
  { id: 2, title: 'Elevator Maintenance Due', description: 'Scheduled maintenance overdue for Engineering Block elevator', severity: 'warning', category: 'maintenance', building: 'Engineering Block', location: 'Main Elevator', timestamp: '15 min ago', status: 'active', isRead: false },
  { id: 3, title: 'High Energy Usage Detected', description: 'Student Center energy consumption 20% above normal', severity: 'warning', category: 'energy', building: 'Student Center', location: 'Building Main', timestamp: '1 hour ago', status: 'acknowledged', isRead: true, acknowledgedBy: 'John Smith' },
  { id: 4, title: 'Water Leakage Risk', description: 'Possible water leakage detected in Science Lab', severity: 'critical', category: 'maintenance', building: 'Science Lab', location: 'Floor 2, Lab 205', timestamp: '2 hours ago', status: 'active', isRead: false },
  { id: 5, title: 'WiFi Network Degradation', description: 'Access point AP-042 experiencing connectivity issues', severity: 'info', category: 'infrastructure', building: 'Student Center', location: 'Floor 2', timestamp: '3 hours ago', status: 'resolved', isRead: true, resolvedBy: 'Mike Johnson' },
  { id: 6, title: 'Crowd Density Alert', description: 'High occupancy detected in Main Library', severity: 'warning', category: 'crowd', building: 'Main Library', location: 'Reading Area', timestamp: '4 hours ago', status: 'resolved', isRead: true },
  { id: 7, title: 'HVAC Filter Replacement', description: 'HVAC filter replacement scheduled for Admin Building', severity: 'info', category: 'maintenance', building: 'Admin Building', location: 'HVAC Unit 1', timestamp: '1 day ago', status: 'active', isRead: true },
  { id: 8, title: 'Power Fluctuation', description: 'Unusual power fluctuation detected in Engineering Block', severity: 'critical', category: 'energy', building: 'Engineering Block', location: 'Floor 3', timestamp: '1 day ago', status: 'acknowledged', isRead: true, acknowledgedBy: 'Sarah Davis' }
];

export default function Alerts() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showRead, setShowRead] = useState(true);

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'border-l-red-500 bg-red-500/5';
      case 'warning': return 'border-l-yellow-500 bg-yellow-500/5';
      case 'info': return 'border-l-blue-500 bg-blue-500/5';
      default: return 'border-l-gray-500';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
      case 'acknowledged': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'resolved': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          alert.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || alert.category === filterCategory;
    const matchesRead = showRead || !alert.isRead;
    return matchesSearch && matchesSeverity && matchesStatus && matchesCategory && matchesRead;
  });

  const markAsRead = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));
  };

  const acknowledgeAlert = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'acknowledged', acknowledgedBy: 'Current User' } : a));
  };

  const resolveAlert = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'resolved', resolvedBy: 'Current User' } : a));
  };

  const activeCount = alerts.filter(a => a.status === 'active').length;
  const criticalCount = alerts.filter(a => a.severity === 'critical' && a.status === 'active').length;
  const unreadCount = alerts.filter(a => !a.isRead).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Alerts</h1>
          <p className="text-gray-500 dark:text-gray-400">Monitor and manage campus alerts</p>
        </div>
        <button className="p-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600">
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Alerts</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{alerts.length}</p>
            </div>
            <Bell className="w-8 h-8 text-primary-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-red-500">{activeCount}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Critical</p>
              <p className="text-2xl font-bold text-red-500">{criticalCount}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Unread</p>
              <p className="text-2xl font-bold text-blue-500">{unreadCount}</p>
            </div>
            <Eye className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search alerts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-white"
        >
          <option value="all">All Severity</option>
          <option value="critical">Critical</option>
          <option value="warning">Warning</option>
          <option value="info">Info</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-white"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="acknowledged">Acknowledged</option>
          <option value="resolved">Resolved</option>
        </select>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-white"
        >
          <option value="all">All Categories</option>
          <option value="infrastructure">Infrastructure</option>
          <option value="energy">Energy</option>
          <option value="maintenance">Maintenance</option>
          <option value="security">Security</option>
          <option value="crowd">Crowd</option>
        </select>
        <button
          onClick={() => setShowRead(!showRead)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${showRead ? 'bg-primary-500 text-white border-primary-500' : 'border-gray-300 dark:border-gray-600'}`}
        >
          {showRead ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          Show Read
        </button>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`bg-white dark:bg-dark-card rounded-xl p-5 border border-gray-200 dark:border-dark-border border-l-4 ${getSeverityColor(alert.severity)} ${!alert.isRead ? 'ring-2 ring-primary-500/20' : ''}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="mt-1">{getSeverityIcon(alert.severity)}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-800 dark:text-white">{alert.title}</h3>
                    {!alert.isRead && <span className="w-2 h-2 bg-primary-500 rounded-full" />}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{alert.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {alert.building}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {alert.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {alert.timestamp}
                    </span>
                  </div>
                  {alert.acknowledgedBy && (
                    <p className="text-xs text-gray-500 mt-2">Acknowledged by: {alert.acknowledgedBy}</p>
                  )}
                  {alert.resolvedBy && (
                    <p className="text-xs text-gray-500 mt-2">Resolved by: {alert.resolvedBy}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(alert.status)}`}>
                  {alert.status}
                </span>
                <div className="flex gap-2 mt-2">
                  {!alert.isRead && (
                    <button
                      onClick={() => markAsRead(alert.id)}
                      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                      title="Mark as read"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  {alert.status === 'active' && (
                    <>
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-yellow-500"
                        title="Acknowledge"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-green-500"
                        title="Resolve"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="text-center py-12">
          <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No alerts found</p>
        </div>
      )}
    </div>
  );
}
