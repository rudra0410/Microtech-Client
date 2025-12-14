// Time utility functions

/**
 * Get current timestamp in ISO format
 */
export const getCurrentTimestamp = () => {
  return new Date().toISOString();
};

/**
 * Get current timestamp in milliseconds
 */
export const getCurrentTimestampMs = () => {
  return Date.now();
};

/**
 * Add days to a date
 */
export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Check if a date is expired (in the past)
 */
export const isExpired = (date) => {
  return new Date(date) < new Date();
};

/**
 * Check if a date is in the future
 */
export const isFuture = (date) => {
  return new Date(date) > new Date();
};

/**
 * Format date to ISO string
 */
export const formatDate = (date) => {
  return new Date(date).toISOString();
};

/**
 * Get days difference between two dates
 */
export const getDaysDifference = (date1, date2) => {
  const diffTime = Math.abs(new Date(date2) - new Date(date1));
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
