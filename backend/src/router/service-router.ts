import express from "express";
import { createService,getAllService } from "../controller/services-controller";

const router:express.Router = express.Router();

router.post("/",createService);
router.get("/",getAllService)

export default router ;
