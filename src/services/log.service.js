// Log service

import supabase from "../configs/supabase.config.js";
import logger from "../utils/logger.util.js";

export const createLog = async (logData) => {
  const { data, error } = await supabase
    .from("logs")
    .insert(logData)
    .select()
    .single();

  if (error) {
    logger.error("Error creating log:", error.message);
    throw error;
  }

  return data;
};

export const getLog = async (logId) => {
  const { data, error } = await supabase
    .from("logs")
    .select("*")
    .eq("id", logId)
    .single();

  if (error) {
    logger.error("Error fetching log:", error.message);
    throw error;
  }

  return data;
};

export const getLogs = async (filters = {}) => {
  let query = supabase.from("logs").select("*");

  if (filters.userId) {
    query = query.eq("user_id", filters.userId);
  }

  if (filters.deviceId) {
    query = query.eq("device_id", filters.deviceId);
  }

  if (filters.startDate && filters.endDate) {
    query = query
      .gte("created_at", filters.startDate)
      .lte("created_at", filters.endDate);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    logger.error("Error fetching logs:", error.message);
    throw error;
  }

  return data;
};
