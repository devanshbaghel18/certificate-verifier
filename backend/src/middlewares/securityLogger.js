const logger = require("../utils/logger");

// In-memory tracker for repeated failed attempts per IP
const failedAttempts = new Map();

// Clean up old entries every 30 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of failedAttempts.entries()) {
    if (now - data.firstSeen > 30 * 60 * 1000) {
      failedAttempts.delete(ip);
    }
  }
}, 30 * 60 * 1000);

module.exports = (req, res, next) => {
  const ip = req.ip;

  // 1. Detect empty POST/PUT bodies (possible probing)
  const hasBody = req.body && Object.keys(req.body).length > 0;
  const hasFile = req.file || req.files;

  if ((req.method === "POST" || req.method === "PUT") && !hasBody && !hasFile) {
    logger.warn("Suspicious: Empty request body", {
      type: "EMPTY_BODY",
      method: req.method,
      url: req.originalUrl,
      ip,
    });
  }

  // 2. Detect suspicious user-agent strings
  const userAgent = req.get("User-Agent") || "";
  const suspiciousAgents = ["curl", "wget", "python-requests", "postman", "insomnia"];
  const isSuspiciousAgent = suspiciousAgents.some(
    (agent) => userAgent.toLowerCase().includes(agent)
  );

  if (isSuspiciousAgent && process.env.NODE_ENV === "production") {
    logger.warn("Suspicious: Automated tool detected", {
      type: "SUSPICIOUS_AGENT",
      userAgent,
      url: req.originalUrl,
      ip,
    });
  }

  // 3. Track failed attempts (4xx/5xx responses)
  res.on("finish", () => {
    if (res.statusCode >= 400) {
      if (!failedAttempts.has(ip)) {
        failedAttempts.set(ip, { count: 0, firstSeen: Date.now() });
      }

      const record = failedAttempts.get(ip);
      record.count++;

      // Alert if an IP has 10+ failures within the tracking window
      if (record.count === 10) {
        logger.warn("Security alert: Repeated failures from IP", {
          type: "REPEATED_FAILURES",
          ip,
          failureCount: record.count,
          since: new Date(record.firstSeen).toISOString(),
        });
      }

      // Alert at every 25 failures after the first warning
      if (record.count > 10 && record.count % 25 === 0) {
        logger.warn("Security alert: Ongoing abuse from IP", {
          type: "ONGOING_ABUSE",
          ip,
          failureCount: record.count,
          since: new Date(record.firstSeen).toISOString(),
        });
      }
    }
  });

  // 4. Detect path traversal attempts
  if (req.originalUrl.includes("..") || req.originalUrl.includes("%2e%2e")) {
    logger.warn("Security alert: Path traversal attempt", {
      type: "PATH_TRAVERSAL",
      url: req.originalUrl,
      ip,
    });
  }

  next();
};