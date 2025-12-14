// Crypto utility functions

import bcrypt from "bcrypt";
import crypto from "crypto";

const SALT_ROUNDS = 12;

/**
 * Hash password using bcrypt
 */
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare password with hash
 */
export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

/**
 * Generate random token
 */
export const generateRandomToken = (length = 32) => {
  return crypto.randomBytes(length).toString("hex");
};

/**
 * Generate UUID v4
 */
export const generateUUID = () => {
  return crypto.randomUUID();
};

/**
 * Hash string using SHA256
 */
export const hashString = (str) => {
  return crypto.createHash("sha256").update(str).digest("hex");
};
