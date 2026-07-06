/**
 * EnergyLog Model
 * Tracks energy consumption across campus buildings
 */

import mongoose from 'mongoose';

const energyLogSchema = new mongoose.Schema({
  building: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Building',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  // Energy metrics
  electricity: {
    usage: {
      type: Number,
      default: 0 // kWh
    },
    cost: {
      type: Number,
      default: 0 // in currency
    },
    peakDemand: {
      type: Number,
      default: 0 // kW
    }
  },
  water: {
    usage: {
      type: Number,
      default: 0 // cubic meters
    },
    cost: {
      type: Number,
      default: 0
    }
  },
  // HVAC metrics
  hvac: {
    cooling: { type: Number, default: 0 },
    heating: { type: Number, default: 0 },
    fan: { type: Number, default: 0 }
  },
  // Solar generation
  solarGenerated: {
    type: Number,
    default: 0 // kWh
  },
  solarSavings: {
    type: Number,
    default: 0
  },
  // Carbon footprint
  carbonEmissions: {
    type: Number,
    default: 0 // kg CO2
  },
  // Renewable percentage
  renewablePercentage: {
    type: Number,
    default: 0
  },
  // Additional metrics
  occupancy: {
    type: Number,
    default: 0
  },
  temperature: {
    type: Number
  },
  // Time period
  period: {
    type: String,
    enum: ['hourly', 'daily', 'weekly', 'monthly'],
    default: 'hourly'
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
energyLogSchema.index({ building: 1, timestamp: -1 });
energyLogSchema.index({ timestamp: -1 });

const EnergyLog = mongoose.model('EnergyLog', energyLogSchema);

export default EnergyLog;
