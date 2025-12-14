// Admin middleware

import { ROLES } from "../constants/roles.constant.js";
import { sendForbidden } from "../utils/response.util.js";
import logger from "../utils/logger.util.js";

/**
 * Verify user has admin role
 * Note: This assumes req.user.role is set from database after authMiddleware
 */
export const adminMiddleware = async (req, res, next) => {
  try {
    // If role is not in req.user, we need to fetch it from database
    // For now, assuming it's set by a previous middleware or service
    const { role } = req.user || {};

    if (!role || role !== ROLES.ADMIN) {
      logger.warn(
        `Unauthorized admin access attempt by user: ${req.user?.uid}`
      );
      return sendForbidden(res);
    }

    next();
  } catch (error) {
    logger.error("Admin middleware error:", error.message);
    return sendForbidden(res);
  }
};
