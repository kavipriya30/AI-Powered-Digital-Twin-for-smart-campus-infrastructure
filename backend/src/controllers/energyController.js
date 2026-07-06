/**
 * Energy Controller
 * Handles energy consumption tracking and optimization
 */

import EnergyLog from '../models/EnergyLog.js';
import Building from '../models/Building.js';

/**
 * @desc    Get energy logs
 * @route   GET /api/energy
 * @access  Private
 */
export const getEnergyLogs = async (req, res) => {
  try {
    const { building, period, startDate, endDate, limit = 100 } = req.query;
    
    let query = {};
    
    if (building) query.building = building;
    if (period) query.period = period;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const logs = await EnergyLog.find(query)
      .populate('building', 'name code type')
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching energy logs',
      error: error.message
    });
  }
};

/**
 * @desc    Get energy summary
 * @route   GET /api/energy/summary
 * @access  Private
 */
export const getEnergySummary = async (req, res) => {
  try {
    const { period = 'daily', building } = req.query;
    
    let matchQuery = {};
    if (building) matchQuery.building = building;

    // Get aggregated data
    const summary = await EnergyLog.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalElectricity: { $sum: '$electricity.usage' },
          totalWater: { $sum: '$water.usage' },
          totalCost: { $sum: { $add: ['$electricity.cost', '$water.cost'] } },
          totalSolarGenerated: { $sum: '$solarGenerated' },
          totalCarbonEmissions: { $sum: '$carbonEmissions' },
          avgRenewablePercentage: { $avg: '$renewablePercentage' },
          avgOccupancy: { $avg: '$occupancy' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get building-wise breakdown
    const byBuilding = await EnergyLog.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$building',
          totalElectricity: { $sum: '$electricity.usage' },
          totalWater: { $sum: '$water.usage' },
          totalCost: { $sum: { $add: ['$electricity.cost', '$water.cost'] } },
          totalSolarGenerated: { $sum: '$solarGenerated' }
        }
      },
      {
        $lookup: {
          from: 'buildings',
          localField: '_id',
          foreignField: '_id',
          as: 'building'
        }
      },
      { $unwind: '$building' },
      {
        $project: {
          buildingName: '$building.name',
          buildingCode: '$building.code',
          totalElectricity: 1,
          totalWater: 1,
          totalCost: 1,
          totalSolarGenerated: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      summary: summary[0] || {
        totalElectricity: 0,
        totalWater: 0,
        totalCost: 0,
        totalSolarGenerated: 0,
        totalCarbonEmissions: 0,
        avgRenewablePercentage: 0,
        avgOccupancy: 0,
        count: 0
      },
      byBuilding
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching energy summary',
      error: error.message
    });
  }
};

/**
 * @desc    Get energy by building
 * @route   GET /api/energy/building/:buildingId
 * @access  Private
 */
export const getEnergyByBuilding = async (req, res) => {
  try {
    const { startDate, endDate, limit = 24 } = req.query;
    
    let query = { building: req.params.buildingId };
    
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const logs = await EnergyLog.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    const building = await Building.findById(req.params.buildingId);

    res.status(200).json({
      success: true,
      building: building ? { name: building.name, code: building.code } : null,
      count: logs.length,
      logs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching building energy data',
      error: error.message
    });
  }
};

/**
 * @desc    Create energy log
 * @route   POST /api/energy
 * @access  Private
 */
export const createEnergyLog = async (req, res) => {
  try {
    const log = await EnergyLog.create(req.body);

    res.status(201).json({
      success: true,
      log
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating energy log',
      error: error.message
    });
  }
};

/**
 * @desc    Get real-time energy data
 * @route   GET /api/energy/realtime
 * @access  Private
 */
