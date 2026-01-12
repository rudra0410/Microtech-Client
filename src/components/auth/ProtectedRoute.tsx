import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'owner' | 'admin' | 'support';
  requiredPermission?: {
    module: string;
    action: string;
  };
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredPermission,
}) => {
  const { isAuthenticated, isLoading, user, hasPermission, isOwner, isAdmin, isSupport } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-slate-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRole) {
    let hasRequiredRole = false;
    
    switch (requiredRole) {
      case 'owner':
        hasRequiredRole = isOwner;
        break;
      case 'admin':
        hasRequiredRole = isAdmin;
        break;
      case 'support':
        hasRequiredRole = isSupport;
        break;
      default:
        hasRequiredRole = false;
    }

    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h1>
            <p className="text-slate-600 mb-4">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-slate-500">
              Required role: {requiredRole} | Your role: {user?.role}
            </p>
          </div>
        </div>
      );
    }
  }

  // Check permission-based access
  if (requiredPermission) {
    const hasRequiredPermission = hasPermission(
      requiredPermission.module,
      requiredPermission.action
    );

    if (!hasRequiredPermission) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h1>
            <p className="text-slate-600 mb-4">
              You don't have permission to perform this action.
            </p>
            <p className="text-sm text-slate-500">
              Required: {requiredPermission.module}.{requiredPermission.action}
            </p>
          </div>
        </div>
      );
    }
  }

  // Render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;