// Subscription service

import supabase from "../configs/supabase.config.js";
import { SUBSCRIPTION_STATUS } from "../constants/status.constant.js";
import { isExpired } from "../utils/time.util.js";
import logger from "../utils/logger.util.js";

export const createSubscription = async (subscriptionData) => {
  const { data, error } = await supabase
    .from("subscriptions")
    .insert(subscriptionData)
    .select()
    .single();

  if (error) {
    logger.error("Error creating subscription:", error.message);
    throw error;
  }

  return data;
};

export const getSubscriptionStatus = async (userId) => {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    // If no subscription found, return null instead of throwing
    if (error.code === "PGRST116") {
      return null;
    }
    logger.error("Error fetching subscription:", error.message);
    throw error;
  }

  // Check if subscription is expired based on expiry date
  if (data.expires_at && isExpired(data.expires_at)) {
    // Update status to expired if not already
    if (data.status !== SUBSCRIPTION_STATUS.EXPIRED) {
      await supabase
        .from("subscriptions")
        .update({ status: SUBSCRIPTION_STATUS.EXPIRED })
        .eq("id", data.id);
      data.status = SUBSCRIPTION_STATUS.EXPIRED;
    }
  }

  return data;
};

export const updateSubscription = async (subscriptionId, updateData) => {
  const { data, error } = await supabase
    .from("subscriptions")
    .update(updateData)
    .eq("id", subscriptionId)
    .select()
    .single();

  if (error) {
    logger.error("Error updating subscription:", error.message);
    throw error;
  }

  return data;
};
