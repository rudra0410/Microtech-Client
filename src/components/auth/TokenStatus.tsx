import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Shield, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';

export const TokenStatus: React.FC = () => {
  const { tokenExpiresAt, refreshToken, isAuthenticated } = useAuth();
  const [timeUntilExpiry, setTimeUntilExpiry] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!tokenExpiresAt || !isAuthenticated) {
      setTimeUntilExpiry(null);
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const timeLeft = tokenExpiresAt - now;
      setTimeUntilExpiry(Math.max(0, timeLeft));
    };

    // Update immediately
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [tokenExpiresAt, isAuthenticated]);

  const handleRefreshToken = async () => {
    setIsRefreshing(true);
    try {
      await refreshToken();
    } catch (error) {
      console.error('Failed to refresh token:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!isAuthenticated || !timeUntilExpiry) {
    return null;
  }

  const minutes = Math.floor(timeUntilExpiry / (1000 * 60));
  const seconds = Math.floor((timeUntilExpiry % (1000 * 60)) / 1000);

  // Show warning if token expires in less than 10 minutes
  const showWarning = minutes < 10;
  
  // Show critical alert if token expires in less than 2 minutes
  const showCritical = minutes < 2;

  if (!showWarning) {
    return null; // Don't show anything if token is not expiring soon
  }

  return (
    <Alert variant={showCritical ? "destructive" : "default"} className="mb-4">
      <div className="flex items-center gap-2">
        {showCritical ? (
          <AlertTriangle className="h-4 w-4" />
        ) : (
          <Shield className="h-4 w-4" />
        )}
        <AlertDescription className="flex-1">
          {showCritical ? (
            <span className="font-medium">
              Session expires in {minutes}m {seconds}s
            </span>
          ) : (
            <span>
              Session expires in {minutes} minutes
            </span>
          )}
        </AlertDescription>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefreshToken}
          disabled={isRefreshing}
          className="ml-2"
        >
          {isRefreshing ? (
            <>
              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh
            </>
          )}
        </Button>
      </div>
    </Alert>
  );
};

export default TokenStatus;