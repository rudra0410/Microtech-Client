// Admin controller

import { createNewUser } from "../services/admin.service.js";
import { sendSuccess } from "../utils/response.util.js";
import { MESSAGES } from "../constants/messages.constant.js";
import { HTTP_STATUS } from "../constants/status.constant.js";

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await createNewUser({ name, email, password, role });
    return sendSuccess(res, user, MESSAGES.USER_CREATED, HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};
