import { patient } from "../models/patient.js";
import { doctor } from "../models/doctor.js";
import { service } from "../models/services.js";
import { db } from "../database/db.js";
import { GlobalError } from "../error/global-error.js";
import { v4 as uuidv4 } from "uuid";
import * as z from "zod";
import { eq, and, gte, lte, ilike, inArray, count, desc, sql } from "drizzle-orm";
export const vCreatePateint = z.object({
    patient: z.string(),
    doctorId: z.string(),
    serviceId: z.string(),
    gender: z.enum(["male", "female"]),
    age: z.number(),
    token: z.number(),
    fee: z.number(),
    discount: z.number(),
    paid: z.number(),
});
// export const createService = async (req:Request,res:Response,next:NextFunction) => {}
export const createPatient = async (req, res, next) => {
    const rqBody = req.body;
    const response = vCreatePateint.safeParse(rqBody);
    if (!response.success) {
        console.log(response.error.message);
        const schemaErr = response.error.issues[0]?.message || "Error found in schema";
        return next(new GlobalError(500, `details ${schemaErr}`, "SERVER INTERNAL ERROR"));
    }
    try {
        const patientResponse = await db.insert(patient).values({
            id: uuidv4(),
            ...rqBody
        });
        res.json({
            success: true,
            message: "Patient Added Successfully",
            error: null,
        });
    }
    catch (err) {
        next(new GlobalError(500, `details ${err}`, "SERVER INTERNAL ERROR"));
    }
};
/**
 * GET /patients - Get paginated list of patients with filters
 *
 * Pagination: Offset-based with default limit of 50
 * Joins: LEFT JOIN with doctor and service tables
 * Filters: date range, doctors, services, patient name, gender, age
 * Count: Separate COUNT query for total rows calculation
 */
export const getPatients = async (req, res, next) => {
    try {
        const query = req.query;
        // Parse pagination parameters
        const page = Math.max(1, parseInt(query.page || "1", 10) || 1);
        const limit = Math.max(1, Math.min(100, parseInt(query.limit || "50", 10) || 50));
        const offset = (page - 1) * limit;
        // Build filter conditions array
        const filterConditions = [];
        // Date range filter (optional - only applied if explicitly provided)
        // Support both snake_case and camelCase
        const fromDateStr = query.from_date || query.fromDate;
        const toDateStr = query.to_date || query.toDate;
        if (fromDateStr || toDateStr) {
            const fromDate = fromDateStr
                ? new Date(fromDateStr)
                : new Date(new Date().setHours(0, 0, 0, 0)); // Today start
            const toDate = toDateStr
                ? new Date(toDateStr)
                : new Date(new Date().setHours(23, 59, 59, 999)); // Today end
            filterConditions.push(gte(patient.createdAt, fromDate));
            filterConditions.push(lte(patient.createdAt, toDate));
        }
        // Doctor IDs filter (multiple allowed)
        // Support both snake_case (comma-separated) and camelCase (array)
        const doctorIdsParam = query.doctor_ids || query.doctorIds;
        if (doctorIdsParam) {
            const doctorIdArray = Array.isArray(doctorIdsParam)
                ? doctorIdsParam
                : typeof doctorIdsParam === 'string' && doctorIdsParam.includes(',')
                    ? doctorIdsParam.split(',').map(id => id.trim()).filter(id => id.length > 0)
                    : [doctorIdsParam];
            if (doctorIdArray.length > 0) {
                filterConditions.push(inArray(patient.doctorId, doctorIdArray));
            }
        }
        // Service IDs filter (multiple allowed)
        // Support both snake_case (comma-separated) and camelCase (array)
        const serviceIdsParam = query.service_ids || query.serviceIds;
        if (serviceIdsParam) {
            const serviceIdArray = Array.isArray(serviceIdsParam)
                ? serviceIdsParam
                : typeof serviceIdsParam === 'string' && serviceIdsParam.includes(',')
                    ? serviceIdsParam.split(',').map(id => id.trim()).filter(id => id.length > 0)
                    : [serviceIdsParam];
            if (serviceIdArray.length > 0) {
                filterConditions.push(inArray(patient.serviceId, serviceIdArray));
            }
        }
        // Patient name filter (ILIKE search, only if length >= 3)
        const patientNameParam = query.patient_name || query.patientName;
        if (patientNameParam && patientNameParam.length >= 3) {
            filterConditions.push(ilike(patient.patient, `%${patientNameParam}%`));
        }
        // Gender filter (note: current enum only supports "male" and "female")
        if (query.gender && (query.gender === "male" || query.gender === "female")) {
            filterConditions.push(eq(patient.gender, query.gender));
        }
        // Age filters
        // Support both fixed_age (frontend) and age, and both min_age/max_age and minAge/maxAge
        const ageParam = query.fixed_age || query.age;
        if (ageParam) {
            const age = parseInt(ageParam, 10);
            if (!isNaN(age)) {
                filterConditions.push(eq(patient.age, age));
            }
        }
        else {
            // Age range filters (minAge and maxAge)
            const minAgeParam = query.min_age || query.minAge;
            const maxAgeParam = query.max_age || query.maxAge;
            if (minAgeParam) {
                const minAge = parseInt(minAgeParam, 10);
                if (!isNaN(minAge)) {
                    filterConditions.push(gte(patient.age, minAge));
                }
            }
            if (maxAgeParam) {
                const maxAge = parseInt(maxAgeParam, 10);
                if (!isNaN(maxAge)) {
                    filterConditions.push(lte(patient.age, maxAge));
                }
            }
        }
        // Combine all filters with AND logic
        const whereClause = filterConditions.length > 0
            ? and(...filterConditions)
            : undefined;
        // Build the main query with LEFT JOINs
        // Order by patient.created_at DESC as per requirements
        // Include id and createdAt for frontend
        const patientsQuery = db
            .select({
            id: patient.id,
            createdAt: patient.createdAt,
            patient: patient.patient,
            doctorId: patient.doctorId,
            serviceId: patient.serviceId,
            doctorName: doctor.doctorName,
            serviceName: service.serviceName,
            age: patient.age,
            gender: patient.gender,
            token: patient.token,
            fee: patient.fee,
            discount: patient.discount,
            paid: patient.paid,
        })
            .from(patient)
            .leftJoin(doctor, eq(patient.doctorId, doctor.id))
            .leftJoin(service, eq(patient.serviceId, service.id))
            .where(whereClause)
            .orderBy(desc(patient.createdAt))
            .limit(limit)
            .offset(offset);
        // Build the count query with the same filters (without limit and offset)
        // Count from patient table directly since joins don't affect row count
        const countQuery = db
            .select({ count: count() })
            .from(patient)
            .where(whereClause);
        // Execute both queries in parallel
        const [patientsResult, countResult] = await Promise.all([
            patientsQuery,
            countQuery,
        ]);
        // Map results to match frontend expectations
        const patients = patientsResult.map((row) => ({
            id: row.id,
            createdAt: row.createdAt,
            patient: row.patient,
            doctorId: row.doctorId,
            serviceId: row.serviceId,
            doctorName: row.doctorName,
            serviceName: row.serviceName,
            age: row.age,
            gender: row.gender,
            token: row.token,
            fee: row.fee,
            discount: row.discount,
            paid: row.paid,
        }));
        // Get total rows count
        const totalRows = countResult[0]?.count || 0;
        const totalPages = Math.ceil(totalRows / limit);
        // Build response in envelope format expected by frontend axios interceptor
        // Frontend expects: { success: true, data: { data: [], total, page, limit, totalPages } }
        res.json({
            success: true,
            message: "Patients retrieved successfully",
            error: null,
            data: {
                data: patients,
                total: totalRows,
                page,
                limit,
                totalPages,
            },
        });
    }
    catch (err) {
        next(new GlobalError(500, `details ${err}`, "SERVER INTERNAL ERROR"));
    }
};
/**
 * GET /patients/stats - Get statistics for patients
 * Returns total patient visits and total sales for the date range
 */
