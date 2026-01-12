import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContextProvider";
import { BreadcrumbProvider } from "./context/BreadcrumbContext";
import { ReduxProvider } from "./store/Provider";
import { ProtectedRoute, PublicRoute } from "./components/auth";
import { usePageTitle } from "./hooks/usePageTitle";
import Login from "./pages/Login";
import Users from "./pages/Users";
import UserDetail from "./pages/UserDetail";
import Subscriptions from "./pages/Subscriptions";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";

// Component to handle page title updates
const PageTitleManager = () => {
  usePageTitle();
  return null;
};

function App() {
  return (
    <ReduxProvider>
      <AuthProvider>
        <BreadcrumbProvider>
          <BrowserRouter>
            <PageTitleManager />
            <Routes>
              {/* Public Routes */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />

                {/* Dashboard - All authenticated users */}
                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Users - Admin and Owner only */}
                <Route
                  path="users"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Users />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="users/:id"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <UserDetail />
                    </ProtectedRoute>
                  }
                />

                {/* Subscriptions - Admin and Owner only */}
                <Route
                  path="subscriptions"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Subscriptions />
                    </ProtectedRoute>
                  }
                />

                {/* Notifications - All authenticated users */}
                <Route
                  path="notifications"
                  element={
                    <ProtectedRoute>
                      <Notifications />
                    </ProtectedRoute>
                  }
                />

                {/* Settings - All authenticated users */}
                <Route
                  path="settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Catch all - redirect to dashboard if authenticated, login if not */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
          <Toaster position="top-right" richColors closeButton />
        </BreadcrumbProvider>
      </AuthProvider>
    </ReduxProvider>
  );
}

export default App;
