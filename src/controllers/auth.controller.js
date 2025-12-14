// Authentication controller

import { sendSuccess } from "../utils/response.util.js";
import { MESSAGES } from "../constants/messages.constant.js";

export const login = async (req, res, next) => {
  try {
    // User is already authenticated via authMiddleware
    // Return user info
    return sendSuccess(res, { user: req.user }, MESSAGES.LOGIN_SUCCESS);
  } catch (err) {
    next(err);
  }
};
