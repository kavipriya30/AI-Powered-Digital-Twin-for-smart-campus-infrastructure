import { useState } from 'react';
import {
  Shield,
  Eye,
  AlertTriangle,
  Camera,
  Lock,
  Users,
  MapPin,
  Clock,
  Activity,
  Search,
  Filter,
  Bell,
  CheckCircle,
  XCircle,
  Play,
  Pause
} from 'lucide-react';

const mockCameras = [
  { id: 1, name: 'Main Entrance', location: 'Main Library', status: 'active', lastMotion: '2 min ago', alerts: 0 },
  { id: 2, name: 'Parking Lot A', location: 'Student Center', status: 'active', lastMotion: '5 min ago', alerts: 2 },
  { id: 3, name: 'Lab Corridor', location: 'Science Lab', status: 'active', lastMotion: '1 min ago', alerts: 0 },
  { id: 4, name: 'Server Room', location: 'Main Library', status: 'active', lastMotion: 'Just now', alerts: 0 },
  { id: 5, name: 'Cafeteria', location: 'Student Center', status: 'inactive', lastMotion: '1 hour ago', alerts: 1 },
  { id: 6, name: 'Library Reading Area', location: 'Main Library', status: 'active', lastMotion: '3 min ago', alerts: 0 }
];

const mockIncidents = [
  { id: 1, type: 'Unauthorized Access', severity: 'high', location: 'Engineering Block', description: 'Attempted entry after hours', timestamp: '10 min ago', status: 'investigating' },
  { id: 2, type: 'Suspicious Movement', severity: 'medium', location: 'Parking Lot B', description: 'Unidentified person detected', timestamp: '1 hour ago', status: 'resolved' },
  { id: 3, type: 'Tailgating', severity: 'low', location: 'Main Entrance', description: 'Person followed employee through door', timestamp: '3 hours ago', status: 'resolved' }
];

const mockAccessLogs = [
  { id: 1, user: 'John Smith', action: 'Entry', location: 'Main Library', time: '09:15 AM', status: 'authorized' },
  { id: 2, user: 'Sarah Davis', action: 'Exit', location: 'Engineering Block', time: '09:12 AM', status: 'authorized' },
  { id: 3, user: 'Unknown', action: 'Entry Attempt', location: 'Server Room', time: '09:10 AM', status: 'denied' },
  { id: 4, user: 'Mike Johnson', action: 'Entry', location: 'Science Lab', time: '09:05 AM', status: 'authorized' },
  { id: 5, user: 'Emily Brown', action: 'Exit', location: 'Admin Building', time: '09:00 AM', status: 'authorized' }
];

const mockEmergencySimulations = [
  { id: 1, type: 'Fire', status: 'inactive', lastRun: '2 days ago' },
  { id: 2, type: 'Flood', status: 'inactive', lastRun: '5 days ago' },
  { id: 3, type: 'Earthquake', status: 'inactive', lastRun: '1 week ago' },
  { id: 4, type: 'Lockdown', status: 'inactive', lastRun: 'Never' }
];

