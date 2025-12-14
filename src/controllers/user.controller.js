// User controller

import { getUser } from "../services/user.service.js";
import { sendSuccess, sendNotFound } from "../utils/response.util.js";
import { MESSAGES } from "../constants/messages.constant.js";

export const getUserDetails = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const userData = await getUser(userId);

    if (!userData || userData.length === 0) {
      return sendNotFound(res, MESSAGES.USER_NOT_FOUND);
    }

    return sendSuccess(res, userData[0], MESSAGES.USER_FETCHED);
  } catch (error) {
    next(error);
  }
};