export const getRealTimeEnergy = async (req, res) => {
  try {
    // Get latest reading for each building
    const latestData = await EnergyLog.aggregate([
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: '$building',
          latestLog: { $first: '$$ROOT' }
        }
      },
      {
        $lookup: {
          from: 'buildings',
          localField: '_id',
          foreignField: '_id',
          as: 'building'
        }
      },
      { $unwind: '$building' },
      {
        $project: {
          buildingId: '$_id',
          buildingName: '$building.name',
          buildingCode: '$building.code',
          timestamp: '$latestLog.timestamp',
          electricity: '$latestLog.electricity',
          water: '$latestLog.water',
          solarGenerated: '$latestLog.solarGenerated',
          renewablePercentage: '$latestLog.renewablePercentage'
        }
      }
    ]);

    // Calculate totals
    const totals = latestData.reduce((acc, item) => {
      acc.electricity += item.electricity?.usage || 0;
      acc.water += item.water?.usage || 0;
      acc.solar += item.solarGenerated || 0;
      return acc;
    }, { electricity: 0, water: 0, solar: 0 });

    res.status(200).json({
      success: true,
      buildings: latestData,
      totals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching real-time energy data',
      error: error.message
    });
  }
};

/**
 * @desc    Get energy optimization suggestions
 * @route   GET /api/energy/optimization
 * @access  Private
 */
export const getEnergyOptimization = async (req, res) => {
  try {
    // Analyze energy patterns and provide AI suggestions
    const buildings = await Building.find({ isActive: true });
    
    const suggestions = [];
    
    for (const building of buildings) {
      const recentLogs = await EnergyLog.find({ building: building._id })
        .sort({ timestamp: -1 })
        .limit(24);
      
      if (recentLogs.length > 0) {
        const avgUsage = recentLogs.reduce((sum, log) => sum + (log.electricity?.usage || 0), 0) / recentLogs.length;
        const avgOccupancy = recentLogs.reduce((sum, log) => sum + (log.occupancy || 0), 0) / recentLogs.length;
        
        // Peak usage detection
        const peakUsage = Math.max(...recentLogs.map(log => log.electricity?.peakDemand || 0));
        
        if (peakUsage > 100) {
          suggestions.push({
            building: building.name,
            type: 'peak_load',
            priority: 'high',
            suggestion: `Consider implementing peak load balancing to reduce demand charges. Current peak: ${peakUsage}kW`,
            potentialSavings: Math.round(peakUsage * 0.1 * 0.15) // Assume 10% reduction, $0.15/kWh
          });
        }
        
        // Low occupancy detection
        if (avgOccupancy < 20 && avgUsage > 50) {
          suggestions.push({
            building: building.name,
            type: 'low_occupancy',
            priority: 'medium',
            suggestion: `Low occupancy (${Math.round(avgOccupancy)}%) detected. Consider reducing HVAC in unoccupied zones.`,
            potentialSavings: Math.round(avgUsage * 0.15)
          });
        }
        
        // Solar potential
        if (!building.facilities?.includes('solar_panels')) {
          suggestions.push({
            building: building.name,
            type: 'solar_installation',
            priority: 'low',
            suggestion: `Consider installing solar panels on ${building.name} to reduce grid dependency.`,
            potentialSavings: Math.round(avgUsage * 0.3 * 0.15)
          });
        }
      }
    }

    res.status(200).json({
      success: true,
      suggestions: suggestions.sort((a, b) => {
        const priority = { high: 0, medium: 1, low: 2 };
        return priority[a.priority] - priority[b.priority];
      })
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating optimization suggestions',
      error: error.message
    });
  }
};

/**
 * @desc    Get energy trends
 * @route   GET /api/energy/trends
 * @access  Private
 */
export const getEnergyTrends = async (req, res) => {
  try {
    const { days = 7, building } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    let matchQuery = { timestamp: { $gte: startDate } };
    if (building) matchQuery.building = building;

    const trends = await EnergyLog.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
          },
          totalElectricity: { $sum: '$electricity.usage' },
          totalWater: { $sum: '$water.usage' },
          totalCost: { $sum: { $add: ['$electricity.cost', '$water.cost'] } },
          totalSolarGenerated: { $sum: '$solarGenerated' },
          totalCarbonEmissions: { $sum: '$carbonEmissions' },
          avgRenewablePercentage: { $avg: '$renewablePercentage' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      trends
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching energy trends',
      error: error.message
    });
  }
};