export default function Security() {
  const [activeTab, setActiveTab] = useState('overview');
  const [simulations, setSimulations] = useState(mockEmergencySimulations);

  const stats = {
    activeCameras: 24,
    totalCameras: 26,
    activeIncidents: 3,
    securityScore: 94,
    accessPoints: 12,
    unauthorizedAttempts: 5
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'low': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const runSimulation = (id) => {
    setSimulations(prev => prev.map(s => 
      s.id === id ? { ...s, status: 'active' } : s
    ));
  };

  const stopSimulation = (id) => {
    setSimulations(prev => prev.map(s => 
      s.id === id ? { ...s, status: 'inactive' } : s
    ));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Security Center</h1>
          <p className="text-gray-500 dark:text-gray-400">Monitor and manage campus security</p>
        </div>
        <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Emergency Alert
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Security Score</p>
              <p className="text-2xl font-bold text-green-500">{stats.securityScore}%</p>
            </div>
            <Shield className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Cameras</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.activeCameras}/{stats.totalCameras}</p>
            </div>
            <Camera className="w-8 h-8 text-primary-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Incidents</p>
              <p className="text-2xl font-bold text-yellow-500">{stats.activeIncidents}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Access Points</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.accessPoints}</p>
            </div>
            <Lock className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Unauthorized</p>
              <p className="text-2xl font-bold text-red-500">{stats.unauthorizedAttempts}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Coverage</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">99.8%</p>
            </div>
            <Eye className="w-8 h-8 text-cyan-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-dark-border pb-2">
        {['overview', 'cameras', 'incidents', 'access', 'emergency'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium capitalize ${
              activeTab === tab
                ? 'bg-primary-500 text-white'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Incidents */}
          <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-dark-border">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Incidents</h2>
            <div className="space-y-3">
              {mockIncidents.map((incident) => (
                <div key={incident.id} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-white">{incident.type}</h3>
                      <p className="text-sm text-gray-500">{incident.description}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <MapPin className="w-3 h-3" />
                        <span>{incident.location}</span>
                        <Clock className="w-3 h-3 ml-2" />
                        <span>{incident.timestamp}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(incident.severity)}`}>
                      {incident.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Access Logs */}
          <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-dark-border">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Access Logs</h2>
            <div className="space-y-3">
              {mockAccessLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${log.status === 'authorized' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                      {log.status === 'authorized' ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white text-sm">{log.user}</p>
                      <p className="text-xs text-gray-500">{log.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-800 dark:text-white">{log.action}</p>
                    <p className="text-xs text-gray-500">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'cameras' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockCameras.map((camera) => (
            <div key={camera.id} className="bg-white dark:bg-dark-card rounded-xl p-4 border border-gray-200 dark:border-dark-border">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary-500" />
                  <span className="font-medium text-gray-800 dark:text-white">{camera.name}</span>
                </div>
                <span className={`w-2 h-2 rounded-full ${camera.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`} />
              </div>
              <p className="text-sm text-gray-500 mb-3">{camera.location}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Last motion: {camera.lastMotion}</span>
                {camera.alerts > 0 && (
                  <span className="px-2 py-1 bg-red-500/10 text-red-500 rounded-full text-xs">
                    {camera.alerts} alerts
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'incidents' && (
        <div className="space-y-4">
          {mockIncidents.map((incident) => (
            <div key={incident.id} className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-dark-border">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${getSeverityColor(incident.severity)}`}>
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{incident.type}</h3>
                    <p className="text-gray-500 mt-1">{incident.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {incident.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {incident.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(incident.severity)}`}>
                    {incident.severity}
                  </span>
                  <p className="text-sm text-gray-500 mt-2 capitalize">{incident.status}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'access' && (
        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {mockAccessLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 font-medium text-gray-800 dark:text-white">{log.user}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{log.action}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{log.location}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{log.time}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      log.status === 'authorized' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'emergency' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {simulations.map((sim) => (
            <div key={sim.id} className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-dark-border">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${
                  sim.type === 'Fire' ? 'bg-red-500/10' :
                  sim.type === 'Flood' ? 'bg-blue-500/10' :
                  sim.type === 'Earthquake' ? 'bg-yellow-500/10' : 'bg-purple-500/10'
                }`}>
                  <AlertTriangle className={`w-6 h-6 ${
                    sim.type === 'Fire' ? 'text-red-500' :
                    sim.type === 'Flood' ? 'text-blue-500' :
                    sim.type === 'Earthquake' ? 'text-yellow-500' : 'text-purple-500'
                  }`} />
                </div>
                <span className={`w-2 h-2 rounded-full ${sim.status === 'active' ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{sim.type} Simulation</h3>
              <p className="text-sm text-gray-500 mb-4">Last run: {sim.lastRun}</p>
              {sim.status === 'active' ? (
                <button
                  onClick={() => stopSimulation(sim.id)}
                  className="w-full py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center gap-2"
                >
                  <Pause className="w-4 h-4" />
                  Stop Simulation
                </button>
              ) : (
                <button
                  onClick={() => runSimulation(sim.id)}
                  className="w-full py-2 px-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Run Simulation
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
