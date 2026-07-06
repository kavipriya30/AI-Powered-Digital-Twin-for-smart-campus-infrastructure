/**
 * Building Model
 * Represents campus buildings in the digital twin
 */

import mongoose from 'mongoose';

const buildingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Building name is required'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Building code is required'],
    unique: true,
    uppercase: true
  },
  description: {
    type: String,
    trim: true
  },
  floors: {
    type: Number,
    default: 1
  },
  yearBuilt: {
    type: Number
  },
  area: {
    type: Number, // in square meters
    default: 0
  },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  address: {
    type: String,
    trim: true
  },
  // Building type for categorization
  type: {
    type: String,
    enum: ['academic', 'administrative', 'residential', 'laboratory', 'library', 'sports', 'dining', 'other'],
    default: 'academic'
  },
  // Health status
  healthStatus: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor', 'critical'],
    default: 'good'
  },
  healthScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },
  // Risk assessment
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  },
  riskFactors: [{
    factor: String,
    score: Number,
    description: String
  }],
  // Current occupancy
  currentOccupancy: {
    type: Number,
    default: 0
  },
  maxOccupancy: {
    type: Number,
    default: 100
  },
  // Facilities available
  facilities: [{
    type: String,
    enum: ['elevator', 'hvac', 'fire_system', 'security_camera', 'wifi', 'smart_lighting', 'solar_panels']
  }],
  // 3D model reference
  modelUrl: {
    type: String,
    default: ''
  },
  // Image URL
  imageUrl: {
    type: String,
    default: ''
  },
  // Status flags
  isActive: {
    type: Boolean,
    default: true
  },
  lastInspection: {
    type: Date
  },
  nextInspection: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for geospatial queries
buildingSchema.index({ coordinates: '2dsphere' });

const Building = mongoose.model('Building', buildingSchema);

export default Building;
