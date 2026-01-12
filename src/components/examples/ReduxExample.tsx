import React, { useEffect } from 'react';
import { useUsers, useDashboard, useSubscriptions } from '../../hooks';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Loader2, RefreshCw } from 'lucide-react';

/**
 * Example component demonstrating how to use Redux Toolkit with custom hooks
 * This shows the basic patterns for:
 * 1. Loading data
 * 2. Displaying loading states
 * 3. Handling errors
 * 4. Refreshing data
 * 5. Accessing computed values
 */
export const ReduxExample: React.FC = () => {
  // Using custom hooks that wrap Redux state and actions
  const {
    users,
    loading: usersLoading,
    error: usersError,
    totalCount,
    loadUsers,
    clearUserError,
  } = useUsers();

  const {
    stats,
    loading: dashboardLoading,
    error: dashboardError,
    isLoading: isDashboardLoading,
    hasData,
    loadAllData,
    refresh,
  } = useDashboard();

  const {
    subscriptions,
    loading: subscriptionsLoading,
    error: subscriptionsError,
    totalCount: subscriptionCount,
    loadAllSubscriptions,
    getSubscriptionsByStatus,
  } = useSubscriptions();

  // Load data on component mount
  useEffect(() => {
    if (users.length === 0) {
      loadUsers();
    }
    if (!hasData) {
      loadAllData();
    }
    if (subscriptions.length === 0) {
      loadAllSubscriptions();
    }
  }, [users.length, hasData, subscriptions.length, loadUsers, loadAllData, loadAllSubscriptions]);

  // Computed values using helper functions
  const activeSubscriptions = getSubscriptionsByStatus('ACTIVE');
  const expiredSubscriptions = getSubscriptionsByStatus('EXPIRED');

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Redux Toolkit Example</h2>
        <p className="text-gray-600">
          This component demonstrates how to use Redux Toolkit with custom hooks
        </p>
      </div>

      {/* Users Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Users ({totalCount})</CardTitle>
          <Button
            onClick={() => loadUsers()}
            disabled={usersLoading}
            variant="outline"
            size="sm"
          >
            {usersLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {usersError && (
            <div className="text-red-600 mb-4">
              Error: {usersError}
              <Button
                onClick={clearUserError}
                variant="link"
                size="sm"
                className="ml-2"
              >
                Clear
              </Button>
            </div>
          )}
          {usersLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading users...
            </div>
          ) : (
            <div className="space-y-2">
              {users.slice(0, 3).map((user) => (
                <div key={user.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span>{user.name}</span>
                  <span className="text-sm text-gray-500">{user.email}</span>
                </div>
              ))}
              {users.length > 3 && (
                <p className="text-sm text-gray-500">
                  ... and {users.length - 3} more users
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dashboard Stats Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Dashboard Stats</CardTitle>
          <Button
            onClick={refresh}
            disabled={isDashboardLoading}
            variant="outline"
            size="sm"
          >
            {isDashboardLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {dashboardError && (
            <div className="text-red-600 mb-4">Error: {dashboardError}</div>
          )}
          {isDashboardLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading dashboard data...
            </div>
          ) : stats ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.totalUsers}
                </div>
                <div className="text-sm text-blue-800">Total Users</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded">
                <div className="text-2xl font-bold text-green-600">
                  {stats.activeSubscriptions}
                </div>
                <div className="text-sm text-green-800">Active Subscriptions</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded">
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.expiringSubscriptions}
                </div>
                <div className="text-sm text-yellow-800">Expiring Soon</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded">
                <div className="text-2xl font-bold text-red-600">
                  {stats.expiredSubscriptions}
                </div>
                <div className="text-sm text-red-800">Expired</div>
              </div>
            </div>
          ) : (
            <div>No dashboard data available</div>
          )}
        </CardContent>
      </Card>

      {/* Subscriptions Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Subscriptions ({subscriptionCount})</CardTitle>
          <Button
            onClick={() => loadAllSubscriptions()}
            disabled={subscriptionsLoading}
            variant="outline"
            size="sm"
          >
            {subscriptionsLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {subscriptionsError && (
            <div className="text-red-600 mb-4">Error: {subscriptionsError}</div>
          )}
          {subscriptionsLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading subscriptions...
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded">
                <div className="text-xl font-bold text-green-600">
                  {activeSubscriptions.length}
                </div>
                <div className="text-sm text-green-800">Active</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded">
                <div className="text-xl font-bold text-red-600">
                  {expiredSubscriptions.length}
                </div>
                <div className="text-sm text-red-800">Expired</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded">
                <div className="text-xl font-bold text-gray-600">
                  {subscriptions.length}
                </div>
                <div className="text-sm text-gray-800">Total</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use Redux in Your Components</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">1. Import the hooks:</h4>
            <code className="block bg-gray-100 p-2 rounded text-sm">
              {`import { useUsers, useDashboard, useSubscriptions } from '../hooks';`}
            </code>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">2. Use in your component:</h4>
            <code className="block bg-gray-100 p-2 rounded text-sm whitespace-pre">
{`const { 
  users, 
  loading, 
  error, 
  loadUsers, 
  createNewUser 
} = useUsers();`}
            </code>
          </div>

          <div>
            <h4 className="font-semibold mb-2">3. Load data on mount:</h4>
            <code className="block bg-gray-100 p-2 rounded text-sm">
              {`useEffect(() => { loadUsers(); }, [loadUsers]);`}
            </code>
          </div>

          <div>
            <h4 className="font-semibold mb-2">4. Handle loading and errors:</h4>
            <code className="block bg-gray-100 p-2 rounded text-sm whitespace-pre">
{`if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
return <YourComponent data={users} />;`}
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};