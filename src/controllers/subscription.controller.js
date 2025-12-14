// Subscription controller

import { getSubscriptionStatus } from "../services/subscription.service.js";
import {
  sendSuccess,
  sendNotFound,
  sendError,
} from "../utils/response.util.js";
import { MESSAGES } from "../constants/messages.constant.js";
import { HTTP_STATUS } from "../constants/status.constant.js";

export const getStatus = async (req, res, next) => {
  try {
    // Get userId from authenticated user or params
    const userId = req.user?.uid || req.params?.userId;

    if (!userId) {
      return sendError(res, "User ID is required", HTTP_STATUS.BAD_REQUEST);
    }

    const subscription = await getSubscriptionStatus(userId);

    if (!subscription) {
      return sendNotFound(res, "Subscription not found");
    }

    return sendSuccess(
      res,
      { status: subscription.status },
      MESSAGES.SUBSCRIPTION_FETCHED
    );
  } catch (error) {
    next(error);
  }
};
