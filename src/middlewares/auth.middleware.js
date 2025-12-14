// Authentication middleware

import { auth } from "../configs/firebase.config.js";
import { sendUnauthorized, sendError } from "../utils/response.util.js";
import { HTTP_STATUS } from "../constants/status.constant.js";
import { MESSAGES } from "../constants/messages.constant.js";
import logger from "../utils/logger.util.js";

/**
 * Verify Firebase ID token and attach user to request
 */
export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendUnauthorized(res, MESSAGES.MISSING_TOKEN);
    }

    const idToken = authHeader.substring(7);

    if (!auth) {
      logger.error("Firebase Admin SDK not initialized");
      return sendError(
        res,
        "Authentication service unavailable",
        HTTP_STATUS.SERVICE_UNAVAILABLE
      );
    }

    // Verify the Firebase ID token
    const decodedToken = await auth.verifyIdToken(idToken);

    // Attach user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      phone: decodedToken.phone_number,
    };

    next();
  } catch (error) {
    logger.error("Authentication error:", error.message);

    if (error.code === "auth/id-token-expired") {
      return sendUnauthorized(res, MESSAGES.INVALID_TOKEN);
    }

    if (error.code === "auth/argument-error") {
      return sendUnauthorized(res, MESSAGES.INVALID_TOKEN);
    }

    return sendUnauthorized(res, MESSAGES.UNAUTHORIZED);
  }
};
