// System message constants

export const MESSAGES = {
  // Success messages
  SUCCESS: "Operation completed successfully",
  USER_CREATED: "User created successfully",
  USER_FETCHED: "User fetched successfully",
  DEVICE_FETCHED: "Device fetched successfully",
  SUBSCRIPTION_FETCHED: "Subscription status fetched successfully",
  LOGIN_SUCCESS: "Login successful",

  // Error messages
  INTERNAL_ERROR: "Internal server error",
  NOT_FOUND: "Resource not found",
  UNAUTHORIZED: "Unauthorized access",
  FORBIDDEN: "Forbidden: Insufficient permissions",
  VALIDATION_ERROR: "Validation error",
  INVALID_TOKEN: "Invalid or expired token",
  MISSING_TOKEN: "Authentication token is required",
  USER_NOT_FOUND: "User not found",
  DEVICE_NOT_FOUND: "Device not found",
  SUBSCRIPTION_NOT_FOUND: "Subscription not found",
  INVALID_CREDENTIALS: "Invalid credentials",
  TOO_MANY_REQUESTS: "Too many requests, please try again later",

  // Validation messages
  REQUIRED_FIELD: (field) => `${field} is required`,
  INVALID_EMAIL: "Invalid email format",
  INVALID_PHONE: "Invalid phone number format",
  PASSWORD_TOO_SHORT: "Password must be at least 8 characters",
};
