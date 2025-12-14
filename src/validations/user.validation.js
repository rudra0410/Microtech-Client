// User validation schemas

import { z } from "zod";
import { ROLES, ALL_ROLES } from "../constants/roles.constant.js";

/**
 * Create user validation schema
 */
export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(ALL_ROLES).optional().default(ROLES.USER),
});

/**
 * Update user validation schema
 */
export const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
});
