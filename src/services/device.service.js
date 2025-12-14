// Device service

import supabase from "../configs/supabase.config.js";
import logger from "../utils/logger.util.js";

export const createDevice = async (deviceData) => {
  const { data, error } = await supabase
    .from("devices")
    .insert(deviceData)
    .select()
    .single();

  if (error) {
    logger.error("Error creating device:", error.message);
    throw error;
  }

  return data;
};

export const getDevice = async (deviceId) => {
  const { data, error } = await supabase
    .from("devices")
    .select("*")
    .eq("id", deviceId);

  if (error) {
    logger.error("Error fetching device:", error.message);
    throw error;
  }

  return data;
};

export const getUserDevices = async (userId) => {
  const { data, error } = await supabase
    .from("devices")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    logger.error("Error fetching user devices:", error.message);
    throw error;
  }

  return data;
};

export const updateDevice = async (deviceId, updateData) => {
  const { data, error } = await supabase
    .from("devices")
    .update(updateData)
    .eq("id", deviceId)
    .select()
    .single();

  if (error) {
    logger.error("Error updating device:", error.message);
    throw error;
  }

  return data;
};
