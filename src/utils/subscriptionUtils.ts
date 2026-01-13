import { formatDistanceToNow } from "date-fns";
import type { User } from "../data/mock";

/**
 * Get subscription status display information
 * Direct mapping of database status to frontend display
 *
 * @param user - User object containing subscription information
 * @returns Object with status, message, and boolean flags for different states
 *
 * Status mapping:
 * - ACTIVE (database) -> 'active' (frontend)
 * - EXPIRED (database) -> 'expired' (frontend)
 * - CANCELLED (database) -> 'cancelled' (frontend)
 * - null (database) -> 'inactive' (frontend)
 */
export const getSubscriptionStatusInfo = (user: User) => {
  // Direct mapping from backend status (backend sends lowercase values)
  let status: string;

  if (!user.subscriptionStatus || user.subscriptionStatus === "inactive") {
    status = "inactive";
  } else if (user.subscriptionStatus === "active") {
    status = "active";
  } else if (user.subscriptionStatus === "expired") {
    status = "expired";
  } else if (user.subscriptionStatus === "cancelled") {
    status = "cancelled";
  } else {
    status = "inactive"; // fallback for any other values
  }

  let message = "";

  if (status === "inactive") {
    message = "No active subscription";
  } else if (status === "expired") {
    message = user.subscriptionExpiry
      ? `Expired ${formatDistanceToNow(new Date(user.subscriptionExpiry), {
          addSuffix: true,
        })}`
      : "Subscription expired";
  }
   else if (status === "cancelled") {
    message = user.subscriptionExpiry
      ? `Cancelled ${formatDistanceToNow(new Date(user.subscriptionExpiry), {
          addSuffix: true,
        })}`
      : "Subscription cancelled";
  } 
  else if (status === "active") {
    message = user.subscriptionExpiry
      ? `Expires ${formatDistanceToNow(new Date(user.subscriptionExpiry), {
          addSuffix: true,
        })}`
      : "Active subscription";
  } else {
    message = "No subscription data";
  }

  return {
    status,
    message,
    isInactive: status === "inactive",
    isExpired: status === "expired",
    isActive: status === "active",
    isCancelled: status === "cancelled",
  };
};

export const getSubscriptionStatusInfoAdmin = (user: User) => {
  const raw = user.subscriptionStatus;

  const status: "active" | "expired" | "cancelled" | "inactive" =
    raw === "active" || raw === "expired" || raw === "cancelled"
      ? raw
      : "inactive";

  const expiry = user.subscriptionExpiry
    ? new Date(user.subscriptionExpiry)
    : null;

  let message = "No subscription";

  if (status === "active") {
    message = expiry
      ? `Expires ${formatDistanceToNow(expiry, { addSuffix: true })}`
      : "Active";
  }

  if (status === "expired") {
    message = expiry
      ? `Expired ${formatDistanceToNow(expiry, { addSuffix: true })}`
      : "Expired";
  }

  if (status === "cancelled") {
    message = expiry
      ? `Cancelled ${formatDistanceToNow(expiry, { addSuffix: true })}`
      : "Cancelled";
  }

  return {
    status,
    label: status.toUpperCase(), // ACTIVE / EXPIRED / CANCELLED / INACTIVE
    message,

    // For table filtering & badges
    isActive: status === "active",
    isExpired: status === "expired",
    isCancelled: status === "cancelled",
    isInactive: status === "inactive",
  };
};

/**
 * Get subscription status message for different contexts
 *
 * @param user - User object containing subscription information
 * @param context - 'short' for brief messages, 'detailed' for descriptive messages
 * @returns Formatted message string
 */
export const getSubscriptionMessage = (
  user: User,
  context: "short" | "detailed" = "short"
) => {
  const info = getSubscriptionStatusInfo(user);

  if (context === "detailed") {
    switch (info.status) {
      case "inactive":
        return "No subscription assigned";
      case "expired":
        return "Subscription has expired";
      case "cancelled":
        return "Subscription has been cancelled";
      case "active":
        return "Subscription is active";
      default:
        return "Subscription status unknown";
    }
  }

  return info.message;
};
