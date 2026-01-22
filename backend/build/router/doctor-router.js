import express from "express";
import { addDoctor, getAllDoctor } from "../controller/doctor-controller.js";
const router = express.Router();
router.post("/", addDoctor);
router.get("/", getAllDoctor);
export default router;
