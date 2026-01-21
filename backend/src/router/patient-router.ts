import express from "express";
import { createPatient } from "../controller/patient-controller";

const router:express.Router = express.Router();

router.post("/",createPatient);

export default router ;
