import { AppError } from "../utils/appError.js";

export function notFoundHandler(req, res, next) {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
}