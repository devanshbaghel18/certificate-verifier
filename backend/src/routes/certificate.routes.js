const express = require("express");
const multer = require("multer");
const { issueCert, verifyCert } = require("../controllers/certificate.controller");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Issue certificate (with file)
router.post("/issue", upload.single("file"), issueCert);

// Verify certificate (with file)
router.post("/verify", upload.single("file"), verifyCert);

module.exports = router;
