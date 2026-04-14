const logger = require("../utils/logger");

/**
 * Global error handler middleware.
 * Must be registered AFTER all routes (Express identifies it by 4 params).
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Log the full error with stack trace
  logger.error("Unhandled Server Error", {
    requestId: req.requestId || "N/A",
    method: req.method,
    url: req.originalUrl,
    message: err.message,
    stack: err.stack,
    ip: req.ip,
  });

  // Determine status code
  const statusCode = err.statusCode || err.status || 500;

  // In production, hide internal details from the client
  const isProduction = process.env.NODE_ENV === "production";

  res.status(statusCode).json({
    error: isProduction ? "Internal Server Error" : err.message,
    ...(isProduction ? {} : { stack: err.stack }),
    requestId: req.requestId || "N/A",
  });
};

module.exports = errorHandler;
