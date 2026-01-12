import { Link } from "react-router-dom";
import { useEffect } from "react";
import {
  Users,
  CreditCard,
  Cpu,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  AlertCircle,
  Info,
  ArrowRight,
  Activity,
  RefreshCw,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useDashboard } from "../hooks";
import type { DashboardAlert, ChartData } from "../services/dashboardService";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Skeleton } from "../components/ui/skeleton";
import { cn } from "../lib/utils";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: "up" | "down";
  trendValue?: string;
  color: string;
  link?: string;
}

const StatCardSkeleton: React.FC = () => (
  <Card className="hover:shadow-md transition-shadow">
    <CardContent className="pt-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="w-12 h-12 rounded-xl" />
      </div>
      <Skeleton className="h-4 w-20 mt-4" />
    </CardContent>
  </Card>
);

const ChartCardSkeleton: React.FC<{ title: string; description: string }> = ({
  title,
  description,
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-center h-48">
        <Skeleton className="w-full h-full rounded-lg" />
      </div>
    </CardContent>
  </Card>
);

const AlertCardSkeleton: React.FC = () => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between">
      <div>
        <CardTitle className="text-base">Alerts & Warnings</CardTitle>
        <CardDescription>Requires attention</CardDescription>
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="w-2 h-2 rounded-full" />
        <Skeleton className="w-16 h-4" />
      </div>
    </CardHeader>
    <CardContent className="p-0">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-start gap-3 p-4 border-b border-slate-100 last:border-0"
        >
          <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
          <div className="flex-1 min-w-0">
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="w-16 h-8 rounded" />
        </div>
      ))}
    </CardContent>
  </Card>
);

const SystemOverviewSkeleton: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">System Overview</CardTitle>
      <CardDescription>Quick health check</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
          <Skeleton className="h-8 w-12" />
        </div>
      ))}
    </CardContent>
  </Card>
);

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color,
  link,
}) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardContent className="pt-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 mt-2 text-sm",
                trend === "up" ? "text-emerald-600" : "text-red-600"
              )}
            >
              {trend === "up" ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            color
          )}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      {link && (
        <Link
          to={link}
          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mt-4 font-medium"
        >
          View details <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </CardContent>
  </Card>
);

const AlertItem: React.FC<{ alert: DashboardAlert }> = ({ alert }) => {
  const iconMap: Record<DashboardAlert["type"], LucideIcon> = {
    warning: AlertTriangle,
    error: AlertCircle,
    info: Info,
  };
  const colorMap: Record<DashboardAlert["type"], string> = {
    warning: "text-amber-600 bg-amber-50",
    error: "text-red-600 bg-red-50",
    info: "text-blue-600 bg-blue-50",
  };
  const Icon = iconMap[alert.type];

  return (
    <div className="flex items-start gap-3 p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
      <div
        className={cn(
          "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
          colorMap[alert.type]
        )}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-900 text-sm">{alert.title}</p>
        <p className="text-sm text-slate-500 mt-0.5">{alert.message}</p>
      </div>
      <Link to={alert.actionLink}>
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          {alert.actionLabel}
        </Button>
      </Link>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const {
    stats,
    subscriptionChart,
    userGrowth,
    monthlyUsers,
    alerts,
    loading,
    error,
    isLoading,
    hasData,
    loadAllData,
    refresh,
    clearDashboardError,
  } = useDashboard();

  useEffect(() => {
    if (!hasData) {
      loadAllData();
    }
  }, [hasData, loadAllData]);

  const handleRefresh = async () => {
    refresh();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header with refresh button skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600">
              Overview of your system metrics and alerts
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={loading.all}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`w-4 h-4 ${loading.all ? "animate-spin" : ""}`}
            />
            {loading.all ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2].map((i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ChartCardSkeleton
            title="Subscription Status"
            description="Current distribution"
          />
          <ChartCardSkeleton title="User Growth" description="Last 7 months" />
          <ChartCardSkeleton title="Monthly Users" description="New user registrations by month" />
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AlertCardSkeleton />
          <SystemOverviewSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
          <Button onClick={clearDashboardError} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const activePercentage =
    stats.activeSubscriptions +
      stats.expiredSubscriptions +
      stats.expiringSubscriptions >
    0
      ? Math.round(
          (stats.activeSubscriptions /
            (stats.activeSubscriptions +
              stats.expiredSubscriptions +
              stats.expiringSubscriptions)) *
            100
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600">
            Overview of your system metrics and alerts
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={loading.all}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw
            className={`w-4 h-4 ${loading.all ? "animate-spin" : ""}`}
          />
          {loading.all ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Top Row - Connection Test and User Profile */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConnectionTest />
        <UserProfile />
      </div> */}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          trend="up"
          trendValue="+12% this month"
          color="bg-gradient-to-br from-blue-500 to-blue-600"
          link="/users"
        />
        <StatCard
          title="Active Subscriptions"
          value={stats.activeSubscriptions}
          icon={CreditCard}
          trend="up"
          trendValue="+8% this month"
          color="bg-gradient-to-br from-emerald-500 to-emerald-600"
          link="/subscriptions"
        />
        {/* <StatCard
          title="Active Devices"
          value={stats.activeDevices}
          icon={Cpu}
          trend="up"
          trendValue="+15% this month"
          color="bg-gradient-to-br from-violet-500 to-violet-600"
          link="/devices"
        /> */}
        {/* <StatCard
          title="Logs Today"
          value={stats.logsToday.toLocaleString()}
          icon={ScrollText}
          color="bg-gradient-to-br from-slate-500 to-slate-600"
          link="/logs"
        /> */}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subscription Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Subscription Status</CardTitle>
            <CardDescription>Current distribution</CardDescription>
          </CardHeader>
          <CardContent>
            {subscriptionChart.length > 0 &&
            subscriptionChart.some((item: ChartData) => item.value > 0) ? (
              <div className="flex items-center">
                <div className="w-40 h-40 min-w-[160px] min-h-[160px] shrink-0">
                  <ResponsiveContainer width={160} height={160}>
                    <PieChart width={160} height={160}>
                      <Pie
                        data={subscriptionChart}
                        cx={80}
                        cy={80}
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {subscriptionChart.map((entry: ChartData, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-3">
                  {subscriptionChart.map((item: ChartData) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">
                            {item.name}
                          </span>
                          <span className="text-sm font-semibold text-slate-900">
                            {item.value}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-slate-500">
                <div className="text-center">
                  <CreditCard className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                  <p className="text-sm">No subscription data available</p>
                </div>
              </div>
            )}
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-500">Active Rate</span>
                <span className="font-semibold text-emerald-600">
                  {isNaN(activePercentage) ? "0" : activePercentage}%
                </span>
              </div>
              <Progress
                value={isNaN(activePercentage) ? 0 : activePercentage}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* User Growth */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">User Growth</CardTitle>
            <CardDescription>Last 7 months</CardDescription>
          </CardHeader>
          <CardContent>
            {userGrowth.length > 0 ? (
              <div className="h-48 min-h-[192px] w-full">
                <ResponsiveContainer width="100%" height={192}>
                  <AreaChart
                    data={userGrowth}
                    margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="userGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3B82F6"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3B82F6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                      }}
                      labelStyle={{ fontWeight: 600 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="users"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      fill="url(#userGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-slate-500">
                <div className="text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                  <p className="text-sm">No user growth data available</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Users Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Monthly Users</CardTitle>
            <CardDescription>New user registrations by month</CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyUsers.length > 0 ? (
              <div className="h-48 min-h-[192px] w-full">
                <ResponsiveContainer width="100%" height={192}>
                  <AreaChart
                    data={monthlyUsers}
                    margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient
                        id="monthlyUserGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#10B981"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10B981"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        backgroundColor: "white",
                      }}
                      labelStyle={{ fontWeight: 600, color: "#1f2937" }}
                      formatter={(value: number | undefined) => [value || 0, "New Users"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="newUsers"
                      stroke="#10B981"
                      strokeWidth={2}
                      fill="url(#monthlyUserGradient)"
                      dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "#10B981", strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-slate-500">
                <div className="text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                  <p className="text-sm">No monthly user data available</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Alerts & Warnings</CardTitle>
              <CardDescription>Requires attention</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-slate-600">
                {alerts.length} active
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {alerts.length > 0 ? (
              alerts.map((alert: DashboardAlert) => <AlertItem key={alert.id} alert={alert} />)
            ) : (
              <div className="flex items-center justify-center h-32 text-slate-500">
                <div className="text-center">
                  <Activity className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                  <p className="text-sm">No alerts at this time</p>
                  <p className="text-xs text-slate-400 mt-1">
                    All systems running normally
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">System Overview</CardTitle>
            <CardDescription>Quick health check</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Expiring Soon</p>
                  <p className="text-sm text-slate-500">
                    Subscriptions in next 7 days
                  </p>
                </div>
              </div>
              <span className="text-2xl font-bold text-amber-600">
                {stats.expiringSubscriptions}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Failed Logins</p>
                  <p className="text-sm text-slate-500">Last 24 hours</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-red-600">
                {stats.failedLoginAttempts}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Offline Devices</p>
                  <p className="text-sm text-slate-500">
                    Currently unreachable
                  </p>
                </div>
              </div>
              <span className="text-2xl font-bold text-slate-600">
                {stats.offlineDevices}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">System Status</p>
                  <p className="text-sm text-slate-500">
                    All services operational
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
                Healthy
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
