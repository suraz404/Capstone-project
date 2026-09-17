import { NextFunction, Request, Response } from "express";
import { logger } from "../libs/logger.js";
import { AppError } from "../errors/AppError.js";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }
  logger.error({ err }, "Unhandle error");

  res.status(500).json({
    sucess: false,
    message: "Internal Server error",
  });
}
