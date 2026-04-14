const rateLimit = require("express-rate-limit");
const logger = require("../utils/logger");

// General API rate limiter — 100 requests per 15 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // max requests per window
  standardHeaders: true,      // Return rate-limit info in headers
  legacyHeaders: false,       // Disable X-RateLimit-* headers
  message: {
    error: "Too many requests from this IP, please try again after 15 minutes",
  },
  handler: (req, res, next, options) => {
    logger.warn("Rate limit exceeded", {
      type: "RATE_LIMIT",
      ip: req.ip,
      url: req.originalUrl,
      method: req.method,
    });
    res.status(429).json(options.message);
  },
});

// Strict limiter for auth endpoints — 20 requests per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many authentication attempts, please try again later",
  },
  handler: (req, res, next, options) => {
    logger.warn("Auth rate limit exceeded", {
      type: "AUTH_RATE_LIMIT",
      ip: req.ip,
      url: req.originalUrl,
    });
    res.status(429).json(options.message);
  },
});

// Strict limiter for blockchain operations — 10 requests per 15 minutes
const blockchainLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many blockchain requests, please try again later",
  },
  handler: (req, res, next, options) => {
    logger.warn("Blockchain rate limit exceeded", {
      type: "BLOCKCHAIN_RATE_LIMIT",
      ip: req.ip,
      url: req.originalUrl,
    });
    res.status(429).json(options.message);
  },
});

module.exports = { apiLimiter, authLimiter, blockchainLimiter };
