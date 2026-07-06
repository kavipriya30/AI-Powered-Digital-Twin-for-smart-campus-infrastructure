/**
 * Prediction Controller
 * Handles AI/ML predictions for maintenance, energy, and anomalies
 */

import Prediction from '../models/Prediction.js';
import Building from '../models/Building.js';
import axios from 'axios';

/**
 * @desc    Get all predictions
 * @route   GET /api/predictions
 * @access  Private
 */
export const getPredictions = async (req, res) => {
  try {
    const { type, riskLevel, status, building, limit = 50 } = req.query;
    
    let query = {};
    
    if (type) query.type = type;
    if (riskLevel) query.prediction_riskLevel = riskLevel;
    if (status) query.status = status;
    if (building) query.building = building;

    const predictions = await Prediction.find(query)
      .populate('building', 'name code')
      .populate('sensor', 'name sensorId type')
      .sort({ predictedAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: predictions.length,
      predictions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching predictions',
      error: error.message
    });
  }
};

/**
 * @desc    Get single prediction
 * @route   GET /api/predictions/:id
 * @access  Private
 */
export const getPrediction = async (req, res) => {
  try {
    const prediction = await Prediction.findById(req.params.id)
      .populate('building', 'name code coordinates')
      .populate('sensor', 'name sensorId type')
      .populate('relatedAlerts');

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: 'Prediction not found'
      });
    }

    res.status(200).json({
      success: true,
      prediction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching prediction',
      error: error.message
    });
  }
};

/**
 * @desc    Get prediction statistics
 * @route   GET /api/predictions/stats
 * @access  Private
 */
export const getPredictionStats = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const stats = await Prediction.aggregate([
      { $match: { predictedAt: { $gte: startDate } } },
      {
        $group: {
          _id: '$type',
          total: { $sum: 1 },
          highRisk: {
            $sum: { $cond: [{ $eq: ['$prediction.riskLevel', 'high'] }, 1, 0] }
          },
          criticalRisk: {
            $sum: { $cond: [{ $eq: ['$prediction.riskLevel', 'critical'] }, 1, 0] }
          },
          confirmed: {
            $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
          },
          falsePositives: {
            $sum: { $sum: { $cond: [{ $eq: ['$status', 'false_positive'] }, 1, 0] } }
          }
        }
      }
    ]);

    // Get high/critical risk predictions
    const activeRisks = await Prediction.find({
      status: 'pending',
      'prediction.riskLevel': { $in: ['high', 'critical'] }
    })
      .populate('building', 'name code')
      .sort({ 'prediction.confidence': -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      stats,
      activeRisks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching prediction statistics',
      error: error.message
    });
  }
};

/**
 * @desc    Get predictive maintenance predictions
 * @route   GET /api/predictions/maintenance
 * @access  Private
 */
export const getMaintenancePredictions = async (req, res) => {
  try {
    const predictions = await Prediction.find({ type: 'equipment_failure' })
      .populate('building', 'name code')
      .sort({ predictedAt: -1 })
      .limit(20);

    // Group by risk level
    const byRisk = {
      low: predictions.filter(p => p.prediction?.riskLevel === 'low'),
      medium: predictions.filter(p => p.prediction?.riskLevel === 'medium'),
      high: predictions.filter(p => p.prediction?.riskLevel === 'high'),
      critical: predictions.filter(p => p.prediction?.riskLevel === 'critical')
    };

    res.status(200).json({
      success: true,
      predictions,
      byRisk
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching maintenance predictions',
      error: error.message
    });
  }
};

/**
 * @desc    Get energy optimization predictions
 * @route   GET /api/predictions/energy
 * @access  Private
 */
export const getEnergyPredictions = async (req, res) => {
  try {
    const predictions = await Prediction.find({ type: 'energy_optimization' })
      .populate('building', 'name code')
      .sort({ predictedAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      predictions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching energy predictions',
      error: error.message
    });
  }
};

/**
 * @desc    Get anomaly predictions
 * @route   GET /api/predictions/anomalies
 * @access  Private
 */
export const getAnomalyPredictions = async (req, res) => {
  try {
    const predictions = await Prediction.find({ 
      type: { $in: ['anomaly_detection', 'security'] }
    })
      .populate('building', 'name code')
      .sort({ predictedAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      predictions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching anomaly predictions',
      error: error.message
    });
  }
};

/**
 * @desc    Trigger AI prediction (calls external AI service)
 * @route   POST /api/predictions/generate
 * @access  Private
 */
