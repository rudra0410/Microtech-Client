import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

// Import slices
import dashboardSlice from "./slices/dashboardSlice";
import subscriptionSlice from "./slices/subscriptionSlice";
import userSlice from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    users: userSlice,
    dashboard: dashboardSlice,
    subscriptions: subscriptionSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
