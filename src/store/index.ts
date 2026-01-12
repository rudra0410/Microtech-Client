import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

// Import slices
import userSlice from './slices/userSlice';
import dashboardSlice from './slices/dashboardSlice';
import subscriptionSlice from './slices/subscriptionSlice';

export const store = configureStore({
  reducer: {
    users: userSlice,
    dashboard: dashboardSlice,
    subscriptions: subscriptionSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;