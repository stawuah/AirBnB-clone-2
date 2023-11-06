import { Request, NextFunction, Response } from "express";
import { AuthPayload } from "../dto/authDto";
import { ValidateSignature } from "../utils/auth";

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const Authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const signature = await ValidateSignature(req);
  if (signature) {
    return next();
  } else {
    return res.json({ message: "User Not authorised" });
  }
};
