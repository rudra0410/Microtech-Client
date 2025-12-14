// Validation middleware

import { sendValidationError } from "../utils/response.util.js";

/**
 * Validate request body against a Zod schema
 */
export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      const errors = error.errors?.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      return sendValidationError(res, errors);
    }
  };
};

/**
 * Validate request params against a Zod schema
 */
export const validateParams = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync(req.params);
      next();
    } catch (error) {
      const errors = error.errors?.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      return sendValidationError(res, errors);
    }
  };
};

/**
 * Validate request query against a Zod schema
 */
export const validateQuery = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync(req.query);
      next();
    } catch (error) {
      const errors = error.errors?.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      return sendValidationError(res, errors);
    }
  };
};

