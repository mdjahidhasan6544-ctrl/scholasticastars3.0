import { validationResult } from "express-validator";

import { AppError } from "../utils/appError.js";

export function validateRequest(req, res, next) {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  return next(
    new AppError("Validation failed", 422, {
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg
      }))
    })
  );
}