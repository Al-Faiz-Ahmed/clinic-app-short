import express from "express";
import 'dotenv/config';
import { GlobalError } from "./error/global-error.js";
import servicesRouter from "./router/service-router.js";
import doctorsRouter from "./router/doctor-router.js";
import patientsRouter from "./router/patient-router.js";
import cors from 'cors';
const PORT = parseInt(process.env.PORT || '5000', 10);
const app = express();
app.use(express.json());
app.use(cors());
app.get("/", (eq, res) => {
    res.json({ message: 'Root Page Access' });
});
app.use("/api/service", servicesRouter);
app.use("/api/doctor", doctorsRouter);
app.use("/api/patient", patientsRouter);
app.use((req, res, next) => {
    return next(new GlobalError(404, `The requested URL ${req.originalUrl} was not found on this server.`, 'PAGE NOT FOUND'));
});
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        success: false,
        error: err.name,
        message: err.message,
        data: null,
    });
});
app.listen(PORT, () => {
    console.log(`Server Started on  http://localhost:${PORT}`);
});
