const logger = require("../utils/logger");

module.exports = (req, res, next) => {
  const hasBody = req.body && Object.keys(req.body).length > 0;
  const hasFile = req.file || req.files;

  if (req.method === "POST" && !hasBody && !hasFile) {
    logger.warn("Empty request body", {
      url: req.originalUrl,
      ip: req.ip,
    });
  }

  next();
};