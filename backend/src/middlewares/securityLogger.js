const logger = require("../utils/logger");

module.exports = (req, res, next) => {
  if (req.method === "POST" && Object.keys(req.body).length === 0) {
    logger.warn("Empty request body", {
      url: req.originalUrl,
      ip: req.ip,
    });
  }

  next();
};