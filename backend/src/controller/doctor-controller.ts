import type { Response, Request, NextFunction } from "express";
import { NewService, service } from "../models/services";
import { db } from "../database/db";
import { GlobalError } from "../error/global-error";
import { doctor, NewDoctor } from "../models/doctor";
import { v4 as uuidv4 } from "uuid";

// export const createService = async (req:Request,res:Response,next:NextFunction) => {}

export const addDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { doctorName }: Pick<NewDoctor, "doctorName"> = req.body;

  const regex = /^[^\s\d]([^\d]*[^\s\d])?$/;

  const validate = regex.test(doctorName);

  if (!validate) {
    next(new GlobalError(402, `Doctor name invlaid format`, "BAD FORMAT"));
  }
  try {
    const doctorId = uuidv4();
    const addDoctorResponse = await db.insert(doctor).values({ 
      id: doctorId,
      doctorName 
    }).returning();

    res.json({
      data: addDoctorResponse,
      success: true,
      message: "Doctor Added Successfully",
      error: null,
    });
  } catch (err) {
    next(new GlobalError(500, `details ${err}`, "SERVER INTERNAL ERROR"));
  }
};

export const getAllDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  
  
  try {
    const doctorResponse = await db.select().from(doctor);

    res.json({
      data: doctorResponse,
      success: true,
      message: "Doctors fetched Successfully",
      error: null,
    });
  } catch (err) {
    return next(new GlobalError(500, `details ${err}`, "SERVER INTERNAL ERROR"));
  }
};