export const generatePrediction = async (req, res) => {
  try {
    const { type, buildingId, sensorId, inputFeatures } = req.body;

    // Call external AI service (if available)
    let aiResult = null;
    try {
      const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/predict`, {
        type,
        buildingId,
        sensorId,
        features: inputFeatures
      });
      aiResult = aiResponse.data;
    } catch (aiError) {
      // Fallback to mock prediction if AI service unavailable
      console.log('AI service unavailable, using mock prediction');
    }

    // Create prediction record
    const prediction = await Prediction.create({
      title: `AI ${type} prediction`,
      description: aiResult?.description || 'Automated prediction based on current sensor data',
      type,
      building: buildingId,
      sensor: sensorId,
      inputFeatures,
      prediction: aiResult || generateMockPrediction(type),
      model: {
        name: aiResult?.modelName || 'mock-model',
        version: '1.0.0',
        accuracy: aiResult?.accuracy || 85
      },
      predictedFor: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours ahead
    });

    res.status(201).json({
      success: true,
      prediction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating prediction',
      error: error.message
    });
  }
};

/**
 * @desc    Update prediction status
 * @route   PUT /api/predictions/:id/status
 * @access  Private
 */
export const updatePredictionStatus = async (req, res) => {
  try {
    const { status, actual } = req.body;
    
    const prediction = await Prediction.findById(req.params.id);

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: 'Prediction not found'
      });
    }

    prediction.status = status;
    if (actual) {
      prediction.actual = actual;
      prediction.evaluatedAt = Date.now();
    }

    await prediction.save();

    res.status(200).json({
      success: true,
      prediction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating prediction status',
      error: error.message
    });
  }
};

/**
 * @desc    Get campus risk assessment
 * @route   GET /api/predictions/risk-assessment
 * @access  Private
 */
export const getCampusRiskAssessment = async (req, res) => {
  try {
    // Get all pending high/critical predictions
    const highRiskPredictions = await Prediction.find({
      status: 'pending',
      'prediction.riskLevel': { $in: ['high', 'critical'] }
    }).populate('building', 'name code');

    // Calculate risk scores by building
    const buildingRisks = {};
    highRiskPredictions.forEach(pred => {
      const buildingId = pred.building?._id?.toString();
      if (!buildingRisks[buildingId]) {
        buildingRisks[buildingId] = {
          building: pred.building,
          riskScore: 0,
          predictions: []
        };
      }
      
      const riskWeight = pred.prediction?.riskLevel === 'critical' ? 2 : 1;
      buildingRisks[buildingId].riskScore += riskWeight * (pred.prediction?.confidence || 50) / 100;
      buildingRisks[buildingId].predictions.push(pred);
    });

    // Overall campus risk
    const totalRiskScore = Object.values(buildingRisks).reduce((sum, br) => sum + br.riskScore, 0);
    const campusRiskLevel = totalRiskScore > 10 ? 'critical' : 
                          totalRiskScore > 5 ? 'high' : 
                          totalRiskScore > 2 ? 'medium' : 'low';

    res.status(200).json({
      success: true,
      riskAssessment: {
        overallRisk: campusRiskScore,
        riskLevel: campusRiskLevel,
        highRiskBuildings: Object.values(buildingRisks).sort((a, b) => b.riskScore - a.riskScore),
        totalPredictions: highRiskPredictions.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching risk assessment',
      error: error.message
    });
  }
};

// Helper function to generate mock predictions
function generateMockPrediction(type) {
  const riskLevels = ['low', 'medium', 'high', 'critical'];
  const randomRisk = riskLevels[Math.floor(Math.random() * riskLevels.length)];
  const confidence = Math.floor(Math.random() * 30) + 70; // 70-100%

  const mockPredictions = {
    equipment_failure: {
      result: {
        equipment: 'HVAC Unit',
        estimatedFailureDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000),
        probability: confidence
      },
      confidence,
      riskLevel: randomRisk,
      recommendation: 'Schedule preventive maintenance within the next 48 hours'
    },
    power_overload: {
      result: {
        expectedLoad: Math.floor(Math.random() * 50) + 80,
        threshold: 100,
        timeToOverload: Math.floor(Math.random() * 4) + 1
      },
      confidence,
      riskLevel: randomRisk,
      recommendation: 'Consider load shedding or grid support'
    },
    energy_optimization: {
      result: {
        currentEfficiency: Math.floor(Math.random() * 20) + 75,
        potentialSavings: Math.floor(Math.random() * 30) + 10
      },
      confidence: confidence - 10,
      riskLevel: 'low',
      recommendation: 'Optimize HVAC schedules based on occupancy patterns'
    },
    anomaly_detection: {
      result: {
        anomalyType: 'unusual_movement',
        location: 'Building Entrance',
        confidence
      },
      confidence,
      riskLevel: randomRisk,
      recommendation: 'Review security footage'
    }
  };

  return mockPredictions[type] || mockPredictions.equipment_failure;
}
