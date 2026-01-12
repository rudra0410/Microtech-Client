import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Shield, RefreshCw, User, Clock } from 'lucide-react';

export const AuthTest = () => {
  const { 
    user, 
    firebaseUser, 
    isAuthenticated, 
    isLoading, 
    error, 
    refreshToken, 
    tokenExpiresAt,
    hasPermission,
    isAdmin,
    isOwner,
    isSupport
  } = useAuth();

  const formatTime = (timestamp: number | null) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString();
  };

  const getTimeUntilExpiry = (expiresAt: number | null) => {
    if (!expiresAt) return 'N/A';
    const now = Date.now();
    const timeLeft = expiresAt - now;
    if (timeLeft <= 0) return 'Expired';
    
    const minutes = Math.floor(timeLeft / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Authentication Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Authentication Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-slate-500">Status:</span>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={isAuthenticated ? 'default' : 'destructive'}>
                {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
              </Badge>
              {isLoading && <Badge variant="outline">Loading...</Badge>}
            </div>
          </div>
          <div>
            <span className="text-sm text-slate-500">Firebase User:</span>
            <p className="text-sm font-medium mt-1">
              {firebaseUser ? '✅ Connected' : '❌ Not Connected'}
            </p>
          </div>
        </div>

        {/* User Information */}
        {user && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <User className="w-4 h-4" />
              User Information
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500">Name:</span>
                <p className="font-medium">{user.name}</p>
              </div>
              <div>
                <span className="text-slate-500">Email:</span>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <span className="text-slate-500">Role:</span>
                <Badge variant="outline" className="text-xs">
                  {user.role}
                </Badge>
              </div>
              <div>
                <span className="text-slate-500">Status:</span>
                <Badge variant={user.status === 'active' ? 'default' : 'destructive'} className="text-xs">
                  {user.status}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Role Permissions */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Role Permissions</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant={isOwner ? 'default' : 'outline'}>
              Owner: {isOwner ? '✅' : '❌'}
            </Badge>
            <Badge variant={isAdmin ? 'default' : 'outline'}>
              Admin: {isAdmin ? '✅' : '❌'}
            </Badge>
            <Badge variant={isSupport ? 'default' : 'outline'}>
              Support: {isSupport ? '✅' : '❌'}
            </Badge>
          </div>
        </div>

        {/* Specific Permissions */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Specific Permissions</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span>Users Create:</span>
              <span>{hasPermission('users', 'create') ? '✅' : '❌'}</span>
            </div>
            <div className="flex justify-between">
              <span>Users Delete:</span>
              <span>{hasPermission('users', 'delete') ? '✅' : '❌'}</span>
            </div>
            <div className="flex justify-between">
              <span>Devices Read:</span>
              <span>{hasPermission('devices', 'read') ? '✅' : '❌'}</span>
            </div>
            <div className="flex justify-between">
              <span>Logs Export:</span>
              <span>{hasPermission('logs', 'export') ? '✅' : '❌'}</span>
            </div>
          </div>
        </div>

        {/* Token Information */}
        {tokenExpiresAt && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Token Information
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500">Expires At:</span>
                <p className="font-medium">{formatTime(tokenExpiresAt)}</p>
              </div>
              <div>
                <span className="text-slate-500">Time Until Expiry:</span>
                <p className="font-medium">{getTimeUntilExpiry(tokenExpiresAt)}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshToken}
              className="mt-2"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Token
            </Button>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2 text-red-600">Error</h4>
            <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>
          </div>
        )}

        {/* Firebase User Details */}
        {firebaseUser && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Firebase User Details</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">UID:</span>
                <span className="font-mono text-xs">{firebaseUser.uid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email Verified:</span>
                <span>{firebaseUser.emailVerified ? '✅' : '❌'}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuthTest;