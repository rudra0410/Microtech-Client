import { apiService } from "./apiService";

export interface Subscription {
  id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  status: "ACTIVE" | "EXPIRED" | "CANCELLED";
  created_at: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
}

export interface SubscriptionWithUser extends Subscription {
  users: User;
}

class SubscriptionService {
  // Admin endpoints (admin auth required)
  async getAllSubscriptions(): Promise<SubscriptionWithUser[]> {
    const response = await apiService.post<{ data: SubscriptionWithUser[] }>(
      "/api/admin/subscriptions/getSubscriptions"
    );
    return response.data;
  }

  async getSubscriptionById(userId: string): Promise<SubscriptionWithUser> {
    const response = await apiService.post<{ data: SubscriptionWithUser }>(
      "/api/admin/subscriptions/getSubscriptionByUserId",
      { userId }
    );
    return response.data;
  }

  async assignSubscription(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<Subscription> {
    const response = await apiService.post<{ data: Subscription }>(
      "/api/admin/subscriptions/assignSubscription",
      {
        userId,
        startDate,
        endDate,
      }
    );
    return response.data;
  }

  async updateSubscription(
    subscriptionId: string,
    updateData: Partial<Subscription>
  ): Promise<Subscription> {
    const response = await apiService.post<{ data: Subscription }>(
      "/api/admin/subscriptions/updateSubscription",
      {
        subscriptionId,
        ...updateData,
      }
    );
    return response.data;
  }

  async extendSubscription(
    userId: string,
    newEndDate: string
  ): Promise<Subscription> {
    const response = await apiService.post<{ data: Subscription }>(
      "/api/admin/subscriptions/extendSubscription",
      {
        userId,
        newEndDate,
      }
    );
    return response.data;
  }

  async expireSubscription(userId: string): Promise<Subscription[]> {
    const response = await apiService.post<{ data: Subscription[] }>(
      "/api/admin/subscriptions/expireSubscription",
      {
        userId,
      }
    );
    return response.data;
  }

  async resumeSubscription(userId: string): Promise<Subscription[]> {
    const response = await apiService.post<{ data: Subscription[] }>(
      "/api/admin/subscriptions/resumeSubscription",
      {
        userId,
      }
    );
    return response.data;
  }
  async deleteSubscription(subscriptionId: string): Promise<Subscription> {
    const response = await apiService.post<{ data: Subscription }>(
      "/api/admin/subscriptions/deleteSubscription",
      { subscriptionId }
    );
    return response.data;
  }

  async getUserSubscriptions(userId: string): Promise<Subscription[]> {
    const response = await apiService.post<{ data: Subscription[] }>(
      "/api/admin/subscriptions/getUserSubscriptions",
      {
        userId,
      }
    );
    return response.data;
  }

  async getUserActiveSubscription(
    userId: string
  ): Promise<Subscription | null> {
    try {
      const response = await apiService.post<{ data: Subscription }>(
        "/api/admin/subscriptions/getUserActiveSubscription",
        {
          userId,
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 404) {
          return null;
        }
      }
      throw error;
    }
  }
}

export const subscriptionService = new SubscriptionService();
