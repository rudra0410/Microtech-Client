// Error handling middleware

import { HTTP_STATUS } from "../constants/status.constant.js";
import { MESSAGES } from "../constants/messages.constant.js";
import { sendError } from "../utils/response.util.js";
import logger from "../utils/logger.util.js";

/**
 * Global error handling middleware
 */
export const errorMiddleware = (err, req, res, next) => {
  // Log error
  logger.error("Error occurred:", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  // Handle known error types
  if (err.name === "ValidationError") {
    return sendError(
      res,
      MESSAGES.VALIDATION_ERROR,
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      err.errors
    );
  }

  if (
    err.name === "UnauthorizedError" ||
    err.code === "auth/id-token-expired"
  ) {
    return sendError(res, MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
  }

  // Supabase errors
  if (err.code && err.code.startsWith("PGRST")) {
    if (err.code === "PGRST116") {
      return sendError(res, MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }
    return sendError(
      res,
      err.message || MESSAGES.INTERNAL_ERROR,
      HTTP_STATUS.BAD_REQUEST
    );
  }

  // Default error response
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || MESSAGES.INTERNAL_ERROR;

  // Don't expose stack trace in production
  const response = {
    success: false,
    message,
  };

  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
    response.error = err.message;
  }

  return res.status(statusCode).json(response);
};

/**
 * 404 Not Found handler
 */
export const notFoundMiddleware = (req, res) => {
  return sendError(
    res,
    `Route ${req.method} ${req.path} not found`,
    HTTP_STATUS.NOT_FOUND
  );
};
