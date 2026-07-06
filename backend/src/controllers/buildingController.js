/**
 * Building Controller
 * Handles building CRUD operations and health monitoring
 */

import Building from '../models/Building.js';
import Sensor from '../models/Sensor.js';
import EnergyLog from '../models/EnergyLog.js';
import Alert from '../models/Alert.js';

/**
 * @desc    Get all buildings
 * @route   GET /api/buildings
 * @access  Private
 */
export const getBuildings = async (req, res) => {
  try {
    const { status, type, riskLevel, search } = req.query;
    
    let query = { isActive: true };
    
    if (status) query.healthStatus = status;
    if (type) query.type = type;
    if (riskLevel) query.riskLevel = riskLevel;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } }
      ];
    }

    const buildings = await Building.find(query).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: buildings.length,
      buildings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching buildings',
      error: error.message
    });
  }
};

/**
 * @desc    Get single building
 * @route   GET /api/buildings/:id
 * @access  Private
 */
export const getBuilding = async (req, res) => {
  try {
    const building = await Building.findById(req.params.id);

    if (!building) {
      return res.status(404).json({
        success: false,
        message: 'Building not found'
      });
    }

    // Get related sensors
    const sensors = await Sensor.find({ building: building._id, status: 'active' });
    
    // Get recent alerts
    const alerts = await Alert.find({ 
      building: building._id,
      status: { $ne: 'resolved' }
    }).sort({ triggeredAt: -1 }).limit(10);

    // Get recent energy data
    const energyData = await EnergyLog.find({ building: building._id })
      .sort({ timestamp: -1 })
      .limit(24);

    res.status(200).json({
      success: true,
      building,
      sensors,
      alerts,
      energyData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching building',
      error: error.message
    });
  }
};

/**
 * @desc    Create new building
 * @route   POST /api/buildings
 * @access  Private/Admin
 */
export const createBuilding = async (req, res) => {
  try {
    const building = await Building.create(req.body);

    res.status(201).json({
      success: true,
      building
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating building',
      error: error.message
    });
  }
};

/**
 * @desc    Update building
 * @route   PUT /api/buildings/:id
 * @access  Private/Admin
 */
export const updateBuilding = async (req, res) => {
  try {
    const building = await Building.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!building) {
      return res.status(404).json({
        success: false,
        message: 'Building not found'
      });
    }

    res.status(200).json({
      success: true,
      building
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating building',
      error: error.message
    });
  }
};

/**
 * @desc    Delete building
 * @route   DELETE /api/buildings/:id
 * @access  Private/Admin
 */
export const deleteBuilding = async (req, res) => {
  try {
    const building = await Building.findById(req.params.id);

    if (!building) {
      return res.status(404).json({
        success: false,
        message: 'Building not found'
      });
    }

    // Soft delete
    building.isActive = false;
    await building.save();

    res.status(200).json({
      success: true,
      message: 'Building deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting building',
      error: error.message
    });
  }
};

/**
 * @desc    Get campus overview (all buildings summary)
 * @route   GET /api/buildings/overview
 * @access  Private
 */
export const getCampusOverview = async (req, res) => {
  try {
    const buildings = await Building.find({ isActive: true });
    
    const overview = {
      totalBuildings: buildings.length,
      averageHealthScore: 0,
      buildingsByStatus: {
        excellent: 0,
        good: 0,
        fair: 0,
        poor: 0,
        critical: 0
      },
      buildingsByRisk: {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0
      },
      totalOccupancy: 0,
      maxOccupancy: 0,
      buildingsByType: {}
    };

    let totalHealthScore = 0;

    buildings.forEach(building => {
      totalHealthScore += building.healthScore;
      overview.buildingsByStatus[building.healthStatus]++;
      overview.buildingsByRisk[building.riskLevel]++;
      overview.totalOccupancy += building.currentOccupancy;
      overview.maxOccupancy += building.maxOccupancy;
      
      if (!overview.buildingsByType[building.type]) {
        overview.buildingsByType[building.type] = 0;
      }
      overview.buildingsByType[building.type]++;
    });

    overview.averageHealthScore = buildings.length > 0 
      ? Math.round(totalHealthScore / buildings.length) 
      : 0;

    res.status(200).json({
      success: true,
      overview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching campus overview',
      error: error.message
    });
  }
};

/**
 * @desc    Update building health status
 * @route   PUT /api/buildings/:id/health
 * @access  Private
 */
export const updateBuildingHealth = async (req, res) => {
  try {
    const { healthStatus, healthScore, riskLevel, riskFactors } = req.body;
    
    const building = await Building.findById(req.params.id);

    if (!building) {
      return res.status(404).json({
        success: false,
        message: 'Building not found'
      });
    }

    if (healthStatus) building.healthStatus = healthStatus;
    if (healthScore) building.healthScore = healthScore;
    if (riskLevel) building.riskLevel = riskLevel;
    if (riskFactors) building.riskFactors = riskFactors;

    await building.save();

    res.status(200).json({
      success: true,
      building
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating building health',
      error: error.message
    });
  }
};

/**
 * @desc    Get building 3D model data
 * @route   GET /api/buildings/:id/model
 * @access  Private
 */
export const getBuildingModel = async (req, res) => {
  try {
    const building = await Building.findById(req.params.id);

    if (!building) {
      return res.status(404).json({
        success: false,
        message: 'Building not found'
      });
    }

    // Return simplified 3D model data
    const modelData = {
      id: building._id,
      name: building.name,
      code: building.code,
      coordinates: building.coordinates,
      floors: building.floors,
      area: building.area,
      healthStatus: building.healthStatus,
      healthScore: building.healthScore,
      riskLevel: building.riskLevel,
      facilities: building.facilities,
      currentOccupancy: building.currentOccupancy,
      maxOccupancy: building.maxOccupancy,
      // 3D specific properties
      boundingBox: {
        width: Math.sqrt(building.area),
        depth: Math.sqrt(building.area),
        height: building.floors * 4 // Assume 4m per floor
      }
    };

    res.status(200).json({
      success: true,
      model: modelData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching building model',
      error: error.message
    });
  }
};
