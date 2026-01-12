import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  subscriptionService, 
  Subscription, 
  SubscriptionWithUser 
} from '../../services/subscriptionService';

// Async thunks
export const fetchAllSubscriptions = createAsyncThunk(
  'subscriptions/fetchAll',
  async () => {
    const response = await subscriptionService.getAllSubscriptions();
    return response;
  }
);

export const fetchSubscriptionById = createAsyncThunk(
  'subscriptions/fetchById',
  async (userId: string) => {
    const response = await subscriptionService.getSubscriptionById(userId);
    return response;
  }
);

export const assignSubscription = createAsyncThunk(
  'subscriptions/assign',
  async ({ userId, startDate, endDate }: { userId: string; startDate: string; endDate: string }) => {
    const response = await subscriptionService.assignSubscription(userId, startDate, endDate);
    return response;
  }
);

export const updateSubscription = createAsyncThunk(
  'subscriptions/update',
  async ({ subscriptionId, updateData }: { subscriptionId: string; updateData: Partial<Subscription> }) => {
    const response = await subscriptionService.updateSubscription(subscriptionId, updateData);
    return response;
  }
);

export const extendSubscription = createAsyncThunk(
  'subscriptions/extend',
  async ({ userId, newEndDate }: { userId: string; newEndDate: string }) => {
    const response = await subscriptionService.extendSubscription(userId, newEndDate);
    return response;
  }
);

export const expireSubscription = createAsyncThunk(
  'subscriptions/expire',
  async (userId: string) => {
    const response = await subscriptionService.expireSubscription(userId);
    return response;
  }
);

export const deleteSubscription = createAsyncThunk(
  'subscriptions/delete',
  async (subscriptionId: string) => {
    await subscriptionService.deleteSubscription(subscriptionId);
    return subscriptionId;
  }
);

export const fetchUserSubscriptions = createAsyncThunk(
  'subscriptions/fetchUserSubscriptions',
  async (userId: string) => {
    const response = await subscriptionService.getUserSubscriptions(userId);
    return { userId, subscriptions: response };
  }
);

export const fetchUserActiveSubscription = createAsyncThunk(
  'subscriptions/fetchUserActiveSubscription',
  async (userId: string) => {
    const response = await subscriptionService.getUserActiveSubscription(userId);
    return { userId, subscription: response };
  }
);

// State interface
interface SubscriptionState {
  subscriptions: SubscriptionWithUser[];
  selectedSubscription: SubscriptionWithUser | null;
  userSubscriptions: Record<string, Subscription[]>;
  userActiveSubscriptions: Record<string, Subscription | null>;
  loading: boolean;
  error: string | null;
  totalCount: number;
}

// Initial state
const initialState: SubscriptionState = {
  subscriptions: [],
  selectedSubscription: null,
  userSubscriptions: {},
  userActiveSubscriptions: {},
  loading: false,
  error: null,
  totalCount: 0,
};

// Slice
const subscriptionSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedSubscription: (state) => {
      state.selectedSubscription = null;
    },
    setSelectedSubscription: (state, action: PayloadAction<SubscriptionWithUser>) => {
      state.selectedSubscription = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch all subscriptions
    builder
      .addCase(fetchAllSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions = action.payload;
        state.totalCount = action.payload.length;
      })
      .addCase(fetchAllSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch subscriptions';
      });

    // Fetch subscription by ID
    builder
      .addCase(fetchSubscriptionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSubscription = action.payload;
      })
      .addCase(fetchSubscriptionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch subscription';
      });

    // Assign subscription
    builder
      .addCase(assignSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignSubscription.fulfilled, (state) => {
        state.loading = false;
        // Note: We might need to refetch all subscriptions to get the updated list with user data
      })
      .addCase(assignSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to assign subscription';
      });

    // Update subscription
    builder
      .addCase(updateSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubscription.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.subscriptions.findIndex(sub => sub.id === action.payload.id);
        if (index !== -1) {
          // Update the subscription while preserving user data
          state.subscriptions[index] = { ...state.subscriptions[index], ...action.payload };
        }
        if (state.selectedSubscription?.id === action.payload.id) {
          state.selectedSubscription = { ...state.selectedSubscription, ...action.payload };
        }
      })
      .addCase(updateSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update subscription';
      });

    // Extend subscription
    builder
      .addCase(extendSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(extendSubscription.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.subscriptions.findIndex(sub => sub.user_id === action.payload.user_id);
        if (index !== -1) {
          state.subscriptions[index] = { ...state.subscriptions[index], ...action.payload };
        }
      })
      .addCase(extendSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to extend subscription';
      });

    // Expire subscription
    builder
      .addCase(expireSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(expireSubscription.fulfilled, (state, action) => {
        state.loading = false;
        // Update all subscriptions for the user
        action.payload.forEach(updatedSub => {
          const index = state.subscriptions.findIndex(sub => sub.id === updatedSub.id);
          if (index !== -1) {
            state.subscriptions[index] = { ...state.subscriptions[index], ...updatedSub };
          }
        });
      })
      .addCase(expireSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to expire subscription';
      });

    // Delete subscription
    builder
      .addCase(deleteSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions = state.subscriptions.filter(sub => sub.id !== action.payload);
        state.totalCount -= 1;
        if (state.selectedSubscription?.id === action.payload) {
          state.selectedSubscription = null;
        }
      })
      .addCase(deleteSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete subscription';
      });

    // Fetch user subscriptions
    builder
      .addCase(fetchUserSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.userSubscriptions[action.payload.userId] = action.payload.subscriptions;
      })
      .addCase(fetchUserSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user subscriptions';
      });

    // Fetch user active subscription
    builder
      .addCase(fetchUserActiveSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserActiveSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.userActiveSubscriptions[action.payload.userId] = action.payload.subscription;
      })
      .addCase(fetchUserActiveSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user active subscription';
      });
  },
});

export const { 
  clearError, 
  clearSelectedSubscription, 
  setSelectedSubscription 
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;