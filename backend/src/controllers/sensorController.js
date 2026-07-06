/**
 * Sensor Controller
 * Handles sensor CRUD operations and real-time data
 */

import Sensor from '../models/Sensor.js';
import Building from '../models/Building.js';
import Alert from '../models/Alert.js';

/**
 * @desc    Get all sensors
 * @route   GET /api/sensors
 * @access  Private
 */
export const getSensors = async (req, res) => {
  try {
    const { building, type, status } = req.query;
    
    let query = {};
    
    if (building) query.building = building;
    if (type) query.type = type;
    if (status) query.status = status;

    const sensors = await Sensor.find(query)
      .populate('building', 'name code')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: sensors.length,
      sensors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sensors',
      error: error.message
    });
  }
};

/**
 * @desc    Get single sensor
 * @route   GET /api/sensors/:id
 * @access  Private
 */
export const getSensor = async (req, res) => {
  try {
    const sensor = await Sensor.findById(req.params.id)
      .populate('building', 'name code coordinates');

    if (!sensor) {
      return res.status(404).json({
        success: false,
        message: 'Sensor not found'
      });
    }

    res.status(200).json({
      success: true,
      sensor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sensor',
      error: error.message
    });
  }
};

/**
 * @desc    Create new sensor
 * @route   POST /api/sensors
 * @access  Private/Admin
 */
export const createSensor = async (req, res) => {
  try {
    const sensor = await Sensor.create(req.body);

    res.status(201).json({
      success: true,
      sensor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating sensor',
      error: error.message
    });
  }
};

/**
 * @desc    Update sensor
 * @route   PUT /api/sensors/:id
 * @access  Private/Admin
 */
export const updateSensor = async (req, res) => {
  try {
    const sensor = await Sensor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!sensor) {
      return res.status(404).json({
        success: false,
        message: 'Sensor not found'
      });
    }

    res.status(200).json({
      success: true,
      sensor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating sensor',
      error: error.message
    });
  }
};

/**
 * @desc    Delete sensor
 * @route   DELETE /api/sensors/:id
 * @access  Private/Admin
 */
export const deleteSensor = async (req, res) => {
  try {
    const sensor = await Sensor.findById(req.params.id);

    if (!sensor) {
      return res.status(404).json({
        success: false,
        message: 'Sensor not found'
      });
    }

    await sensor.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Sensor deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting sensor',
      error: error.message
    });
  }
};

/**
 * @desc    Update sensor reading
 * @route   PUT /api/sensors/:id/readings
 * @access  Private
 */
