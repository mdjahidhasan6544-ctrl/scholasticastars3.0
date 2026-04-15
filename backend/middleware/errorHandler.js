import { logger } from "../utils/logger.js";

function normalizeError(error) {
  if (error.name === "ValidationError") {
    return {
      statusCode: 422,
      message: "Validation failed",
      details: Object.values(error.errors).map((item) => item.message)
    };
  }

  if (error.name === "CastError") {
    return {
      statusCode: 400,
      message: "Invalid resource identifier"
    };
  }

  if (error.code === 11000) {
    return {
      statusCode: 409,
      message: "Duplicate resource detected",
      details: error.keyValue
    };
  }

  return {
    statusCode: error.statusCode || 500,
    message: error.message || "Internal server error",
    details: error.details
  };
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const normalized = normalizeError(error);

  logger.error("Request failed", {
    method: req.method,
    url: req.originalUrl,
    statusCode: normalized.statusCode,
    message: normalized.message
  });

  return res.status(normalized.statusCode).json({
    success: false,
    message: normalized.message,
    ...(normalized.details ? { details: normalized.details } : {})
  });
}