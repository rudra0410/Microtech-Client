// Authentication validation schemas

import { z } from "zod";

/**
 * Login validation schema
 * Note: For Firebase auth, token is verified by middleware
 * This is a placeholder for any additional validation needed
 */
export const loginSchema = z.object({
  // Add any additional fields if needed
  // Firebase token is handled by authMiddleware
});
