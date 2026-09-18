import { NextFunction, Request, Response } from "express";
import { logger } from "../libs/logger.js";
import { AppError } from "../errors/AppError.js";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const parserError = err as Error & { type?: string };

  if (parserError.type === "entity.parse.failed") {
    res.status(400).json({
      success: false,
      message: "Request body contains invalid JSON",
    });

    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });

    return;
  }
  logger.error({ err }, "Unhandle error");

  res.status(500).json({
    success: false,
    message: "Internal Server error",
  });
}
