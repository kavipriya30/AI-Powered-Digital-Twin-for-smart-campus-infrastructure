/**
 * Sensor Model
 * Represents IoT sensors across campus buildings
 */

import mongoose from 'mongoose';

const sensorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Sensor name is required'],
    trim: true
  },
  sensorId: {
    type: String,
    required: [true, 'Sensor ID is required'],
    unique: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'temperature',
      'humidity',
      'electricity',
      'water',
      'motion',
      'smoke',
      'fire',
      'co2',
      'light',
      'occupancy',
      'vibration',
      'pressure',
      'energy',
      'power',
      'wifi_signal',
      'elevator_status',
      'hvac_status'
    ]
  },
  building: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Building',
    required: true
  },
  location: {
    floor: String,
    room: String,
    zone: String
  },
  // Current reading
  currentValue: {
    type: Number,
    default: 0
  },
  unit: {
    type: String,
    default: ''
  },
  // Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance', 'error'],
    default: 'active'
  },
  // Thresholds
  thresholds: {
    min: Number,
    max: Number,
    criticalMin: Number,
    criticalMax: Number
  },
  // Last reading time
  lastReading: {
    type: Date
  },
  // Metadata
  manufacturer: {
    type: String
  },
  model: {
    type: String
  },
  installDate: {
    type: Date,
    default: Date.now
  },
  // Battery level for wireless sensors
  batteryLevel: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },
  // Connectivity
  connectivity: {
    type: String,
    enum: ['wired', 'wireless', 'iot'],
    default: 'wired'
  },
  // Reading history (embedded for quick access)
  lastReadings: [{
    value: Number,
    timestamp: Date
  }]
}, {
  timestamps: true
});

// Index for efficient queries
sensorSchema.index({ building: 1, type: 1 });
sensorSchema.index({ status: 1 });
sensorSchema.index({ lastReading: 1 });

const Sensor = mongoose.model('Sensor', sensorSchema);

export default Sensor;
