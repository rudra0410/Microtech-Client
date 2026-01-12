# Redux Toolkit State Management

This directory contains the Redux Toolkit implementation for state management in the admin panel application.

## Structure

```
src/store/
├── index.ts              # Store configuration and typed hooks
├── Provider.tsx          # Redux Provider component
├── slices/
│   ├── userSlice.ts      # User management state
│   ├── dashboardSlice.ts # Dashboard data state
│   └── subscriptionSlice.ts # Subscription management state
└── README.md            # This file
```

## Features

- **Redux Toolkit**: Modern Redux with simplified syntax
- **TypeScript**: Full type safety for state and actions
- **Async Thunks**: Handle API calls with loading/error states
- **Custom Hooks**: Easy-to-use hooks for components
- **Optimistic Updates**: Immediate UI updates with error handling

## Store Slices

### User Slice (`userSlice.ts`)
Manages user-related state and operations:

- **State**: Users list, selected user, loading states, filters
- **Actions**: CRUD operations, status updates, subscription resets
- **Async Thunks**: API calls for user management

### Dashboard Slice (`dashboardSlice.ts`)
Manages dashboard data and analytics:

- **State**: Stats, charts data, alerts, loading states
- **Actions**: Data fetching, refresh operations
- **Async Thunks**: API calls for dashboard data

### Subscription Slice (`subscriptionSlice.ts`)
Manages subscription-related state:

- **State**: Subscriptions list, user subscriptions, loading states
- **Actions**: CRUD operations, status updates
- **Async Thunks**: API calls for subscription management

## Custom Hooks

### `useUsers()`
```typescript
const {
  users,           // User[] - List of users
  selectedUser,    // User | null - Currently selected user
  loading,         // boolean - Loading state
  error,           // string | null - Error message
  totalCount,      // number - Total user count
  loadUsers,       // Function to fetch users
  createNewUser,   // Function to create user
  updateUserData,  // Function to update user
  toggleUserStatus,// Function to enable/disable user
  // ... more actions
} = useUsers();
```

### `useDashboard()`
```typescript
const {
  stats,           // DashboardStats | null - Dashboard statistics
  subscriptionChart, // ChartData[] - Chart data
  userGrowth,      // UserGrowthData[] - Growth data
  loading,         // Loading states object
  error,           // string | null - Error message
  isLoading,       // boolean - Any loading state
  hasData,         // boolean - Has loaded data
  loadAllData,     // Function to fetch all data
  refresh,         // Function to refresh data
  // ... more actions
} = useDashboard();
```

### `useSubscriptions()`
```typescript
const {
  subscriptions,   // SubscriptionWithUser[] - Subscriptions list
  loading,         // boolean - Loading state
  error,           // string | null - Error message
  totalCount,      // number - Total subscription count
  loadAllSubscriptions, // Function to fetch subscriptions
  createSubscription,   // Function to create subscription
  updateSubscriptionData, // Function to update subscription
  getSubscriptionsByStatus, // Helper to filter by status
  // ... more actions
} = useSubscriptions();
```

## Usage Examples

### Basic Component with Redux

```typescript
import React, { useEffect } from 'react';
import { useUsers } from '../hooks';

const UsersList: React.FC = () => {
  const { 
    users, 
    loading, 
    error, 
    loadUsers, 
    createNewUser 
  } = useUsers();

  useEffect(() => {
    if (users.length === 0) {
      loadUsers();
    }
  }, [users.length, loadUsers]);

  const handleCreateUser = async (userData: CreateUserData) => {
    try {
      await createNewUser(userData);
      toast.success('User created successfully');
    } catch (error) {
      toast.error('Failed to create user');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
};
```

### Error Handling

```typescript
const { users, error, clearUserError } = useUsers();

// Display error with retry option
if (error) {
  return (
    <div className="error-container">
      <p>Error: {error}</p>
      <button onClick={clearUserError}>
        Clear Error
      </button>
    </div>
  );
}
```

### Loading States

```typescript
const { loading, isLoading } = useDashboard();

// Individual loading states
if (loading.stats) return <StatsLoader />;
if (loading.charts) return <ChartsLoader />;

// Any loading state
if (isLoading) return <GeneralLoader />;
```

## Best Practices

### 1. Use Custom Hooks
Always use the custom hooks (`useUsers`, `useDashboard`, `useSubscriptions`) instead of directly accessing the store.

```typescript
// ✅ Good
const { users, loadUsers } = useUsers();

// ❌ Avoid
const users = useAppSelector(state => state.users.users);
const dispatch = useAppDispatch();
```

### 2. Handle Loading States
Always handle loading states for better UX:

```typescript
const { users, loading, loadUsers } = useUsers();

if (loading) {
  return <Skeleton />;
}
```

### 3. Error Handling
Implement proper error handling:

```typescript
const { error, clearUserError } = useUsers();

useEffect(() => {
  if (error) {
    toast.error(error);
    clearUserError();
  }
}, [error, clearUserError]);
```

### 4. Optimistic Updates
The store handles optimistic updates automatically. Just call the action:

```typescript
const handleUpdateUser = async (userId: string, data: UpdateUserData) => {
  try {
    await updateUserData(userId, data);
    // UI updates automatically via Redux
    toast.success('User updated');
  } catch (error) {
    // Error handling, state reverts automatically
    toast.error('Update failed');
  }
};
```

### 5. Conditional Loading
Only load data when needed:

```typescript
useEffect(() => {
  if (users.length === 0) {
    loadUsers();
  }
}, [users.length, loadUsers]);
```

## Integration

The Redux store is integrated into the app via the `ReduxProvider` in `App.tsx`:

```typescript
function App() {
  return (
    <ReduxProvider>
      <AuthProvider>
        <BreadcrumbProvider>
          {/* Your app components */}
        </BreadcrumbProvider>
      </AuthProvider>
    </ReduxProvider>
  );
}
```

## Type Safety

All Redux state and actions are fully typed:

```typescript
// Store state is typed
export type RootState = ReturnType<typeof store.getState>;

// Dispatch is typed
export type AppDispatch = typeof store.dispatch;

// Hooks are typed
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
```

## Performance

- **Memoized Selectors**: Custom hooks use memoized selectors
- **Optimistic Updates**: Immediate UI feedback
- **Selective Loading**: Only load data when needed
- **Error Recovery**: Automatic state recovery on errors

## Migration from Local State

To migrate existing components from local state to Redux:

1. Replace `useState` with custom hooks
2. Replace `useEffect` API calls with Redux actions
3. Remove local loading/error state management
4. Update error handling to use Redux error state

```typescript
// Before (local state)
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  fetchUsers();
}, []);

// After (Redux)
const { users, loading, loadUsers } = useUsers();

useEffect(() => {
  if (users.length === 0) {
    loadUsers();
  }
}, [users.length, loadUsers]);
```