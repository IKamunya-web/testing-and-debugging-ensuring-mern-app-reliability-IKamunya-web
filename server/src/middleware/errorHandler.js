const structuredLogger = require('../utils/structuredLogger');

// Express error-handling middleware
function errorHandler(err, req, res, next) {
  // Log the error with structured logging (Winston)
  const errorMeta = {
    method: req.method,
    url: req.url,
    statusCode: err.statusCode || 500,
    timestamp: new Date().toISOString()
  };

  structuredLogger.error(
    err && err.message ? err.message : 'Internal Server Error',
    errorMeta
  );

  res.status(500).json({
    error: err && err.message ? err.message : 'Internal Server Error',
    requestId: req.id // optional: can be set by middleware upstream
  });
}

module.exports = errorHandler;
