/**
 * Prediction Model
 * Stores AI/ML predictions for maintenance, energy, and anomalies
 */

import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Prediction title is required'],
    trim: true
  },
  description: {
    type: String
  },
  // Type of prediction
  type: {
    type: String,
    required: true,
    enum: [
      'equipment_failure',
      'power_overload',
      'water_leakage',
      'energy_optimization',
      'crowd_prediction',
      'anomaly_detection',
      'maintenance_prediction',
      'risk_assessment'
    ]
  },
  // Prediction result
  prediction: {
    result: mongoose.Schema.Types.Mixed,
    confidence: {
      type: Number,
      min: 0,
      max: 100
    },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'low'
    }
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
  equipment: {
    type: String
  },
  // Input features used for prediction
  inputFeatures: {
    type: mongoose.Schema.Types.Mixed
  },
  // Model info
  model: {
    name: String,
    version: String,
    accuracy: Number
  },
  // Timeline
  predictedAt: {
    type: Date,
    default: Date.now
  },
  predictedFor: {
    type: Date // When the prediction is expected to occur
  },
  // Actual vs predicted (for model evaluation)
  actual: {
    type: mongoose.Schema.Types.Mixed
  },
  evaluatedAt: {
    type: Date
  },
  // Status
  status: {
    type: String,
    enum: ['pending', 'active', 'confirmed', 'false_positive', 'resolved'],
    default: 'pending'
  },
  // Recommendation
  recommendation: {
    type: String
  },
  // Impact assessment
  impact: {
    severity: String,
    affectedSystems: [String],
    estimatedCost: Number
  },
  // Related alerts
  relatedAlerts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Alert'
  }]
}, {
  timestamps: true
});

// Indexes
predictionSchema.index({ building: 1, type: 1 });
predictionSchema.index({ predictedAt: -1 });
predictionSchema.index({ status: 1 });
predictionSchema.index({ riskLevel: 1 });

const Prediction = mongoose.model('Prediction', predictionSchema);

export default Prediction;
