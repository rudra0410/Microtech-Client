import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { userService, CreateUserData, UpdateUserData, UserFilters } from '../../services/userService';
import type { User } from '../../data/mock';

// Async thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (filters?: UserFilters) => {
    const response = await userService.getUsers(filters);
    return response;
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (userId: string) => {
    const response = await userService.getUserById(userId);
    return response;
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: CreateUserData) => {
    const response = await userService.createUser(userData);
    return response;
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ userId, userData }: { userId: string; userData: UpdateUserData }) => {
    const response = await userService.updateUser(userId, userData);
    return response;
  }
);

export const updateUserStatus = createAsyncThunk(
  'users/updateUserStatus',
  async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
    const response = await userService.updateUserStatus(userId, isActive);
    return response;
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId: string) => {
    await userService.deleteUser(userId);
    return userId;
  }
);

export const forceLogoutUser = createAsyncThunk(
  'users/forceLogoutUser',
  async (userId: string) => {
    await userService.forceLogoutUser(userId);
    return userId;
  }
);

export const resetUserSubscription = createAsyncThunk(
  'users/resetUserSubscription',
  async (userId: string) => {
    const response = await userService.resetUserSubscription(userId);
    return response;
  }
);

// State interface
interface UserState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
  filters: UserFilters;
  totalCount: number;
}

// Initial state
const initialState: UserState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
  filters: {},
  totalCount: 0,
};

// Slice
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<UserFilters>) => {
      state.filters = action.payload;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    setSelectedUser: (state, action: PayloadAction<User>) => {
      state.selectedUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.totalCount = action.payload.length;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      });

    // Fetch user by ID
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user';
      });

    // Create user
    builder
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
        state.totalCount += 1;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create user';
      });

    // Update user
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.selectedUser?.id === action.payload.id) {
          state.selectedUser = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update user';
      });

    // Update user status
    builder
      .addCase(updateUserStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.selectedUser?.id === action.payload.id) {
          state.selectedUser = action.payload;
        }
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update user status';
      });

    // Delete user
    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(user => user.id !== action.payload);
        state.totalCount -= 1;
        if (state.selectedUser?.id === action.payload) {
          state.selectedUser = null;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete user';
      });

    // Force logout user
    builder
      .addCase(forceLogoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forceLogoutUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forceLogoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to force logout user';
      });

    // Reset user subscription
    builder
      .addCase(resetUserSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetUserSubscription.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.selectedUser?.id === action.payload.id) {
          state.selectedUser = action.payload;
        }
      })
      .addCase(resetUserSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to reset user subscription';
      });
  },
});

export const { clearError, setFilters, clearSelectedUser, setSelectedUser } = userSlice.actions;
export default userSlice.reducer;