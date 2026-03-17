import express from "express";
import { issueCert, verifyCert } from "../controllers/certificate.controller.js";

const router = express.Router();

router.post("/issue", issueCert);
router.get("/verify/:uid", verifyCert);

export default router;