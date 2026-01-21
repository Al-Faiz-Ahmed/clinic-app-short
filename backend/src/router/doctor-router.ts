import express from "express";
import { addDoctor,getAllDoctor } from "../controller/doctor-controller";

const router:express.Router = express.Router();

router.post("/",addDoctor);
router.get("/get-all",getAllDoctor)

export default router ;
