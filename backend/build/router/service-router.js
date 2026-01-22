import express from "express";
import { createService, getAllService } from "../controller/services-controller.js";
const router = express.Router();
router.post("/", createService);
router.get("/", getAllService);
export default router;
