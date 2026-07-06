/**
 * Alert Model
 * Stores alerts and notifications from the digital twin system
 */

import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Alert title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Alert description is required']
  },
  severity: {
    type: String,
    required: true,
    enum: ['info', 'warning', 'critical', 'emergency'],
    default: 'info'
  },
  category: {
    type: String,
    required: true,
    enum: [
      'infrastructure',
      'energy',
      'security',
      'maintenance',
      'environmental',
      'crowd',
      'emergency',
      'system',
      'ai_prediction'
    ]
  },
  // Related entities
  building: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Building'
  },
  sensor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sensor'
  },
  // Location info
  location: {
    building: String,
    floor: String,
    room: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  // Alert data
  value: {
    type: Number
  },
  threshold: {
    type: Number
  },
  unit: {
    type: String
  },
  // Status
  status: {
    type: String,
    enum: ['active', 'acknowledged', 'resolved', 'dismissed'],
    default: 'active'
  },
  // Resolution
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedAt: {
    type: Date
  },
  resolution: {
    type: String
  },
  // Acknowledgment
  acknowledgedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  acknowledgedAt: {
    type: Date
  },
  // Priority (for sorting)
  priority: {
    type: Number,
    default: 0
  },
  // Tags for filtering
  tags: [{
    type: String
  }],
  // Source of alert
  source: {
    type: String,
    enum: ['sensor', 'ai', 'manual', 'system', 'simulation'],
    default: 'system'
  },
  // Related predictions
  relatedPrediction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prediction'
  },
  // Timestamps
  triggeredAt: {
    type: Date,
    default: Date.now
  },
  // UI flags
  isRead: {
    type: Boolean,
    default: false
  },
  notifyEmail: {
    type: Boolean,
    default: false
  },
  notifySMS: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
alertSchema.index({ status: 1, severity: 1 });
alertSchema.index({ building: 1, createdAt: -1 });
alertSchema.index({ triggeredAt: -1 });
alertSchema.index({ isRead: 1 });

const Alert = mongoose.model('Alert', alertSchema);

export default Alert;
