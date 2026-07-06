/**
 * Alert Controller
 * Handles alert CRUD operations and management
 */

import Alert from '../models/Alert.js';

/**
 * @desc    Get all alerts
 * @route   GET /api/alerts
 * @access  Private
 */
export const getAlerts = async (req, res) => {
  try {
    const { severity, category, status, building, limit = 50, page = 1 } = req.query;
    
    let query = {};
    
    if (severity) query.severity = severity;
    if (category) query.category = category;
    if (status) query.status = status;
    if (building) query.building = building;

    const alerts = await Alert.find(query)
      .populate('building', 'name code')
      .populate('sensor', 'name sensorId type')
      .sort({ triggeredAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Alert.countDocuments(query);

    res.status(200).json({
      success: true,
      count: alerts.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      alerts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching alerts',
      error: error.message
    });
  }
};

/**
 * @desc    Get single alert
 * @route   GET /api/alerts/:id
 * @access  Private
 */
export const getAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id)
      .populate('building', 'name code coordinates')
      .populate('sensor', 'name sensorId type')
      .populate('resolvedBy', 'username firstName lastName')
      .populate('acknowledgedBy', 'username firstName lastName');

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    res.status(200).json({
      success: true,
      alert
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching alert',
      error: error.message
    });
  }
};

/**
 * @desc    Create new alert
 * @route   POST /api/alerts
 * @access  Private
 */
export const createAlert = async (req, res) => {
  try {
    const alert = await Alert.create(req.body);

    res.status(201).json({
      success: true,
      alert
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating alert',
      error: error.message
    });
  }
};

/**
 * @desc    Update alert
 * @route   PUT /api/alerts/:id
 * @access  Private
 */
export const updateAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    res.status(200).json({
      success: true,
      alert
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating alert',
      error: error.message
    });
  }
};

/**
 * @desc    Acknowledge alert
 * @route   PUT /api/alerts/:id/acknowledge
 * @access  Private
 */
export const acknowledgeAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    alert.status = 'acknowledged';
    alert.acknowledgedBy = req.user.id;
    alert.acknowledgedAt = Date.now();
    await alert.save();

    res.status(200).json({
      success: true,
      alert
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error acknowledging alert',
      error: error.message
    });
  }
};

/**
 * @desc    Resolve alert
 * @route   PUT /api/alerts/:id/resolve
 * @access  Private
 */
export const resolveAlert = async (req, res) => {
  try {
    const { resolution } = req.body;
    
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    alert.status = 'resolved';
    alert.resolvedBy = req.user.id;
    alert.resolvedAt = Date.now();
    alert.resolution = resolution || 'Resolved';
    await alert.save();

    res.status(200).json({
      success: true,
      alert
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error resolving alert',
      error: error.message
    });
  }
};

/**
 * @desc    Get alert statistics
 * @route   GET /api/alerts/stats
 * @access  Private
 */
export const getAlertStats = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Overall stats
    const totalAlerts = await Alert.countDocuments({ triggeredAt: { $gte: startDate } });
    
    const bySeverity = await Alert.aggregate([
      { $match: { triggeredAt: { $gte: startDate } } },
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);

    const byCategory = await Alert.aggregate([
      { $match: { triggeredAt: { $gte: startDate } } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const byStatus = await Alert.aggregate([
      { $match: { triggeredAt: { $gte: startDate } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Critical alerts
    const criticalAlerts = await Alert.find({
      severity: 'critical',
      status: { $ne: 'resolved' }
    }).populate('building', 'name code');

    // Daily trend
    const dailyTrend = await Alert.aggregate([
      { $match: { triggeredAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$triggeredAt' } },
          count: { $sum: 1 },
          critical: {
            $sum: { $cond: [{ $eq: ['$severity', 'critical'] }, 1, 0] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        total: totalAlerts,
        bySeverity: bySeverity.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        byCategory: byCategory.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        byStatus: byStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        criticalAlerts,
        dailyTrend
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching alert statistics',
      error: error.message
    });
  }
};

/**
 * @desc    Get active alerts
 * @route   GET /api/alerts/active
 * @access  Private
 */
export const getActiveAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ status: { $ne: 'resolved' } })
      .populate('building', 'name code')
      .sort({ severity: 1, triggeredAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      count: alerts.length,
      alerts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching active alerts',
      error: error.message
    });
  }
};

/**
 * @desc    Mark alert as read
 * @route   PUT /api/alerts/:id/read
 * @access  Private
 */
export const markAsRead = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    res.status(200).json({
      success: true,
      alert
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking alert as read',
      error: error.message
    });
  }
};

/**
 * @desc    Delete alert
 * @route   DELETE /api/alerts/:id
 * @access  Private/Admin
 */
export const deleteAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    await alert.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Alert deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting alert',
      error: error.message
    });
  }
};