export const updateReading = async (req, res) => {
  try {
    const { value } = req.body;
    
    const sensor = await Sensor.findById(req.params.id);

    if (!sensor) {
      return res.status(404).json({
        success: false,
        message: 'Sensor not found'
      });
    }

    // Update current value and timestamp
    sensor.currentValue = value;
    sensor.lastReading = Date.now();
    
    // Add to last readings array (keep last 100)
    sensor.lastReadings.push({
      value,
      timestamp: Date.now()
    });
    
    if (sensor.lastReadings.length > 100) {
      sensor.lastReadings = sensor.lastReadings.slice(-100);
    }

    await sensor.save();

    // Check thresholds and create alert if needed
    if (sensor.thresholds) {
      let alertCreated = false;
      let alertData = {};

      if (sensor.thresholds.criticalMax && value > sensor.thresholds.criticalMax) {
        alertCreated = true;
        alertData = {
          title: `Critical: ${sensor.name} reading above critical threshold`,
          description: `Sensor ${sensor.name} (${sensor.sensorId}) recorded value ${value}${sensor.unit} which exceeds critical maximum of ${sensor.thresholds.criticalMax}${sensor.unit}`,
          severity: 'critical',
          category: 'infrastructure',
          building: sensor.building,
          sensor: sensor._id,
          value,
          threshold: sensor.thresholds.criticalMax,
          unit: sensor.unit,
          source: 'sensor'
        };
      } else if (sensor.thresholds.criticalMin && value < sensor.thresholds.criticalMin) {
        alertCreated = true;
        alertData = {
          title: `Critical: ${sensor.name} reading below critical threshold`,
          description: `Sensor ${sensor.name} (${sensor.sensorId}) recorded value ${value}${sensor.unit} which is below critical minimum of ${sensor.thresholds.criticalMin}${sensor.unit}`,
          severity: 'critical',
          category: 'infrastructure',
          building: sensor.building,
          sensor: sensor._id,
          value,
          threshold: sensor.thresholds.criticalMin,
          unit: sensor.unit,
          source: 'sensor'
        };
      } else if (sensor.thresholds.max && value > sensor.thresholds.max) {
        alertCreated = true;
        alertData = {
          title: `Warning: ${sensor.name} above threshold`,
          description: `Sensor ${sensor.name} (${sensor.sensorId}) recorded value ${value}${sensor.unit} which exceeds threshold of ${sensor.thresholds.max}${sensor.unit}`,
          severity: 'warning',
          category: 'infrastructure',
          building: sensor.building,
          sensor: sensor._id,
          value,
          threshold: sensor.thresholds.max,
          unit: sensor.unit,
          source: 'sensor'
        };
      } else if (sensor.thresholds.min && value < sensor.thresholds.min) {
        alertCreated = true;
        alertData = {
          title: `Warning: ${sensor.name} below threshold`,
          description: `Sensor ${sensor.name} (${sensor.sensorId}) recorded value ${value}${sensor.unit} which is below threshold of ${sensor.thresholds.min}${sensor.unit}`,
          severity: 'warning',
          category: 'infrastructure',
          building: sensor.building,
          sensor: sensor._id,
          value,
          threshold: sensor.thresholds.min,
          unit: sensor.unit,
          source: 'sensor'
        };
      }

      if (alertCreated) {
        await Alert.create(alertData);
      }
    }

    res.status(200).json({
      success: true,
      sensor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating sensor reading',
      error: error.message
    });
  }
};

/**
 * @desc    Get sensor readings history
 * @route   GET /api/sensors/:id/history
 * @access  Private
 */
export const getSensorHistory = async (req, res) => {
  try {
    const { startDate, endDate, limit = 100 } = req.query;
    
    const sensor = await Sensor.findById(req.params.id);

    if (!sensor) {
      return res.status(404).json({
        success: false,
        message: 'Sensor not found'
      });
    }

    // Return embedded history (in production, would use separate collection)
    let readings = sensor.lastReadings || [];
    
    if (startDate || endDate) {
      readings = readings.filter(r => {
        const date = new Date(r.timestamp);
        if (startDate && date < new Date(startDate)) return false;
        if (endDate && date > new Date(endDate)) return false;
        return true;
      });
    }

    res.status(200).json({
      success: true,
      sensorId: sensor._id,
      sensorName: sensor.name,
      count: readings.length,
      readings: readings.slice(-parseInt(limit))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sensor history',
      error: error.message
    });
  }
};

/**
 * @desc    Get all sensor types
 * @route   GET /api/sensors/types
 * @access  Private
 */
export const getSensorTypes = async (req, res) => {
  try {
    const types = await Sensor.distinct('type');
    
    res.status(200).json({
      success: true,
      types
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sensor types',
      error: error.message
    });
  }
};

/**
 * @desc    Get sensors by building with aggregated data
 * @route   GET /api/sensors/building/:buildingId
 * @access  Private
 */
export const getSensorsByBuilding = async (req, res) => {
  try {
    const sensors = await Sensor.find({ building: req.params.buildingId })
      .populate('building', 'name code');

    // Group by type
    const sensorsByType = {};
    sensors.forEach(sensor => {
      if (!sensorsByType[sensor.type]) {
        sensorsByType[sensor.type] = [];
      }
      sensorsByType[sensor.type].push(sensor);
    });

    res.status(200).json({
      success: true,
      count: sensors.length,
      sensorsByType,
      sensors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sensors by building',
      error: error.message
    });
  }
};
