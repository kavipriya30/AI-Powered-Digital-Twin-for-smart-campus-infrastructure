/**
 * Role-Based Access Control Middleware
 * Restricts access based on user roles
 */

/**
 * Authorize specific roles
 * @param {...String} roles - Allowed roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this route`
      });
    }
    next();
  };
};

/**
 * Check if user has admin privileges
 */
export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

/**
 * Check if user can manage buildings (admin, maintenance)
 */
export const canManageBuildings = (req, res, next) => {
  const allowedRoles = ['admin', 'maintenance', 'energy_manager'];
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to manage buildings'
    });
  }
  next();
};

/**
 * Check if user can view analytics (admin, energy_manager, viewer)
 */
export const canViewAnalytics = (req, res, next) => {
  const allowedRoles = ['admin', 'energy_manager', 'viewer'];
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to view analytics'
    });
  }
  next();
};

/**
 * Check if user can manage security (admin, security)
 */
export const canManageSecurity = (req, res, next) => {
  const allowedRoles = ['admin', 'security'];
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to manage security'
    });
  }
  next();
};

/**
 * Role hierarchy check - higher roles include lower permissions
 */
export const roleHierarchy = {
  admin: ['admin', 'maintenance', 'energy_manager', 'security', 'viewer'],
  maintenance: ['maintenance', 'viewer'],
  energy_manager: ['energy_manager', 'viewer'],
  security: ['security', 'viewer'],
  viewer: ['viewer']
};

/**
 * Check if user has permission for specific action
 */
export const hasPermission = (userRole, requiredRole) => {
  const allowedRoles = roleHierarchy[userRole];
  return allowedRoles && allowedRoles.includes(requiredRole);
};
