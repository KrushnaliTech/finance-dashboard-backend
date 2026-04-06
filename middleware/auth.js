const jwt = require('jsonwebtoken');

// This middleware checks if user is logged in
async function authenticate(req, res, next) {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  
  // Check if header exists
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  // Extract token from "Bearer <token>" format
  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Invalid token format' });
  }
  
  try {
    // Verify the token using secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user info to request
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { authenticate };