const { v4: uuidv4 } = require("uuid");
const logger = require("../utils/logger");

module.exports = (req, res, next) => {
  const start = Date.now();

  req.requestId = uuidv4();

  res.on("finish", () => {
    const duration = Date.now() - start;

    logger.info("API Request", {
      requestId: req.requestId,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
    });
  });

  next();
};