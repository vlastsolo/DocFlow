// utils/errorHandler.ts
import { Response } from "express";

export interface AppError extends Error {
  statusCode?: number;
}

export function handleError(error: unknown, res: Response, defaultMessage: string = "Internal server error") {
  if (error instanceof Error) {
    console.error("Error:", error.message);
    const statusCode = (error as AppError).statusCode || 500;
    res.status(statusCode).json({ 
      error: error.message || defaultMessage 
    });
  } else {
    console.error("Unknown error occurred:", error);
    res.status(500).json({ error: defaultMessage });
  }
}

export function createError(message: string, statusCode: number = 500): AppError {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  return error;
}