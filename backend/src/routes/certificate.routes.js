const express = require("express"); // Import Express
const { issueCert, verifyCert } = require("../controllers/certificate.controller"); // Import controller functions

const router = express.Router(); // Create router instance

router.post("/issue", issueCert); // Route to issue certificate
router.get("/verify/:uid", verifyCert); // Route to verify certificate

module.exports = router; // Export router