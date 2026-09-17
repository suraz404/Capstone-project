import { NextFunction, Request, Response } from "express";
import { logger } from "../libs/logger.js";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  logger.error({ err }, "Unhandle error");

  res.status(500).json({
    sucess: false,
    message: "Internal Server error",
  });
}
