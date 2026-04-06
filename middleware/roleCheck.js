// This middleware checks if user has required role
function checkRole(allowedRoles) {
  return (req, res, next) => {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Check if user's role is in allowed list
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ 
        error: `Access denied. ${user.role} cannot access this resource` 
      });
    }
    
    next();
  };
}

module.exports = { checkRole };