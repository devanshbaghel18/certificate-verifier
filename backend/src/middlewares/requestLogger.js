const { v4: uuidv4 } = require("uuid");
const logger = require("../utils/logger");

module.exports = (req, res, next) => {
  const start = Date.now();

  // Assign a unique request ID for tracing
  req.requestId = uuidv4();

  // Attach request ID to response headers for debugging
  res.setHeader("X-Request-Id", req.requestId);

  res.on("finish", () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 500 ? "error"
                   : res.statusCode >= 400 ? "warn"
                   : "info";

    logger[logLevel]("API Request", {
      requestId: req.requestId,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get("User-Agent") || "unknown",
      contentLength: res.get("Content-Length") || 0,
    });

    // Flag slow requests (> 3 seconds)
    if (duration > 3000) {
      logger.warn("Slow request detected", {
        requestId: req.requestId,
        method: req.method,
        url: req.originalUrl,
        duration: `${duration}ms`,
      });
    }
  });

  next();
};