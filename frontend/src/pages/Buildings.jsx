import { useState } from 'react';
import { Building2, MapPin, Users, Activity, AlertTriangle, Search, Filter, Grid, List } from 'lucide-react';

const mockBuildings = [
  { id: 1, name: 'Main Library', code: 'LIB', type: 'library', health: 95, status: 'excellent', occupancy: 78, floors: 4, sensors: 24, risk: 'low', lat: 40.7128, lng: -74.0060 },
  { id: 2, name: 'Engineering Block', code: 'ENG', type: 'academic', health: 82, status: 'good', occupancy: 92, floors: 5, sensors: 42, risk: 'low', lat: 40.7138, lng: -74.0070 },
  { id: 3, name: 'Student Center', code: 'STU', type: 'academic', health: 71, status: 'fair', occupancy: 65, floors: 3, sensors: 18, risk: 'medium', lat: 40.7148, lng: -74.0080 },
  { id: 4, name: 'Science Laboratory', code: 'SCI', type: 'laboratory', health: 88, status: 'good', occupancy: 45, floors: 2, sensors: 56, risk: 'low', lat: 40.7158, lng: -74.0090 },
  { id: 5, name: 'Admin Building', code: 'ADM', type: 'administrative', health: 96, status: 'excellent', occupancy: 30, floors: 2, sensors: 12, risk: 'low', lat: 40.7168, lng: -74.0100 },
  { id: 6, name: 'Sports Complex', code: 'SPT', type: 'sports', health: 79, status: 'good', occupancy: 40, floors: 1, sensors: 15, risk: 'low', lat: 40.7178, lng: -74.0110 },
  { id: 7, name: 'Medical Center', code: 'MED', type: 'laboratory', health: 91, status: 'excellent', occupancy: 25, floors: 3, sensors: 38, risk: 'low', lat: 40.7188, lng: -74.0120 },
  { id: 8, name: 'Dining Hall', code: 'DIN', type: 'dining', health: 68, status: 'fair', occupancy: 55, floors: 1, sensors: 8, risk: 'medium', lat: 40.7198, lng: -74.0130 }
];

export default function Buildings() {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'fair': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'text-green-500 bg-green-500/10';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10';
      case 'high': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const filteredBuildings = mockBuildings.filter(building => {
    const matchesSearch = building.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          building.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || building.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Buildings</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage and monitor campus buildings</p>
        </div>
        <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
          Add Building
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search buildings..."
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
          <option value="academic">Academic</option>
          <option value="administrative">Administrative</option>
          <option value="laboratory">Laboratory</option>
          <option value="library">Library</option>
          <option value="sports">Sports</option>
          <option value="dining">Dining</option>
        </select>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Building Cards */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredBuildings.map((building) => (
            <div key={building.id} className="bg-white dark:bg-dark-card rounded-xl p-5 border border-gray-200 dark:border-dark-border hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">{building.name}</h3>
                  <p className="text-sm text-gray-500">{building.code}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(building.status)}`} />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Health</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getStatusColor(building.status)}`}
                        style={{ width: `${building.health}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{building.health}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Occupancy</span>
                  <span className="text-sm font-medium">{building.occupancy}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Sensors</span>
                  <span className="text-sm font-medium">{building.sensors}</span>
                </div>

                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(building.risk)}`}>
                    {building.risk.toUpperCase()} RISK
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Building</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Health</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Occupancy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sensors</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredBuildings.map((building) => (
                <tr key={building.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(building.status)}`} />
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">{building.name}</p>
                        <p className="text-sm text-gray-500">{building.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400 capitalize">{building.type}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className={`h-2 rounded-full ${getStatusColor(building.status)}`} style={{ width: `${building.health}%` }} />
                      </div>
                      <span className="text-sm">{building.health}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{building.occupancy}%</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{building.sensors}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(building.risk)}`}>
                      {building.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
