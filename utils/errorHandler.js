// Centralized error handling

// Custom error class for API errors
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error types
const ErrorTypes = {
  NOT_FOUND: new ApiError(404, 'Resource not found'),
  UNAUTHORIZED: new ApiError(401, 'Unauthorized access'),
  FORBIDDEN: new ApiError(403, 'Access denied'),
  BAD_REQUEST: new ApiError(400, 'Bad request'),
  CONFLICT: new ApiError(409, 'Resource already exists'),
  INTERNAL_ERROR: new ApiError(500, 'Internal server error')
};

// Main error handler middleware
function errorHandler(err, req, res, next) {
  // Log error for debugging
  console.error(`[ERROR] ${err.stack}`);
  
  // Check if it's our custom API error
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
  
  // Handle SQLite errors
  if (err.code === 'SQLITE_CONSTRAINT') {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({
        success: false,
        error: 'Duplicate entry. This record already exists.'
      });
    }
    return res.status(400).json({
      success: false,
      error: 'Database constraint violation'
    });
  }
  
  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid authentication token'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Authentication token has expired'
    });
  }
  
  // Default error response
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong' 
      : err.message,
    timestamp: new Date().toISOString()
  });
}

// Async wrapper to avoid try-catch in controllers
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = {
  ApiError,
  ErrorTypes,
  errorHandler,
  asyncHandler
};