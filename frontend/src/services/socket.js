import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (this.socket?.connected) return;

    this.socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Join rooms
  joinCampus() {
    this.socket?.emit('join:campus');
  }

  leaveCampus() {
    this.socket?.emit('leave:campus');
  }

  joinBuilding(buildingId) {
    this.socket?.emit('join:building', buildingId);
  }

  leaveBuilding(buildingId) {
    this.socket?.emit('leave:building', buildingId);
  }

  joinAlerts() {
    this.socket?.emit('join:alerts');
  }

  joinEnergy() {
    this.socket?.emit('join:energy');
  }

  joinSensors() {
    this.socket?.emit('join:sensors');
  }

  // Subscribe to specific sensor
  subscribeSensor(sensorId) {
    this.socket?.emit('subscribe:sensor', sensorId);
  }

  unsubscribeSensor(sensorId) {
    this.socket?.emit('unsubscribe:sensor', sensorId);
  }

  // Event listeners
  on(event, callback) {
    this.socket?.on(event, callback);
    
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    this.socket?.off(event, callback);
    
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Specific event handlers
  onSensorUpdate(callback) {
    this.on('sensor:update', callback);
  }

  onBuildingUpdate(callback) {
    this.on('building:update', callback);
  }

  onAlert(callback) {
    this.on('alert:new', callback);
  }

  onEnergyUpdate(callback) {
    this.on('energy:update', callback);
  }

  onPrediction(callback) {
    this.on('prediction:new', callback);
  }

  onCampusUpdate(callback) {
    this.on('campus:update', callback);
  }

  onEmergencyAlert(callback) {
    this.on('emergency:alert', callback);
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
export default socketService;
