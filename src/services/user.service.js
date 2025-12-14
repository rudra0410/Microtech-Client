// User service

import supabase from "../configs/supabase.config.js";
import logger from "../utils/logger.util.js";

export const createUser = async (userData) => {
  const { data, error } = await supabase
    .from("users")
    .insert(userData)
    .select()
    .single();

  if (error) {
    logger.error("Error creating user:", error.message);
    throw error;
  }

  return data;
};

export const getUser = async (userId) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId);

  if (error) {
    logger.error("Error fetching user:", error.message);
    throw error;
  }

  return data;
};

export const getUserByEmail = async (email) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error && error.code !== "PGRST116") {
    logger.error("Error fetching user by email:", error.message);
    throw error;
  }

  return data;
};

export const updateUser = async (userId, updateData) => {
  const { data, error } = await supabase
    .from("users")
    .update(updateData)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    logger.error("Error updating user:", error.message);
    throw error;
  }

  return data;
};
