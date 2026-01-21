import type { Response, Request, NextFunction } from "express";
import { patient, NewPatient } from "../models/patient";
import { db } from "../database/db";
import { GlobalError } from "../error/global-error";

import * as z from "zod";

export const vCreatePateint = z.object({
  patient: z.string(),
  doctorId: z.uuid(),
  serviceId: z.uuid(),
  gender: z.enum(["male", "female"]),
  age: z.number(),
  token: z.number(),
  fee: z.number(),
  discount: z.number(),
  paid: z.number(),
}) satisfies z.ZodType<NewPatient>;

// export const createService = async (req:Request,res:Response,next:NextFunction) => {}

export const createPatient = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const rqBody: NewPatient = req.body;

  const response = vCreatePateint.safeParse(rqBody);

  if (!response.success) {
    console.log(response.error.message);
    const schemaErr =
      response.error.issues[0]?.message || "Error found in schema";
    next(new GlobalError(500, `details ${schemaErr}`, "SERVER INTERNAL ERROR"));
  }

  try {
    const patientResponse = await db.insert(patient).values({ 
        ...rqBody
     });

    res.json({
      data: patientResponse,
      success: true,
      message: "Patient Added Successfully",
      error: null,
    });
  } catch (err) {
    next(new GlobalError(500, `details ${err}`, "SERVER INTERNAL ERROR"));
  }
};
