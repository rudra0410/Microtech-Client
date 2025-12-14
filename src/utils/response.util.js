// Response utility functions

import { HTTP_STATUS } from "../constants/status.constant.js";
import { MESSAGES } from "../constants/messages.constant.js";

/**
 * Send success response
 */
export const sendSuccess = (
  res,
  data = null,
  message = MESSAGES.SUCCESS,
  statusCode = HTTP_STATUS.OK
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Send error response
 */
export const sendError = (
  res,
  message = MESSAGES.INTERNAL_ERROR,
  statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  errors = null
) => {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send validation error response
 */
export const sendValidationError = (res, errors) => {
  return sendError(
    res,
    MESSAGES.VALIDATION_ERROR,
    HTTP_STATUS.UNPROCESSABLE_ENTITY,
    errors
  );
};

/**
 * Send not found response
 */
export const sendNotFound = (res, message = MESSAGES.NOT_FOUND) => {
  return sendError(res, message, HTTP_STATUS.NOT_FOUND);
};

/**
 * Send unauthorized response
 */
export const sendUnauthorized = (res, message = MESSAGES.UNAUTHORIZED) => {
  return sendError(res, message, HTTP_STATUS.UNAUTHORIZED);
};

/**
 * Send forbidden response
 */
export const sendForbidden = (res, message = MESSAGES.FORBIDDEN) => {
  return sendError(res, message, HTTP_STATUS.FORBIDDEN);
};
