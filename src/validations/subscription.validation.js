// Subscription validation schemas

import { z } from "zod";
import { SUBSCRIPTION_STATUS } from "../constants/status.constant.js";

/**
 * Create subscription validation schema
 */
export const createSubscriptionSchema = z.object({
  user_id: z.string().uuid("Invalid user ID format"),
  plan: z.string().min(1, "Plan is required"),
  status: z.enum(Object.values(SUBSCRIPTION_STATUS)).optional(),
  expires_at: z.string().datetime().optional(),
});

/**
 * Update subscription validation schema
 */
export const updateSubscriptionSchema = z.object({
  status: z.enum(Object.values(SUBSCRIPTION_STATUS)).optional(),
  expires_at: z.string().datetime().optional(),
});