export const getPatientStats = async (req, res, next) => {
    try {
        const query = req.query;
        // Date range filter (defaults to today if not provided)
        const fromDateStr = query.from_date || query.fromDate;
        const toDateStr = query.to_date || query.toDate;
        const fromDate = fromDateStr
            ? new Date(fromDateStr)
            : new Date(new Date().setHours(0, 0, 0, 0)); // Today start (default)
        const toDate = toDateStr
            ? new Date(toDateStr)
            : new Date(new Date().setHours(23, 59, 59, 999)); // Today end (default)
        // Build filter conditions
        const filterConditions = [
            gte(patient.createdAt, fromDate),
            lte(patient.createdAt, toDate),
        ];
        const whereClause = and(...filterConditions);
        // Get count of patients and sum of paid amounts
        const statsQuery = db
            .select({
            totalPatientVisitsToday: count(),
            totalTodaySales: sql `COALESCE(SUM(${patient.paid}), 0)`.as('totalTodaySales'),
        })
            .from(patient)
            .where(whereClause);
        const statsResult = await statsQuery;
        const stats = statsResult[0];
        res.json({
            success: true,
            message: "Stats retrieved successfully",
            error: null,
            data: {
                totalPatientVisitsToday: Number(stats?.totalPatientVisitsToday || 0),
                totalTodaySales: Number(stats?.totalTodaySales || 0),
            },
        });
    }
    catch (err) {
        return next(new GlobalError(500, `details ${err}`, "SERVER INTERNAL ERROR"));
    }
};
export const getCheckup = async (req, res, next) => {
    try {
        const response = await db.select().from(patient);
        res.json({
            success: true,
            message: "Stats retrieved successfully",
            error: null,
            data: response,
        });
    }
    catch (err) {
        return next(new GlobalError(500, `details ${err}`, "SERVER INTERNAL ERROR"));
    }
};
