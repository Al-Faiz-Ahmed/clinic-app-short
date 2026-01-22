import express from "express";
import { createPatient, getCheckup, getPatients, getPatientStats } from "../controller/patient-controller.js";
const router = express.Router();
router.post("/", createPatient);
router.get("/", getPatients);
router.get("/stats", getPatientStats);
router.get("/checkup", getCheckup);
export default router;
