import type { Response, Request, NextFunction } from "express";
import { NewService, service } from "../models/services";
import { db } from "../database/db";
import { GlobalError } from "../error/global-error";

// export const createService = async (req:Request,res:Response,next:NextFunction) => {}

export const createService = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { serviceName,fee }: Pick<NewService, "serviceName"|"fee"> = req.body;

  const regex = /^[^\s\d]([^\d]*[^\s\d])?$/;

  const validate = regex.test(serviceName);

  if (!validate) {
    next(new GlobalError(402, `Service name invlaid format`, "BAD FORMAT"));
  }
  if(!fee && Number(fee) === 0 && Object.is(Number(fee),NaN) === true){
   next(new GlobalError(402, `Service Fee invlaid format`, "BAD FORMAT"));
  }
  try {
    const serviceResponse = await db.insert(service).values({ serviceName });

    res.json({
      data: serviceResponse,
      success: true,
      message: "Service Added Successfully",
      error: null,
    });
  } catch (err) {
    next(new GlobalError(500, `details ${err}`, "SERVER INTERNAL ERROR"));
  }
};


export const getAllService = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  
  
  try {
    const serviceResponse = await db.select().from(service);

    res.json({
      data: serviceResponse,
      success: true,
      message: "Services fetched Successfully",
      error: null,
    });
  } catch (err) {
    next(new GlobalError(500, `details ${err}`, "SERVER INTERNAL ERROR"));
  }
};