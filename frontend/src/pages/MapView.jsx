import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Building2, Search, Layers, ZoomIn, ZoomOut, Locate, AlertTriangle } from 'lucide-react';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const mockBuildings = [
  { id: 1, name: 'Main Library', code: 'LIB', lat: 40.7128, lng: -74.0060, health: 95, occupancy: 78, alerts: 0 },
  { id: 2, name: 'Engineering Block', code: 'ENG', lat: 40.7138, lng: -74.0070, health: 82, occupancy: 92, alerts: 1 },
  { id: 3, name: 'Student Center', code: 'STU', lat: 40.7148, lng: -74.0080, health: 71, occupancy: 65, alerts: 2 },
  { id: 4, name: 'Science Lab', code: 'SCI', lat: 40.7158, lng: -74.0090, health: 88, occupancy: 45, alerts: 0 },
  { id: 5, name: 'Admin Building', code: 'ADM', lat: 40.7168, lng: -74.0100, health: 96, occupancy: 30, alerts: 0 },
  { id: 6, name: 'Sports Complex', code: 'SPT', lat: 40.7178, lng: -74.0110, health: 79, occupancy: 40, alerts: 0 }
];

const getHealthColor = (health) => {
  if (health >= 90) return '#10b981';
  if (health >= 70) return '#3b82f6';
  if (health >= 50) return '#f59e0b';
  return '#ef4444';
};

function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function MapView() {
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [mapStyle, setMapStyle] = useState('dark');
  const [center, setCenter] = useState([40.7148, -74.008]);
  const [zoom, setZoom] = useState(16);

  const filteredBuildings = mockBuildings.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBuildingClick = (building) => {
    setSelectedBuilding(building);
    setCenter([building.lat, building.lng]);
    setZoom(17);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Campus Map</h1>
          <p className="text-gray-500 dark:text-gray-400">Interactive digital twin map view</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMapStyle(mapStyle === 'dark' ? 'light' : 'dark')}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center gap-2"
          >
            <Layers className="w-4 h-4" />
            {mapStyle === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Search */}
          <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-gray-200 dark:border-dark-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search buildings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-white"
              />
            </div>
          </div>

          {/* Building List */}
          <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-800 dark:text-white">Buildings ({mockBuildings.length})</h3>
            </div>
            <div className="max-h-[500px] overflow-y-auto">
              {filteredBuildings.map((building) => (
                <button
                  key={building.id}
                  onClick={() => handleBuildingClick(building)}
                  className={`w-full p-3 text-left border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    selectedBuilding?.id === building.id ? 'bg-primary-500/10' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">{building.name}</p>
                      <p className="text-sm text-gray-500">{building.code}</p>
                    </div>
                    {building.alerts > 0 && (
                      <span className="px-2 py-1 bg-red-500/10 text-red-500 rounded-full text-xs">
                        {building.alerts}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>Health: {building.health}%</span>
                    <span>Occupancy: {building.occupancy}%</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden" style={{ height: '600px' }}>
            <MapContainer
              center={center}
              zoom={zoom}
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
            >
              <MapController center={center} zoom={zoom} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url={mapStyle === 'dark' 
                  ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                  : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
                }
              />
              {mockBuildings.map((building) => (
                <Marker
                  key={building.id}
                  position={[building.lat, building.lng]}
                  eventHandlers={{
                    click: () => handleBuildingClick(building),
                  }}
                >
                  <Popup>
                    <div className="p-2 min-w-[150px]">
                      <h3 className="font-semibold">{building.name}</h3>
                      <p className="text-sm text-gray-500">{building.code}</p>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm">Health: {building.health}%</p>
                        <p className="text-sm">Occupancy: {building.occupancy}%</p>
                        {building.alerts > 0 && (
                          <p className="text-sm text-red-500">{building.alerts} active alerts</p>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-gray-200 dark:border-dark-border">
        <h3 className="font-medium text-gray-800 dark:text-white mb-3">Legend</h3>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Excellent (90%+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Good (70-89%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Fair (50-69%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Poor ({"<50%"})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
