// Admin service

import supabase from "../configs/supabase.config.js";
import { hashPassword } from "../utils/crypto.util.js";
import { ROLES } from "../constants/roles.constant.js";
import logger from "../utils/logger.util.js";

export const createNewUser = async (userData) => {
  const { name, email, password, role = ROLES.USER } = userData;

  // Hash password before storing
  const hashedPassword = await hashPassword(password);

  const { data, error } = await supabase
    .from("users")
    .insert({
      name,
      email,
      password: hashedPassword,
      role,
    })
    .select()
    .single();

  if (error) {
    logger.error("Error creating user:", error.message);
    throw error;
  }

  // Remove password from response
  const { password: _, ...userWithoutPassword } = data;

  return userWithoutPassword;
};

export const getAdmin = async (adminId) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", adminId)
    .eq("role", ROLES.ADMIN)
    .single();

  if (error) {
    logger.error("Error fetching admin:", error.message);
    throw error;
  }

  return data;
};
