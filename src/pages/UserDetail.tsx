/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format, formatDistanceToNow } from "date-fns";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Clock,
  CreditCard,
  Cpu,
  Shield,
  MoreHorizontal,
  Pencil,
  UserX,
  UserCheck,
  RotateCcw,
  LogOut,
  AlertTriangle,
  Loader2,
  Plus,
  CalendarDays,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import StatusBadge from "../components/common/StatusBadge";
import DataTable from "../components/common/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Progress } from "../components/ui/progress";
import { showErrorToast, showSuccessToast } from "../utils/errorHandler";
import { getSubscriptionStatusInfo, getSubscriptionMessage } from "../utils/subscriptionUtils";
import { userService } from "../services/userService";
import {
  subscriptionService,
  Subscription,
} from "../services/subscriptionService";
import { useCustomPageTitle } from "../hooks/usePageTitle";
import { useBreadcrumb } from "../context/BreadcrumbContext";
import type { User } from "../data/mock";

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState<User | null>(null);
  const [userSubscriptions, setUserSubscriptions] = useState<Subscription[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isExtendDialogOpen, setIsExtendDialogOpen] = useState(false);
  const [isExpireDialogOpen, setIsExpireDialogOpen] = useState(false);
  const [assignForm, setAssignForm] = useState({
    startDate: "",
    endDate: "",
  });
  const [extendForm, setExtendForm] = useState({
    newEndDate: "",
  });
  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] = useState(false);
  const [editProfileForm, setEditProfileForm] = useState({
    name: "",
    email: "",
    mobile: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const { setCustomBreadcrumbs, setPageTitle, setIsLoading } = useBreadcrumb();

  // Set dynamic page title based on user name
  useCustomPageTitle(
    user
      ? `${user.name} - User Details - Admin Panel`
      : "User Details - Admin Panel"
  );

  // Helper function to extract numeric ID from USR-XXX format
  const extractNumericId = (userId: string): string => {
    return userId.startsWith("USR-") ? userId.replace("USR-", "") : userId;
  };

  // Helper function to get active subscription from the list
  const getActiveSubscription = (): Subscription | null => {
    if (!userSubscriptions.length) return null;

    // Find the active subscription
    const activeSubscription = userSubscriptions.find(
      (sub) => sub.status === "ACTIVE"
    );
    if (!activeSubscription) return null;

    // Check if it's actually active (not expired by date)
    const now = new Date();
    const endDate = new Date(activeSubscription.end_date);

    return endDate > now ? activeSubscription : null;
  };

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      if (!id) {
        setError("User ID is required");
        setLoading(false);
        return;
      }

      // Set loading state for breadcrumbs
      setIsLoading(true);
      setCustomBreadcrumbs([
        { title: "User Management", path: "/users", isLast: false },
        { title: "", path: `/users/${id}`, isLast: true }, // Empty title when loading
      ]);

      try {
        setLoading(true);
        setError(null);
        const [userData, subscriptionsData] = await Promise.all([
          userService.getUserById(id),
          subscriptionService.getUserSubscriptions(extractNumericId(id!)),
        ]);

        setUser(userData);
        setUserSubscriptions(subscriptionsData);

        // Initialize edit form with user data
        setEditProfileForm({
          name: userData.name,
          email: userData.email,
          mobile: userData.mobile,
        });

        // Update breadcrumbs with actual username
        setIsLoading(false);
        setCustomBreadcrumbs([
          { title: "User Management", path: "/users", isLast: false },
          { title: userData.name, path: `/users/${id}`, isLast: true },
        ]);
        setPageTitle(userData.name);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load user data");
        // Set error state in breadcrumbs
        setIsLoading(false);
        setCustomBreadcrumbs([
          { title: "User Management", path: "/users", isLast: false },
          { title: "Error", path: `/users/${id}`, isLast: true },
        ]);
        setPageTitle("Error");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, setCustomBreadcrumbs, setPageTitle, setIsLoading]);

  // Clean up breadcrumbs when component unmounts
  useEffect(() => {
    return () => {
      setCustomBreadcrumbs(null);
      setPageTitle(null);
      setIsLoading(false);
    };
  }, [setCustomBreadcrumbs, setPageTitle, setIsLoading]);

  // Handle user actions
  const handleToggleStatus = async () => {
    if (!user) return;

    try {
      const newStatus = user.accountStatus === "enabled" ? false : true;
      await userService.updateUserStatus(user.id, newStatus);

      // Update local state
      setUser((prev) =>
        prev
          ? {
              ...prev,
              accountStatus: newStatus ? "enabled" : "disabled",
            }
          : null
      );

      showSuccessToast(
        `Account ${newStatus ? "enabled" : "disabled"} successfully`
      );
    } catch (err) {
      console.error("Error updating user status:", err);
      showErrorToast(err, "Failed to update account status");
    }
  };

  const handleForceLogout = async () => {
    if (!user) return;

    try {
      await userService.forceLogoutUser(user.id);
      showSuccessToast("User logged out from all sessions");
    } catch (err) {
      console.error("Error forcing logout:", err);
      showErrorToast(err, "Failed to logout user");
    }
  };

  const handleResetSubscription = async () => {
    if (!user) return;

    try {
      const updatedUser = await userService.resetUserSubscription(user.id);
      setUser(updatedUser);
      showSuccessToast("Subscription reset successfully");
    } catch (err) {
      console.error("Error resetting subscription:", err);
      showErrorToast(err, "Failed to reset subscription");
    }
  };

  const handleAssignSubscription = async () => {
    if (!user || !assignForm.startDate || !assignForm.endDate) return;

    try {
      setSubmitting(true);
      await subscriptionService.assignSubscription(
        extractNumericId(user.id),
        assignForm.startDate,
        assignForm.endDate
      );

      // Refresh subscription data
      const subscriptionsData = await subscriptionService.getUserSubscriptions(
        extractNumericId(user.id)
      );
      setUserSubscriptions(subscriptionsData);

      setIsAssignDialogOpen(false);
      setAssignForm({ startDate: "", endDate: "" });
      showSuccessToast("Subscription assigned successfully");
    } catch (err) {
      console.error("Error assigning subscription:", err);
      showErrorToast(err, "Failed to assign subscription");
    } finally {
      setSubmitting(false);
    }
  };

  const handleExtendSubscription = async () => {
    if (!user || !extendForm.newEndDate) return;

    try {
      setSubmitting(true);
      await subscriptionService.extendSubscription(
        extractNumericId(user.id),
        extendForm.newEndDate
      );

      // Refresh subscription data
      const subscriptionsData = await subscriptionService.getUserSubscriptions(
        extractNumericId(user.id)
      );
      setUserSubscriptions(subscriptionsData);

      setIsExtendDialogOpen(false);
      setExtendForm({ newEndDate: "" });
      showSuccessToast("Subscription extended successfully");
    } catch (err) {
      console.error("Error extending subscription:", err);
      showErrorToast(err, "Failed to extend subscription");
    } finally {
      setSubmitting(false);
    }
  };

  const handleExpireSubscription = async () => {
    if (!user) return;

    try {
      setSubmitting(true);
      await subscriptionService.expireSubscription(extractNumericId(user.id));

      // Refresh subscription data
      const subscriptionsData = await subscriptionService.getUserSubscriptions(
        extractNumericId(user.id)
      );
      setUserSubscriptions(subscriptionsData);

      setIsExpireDialogOpen(false);
      showSuccessToast("Subscription expired successfully");
    } catch (err) {
      console.error("Error expiring subscription:", err);
      showErrorToast(err, "Failed to expire subscription");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProfile = async () => {
    if (!user) return;

    // Basic validation
    if (!editProfileForm.name.trim()) {
      showErrorToast("Name is required");
      return;
    }

    if (!editProfileForm.email.trim()) {
      showErrorToast("Email is required");
      return;
    }

    if (!editProfileForm.mobile.trim()) {
      showErrorToast("Mobile number is required");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editProfileForm.email)) {
      showErrorToast("Please enter a valid email address");
      return;
    }

    try {
      setSubmitting(true);
      const updatedUser = await userService.updateUser(user.id, {
        name: editProfileForm.name.trim(),
        email: editProfileForm.email.trim(),
        mobile: editProfileForm.mobile.trim(),
      });

      // Update local state
      setUser(updatedUser);

      // Update breadcrumbs with new name if changed
      if (updatedUser.name !== user.name) {
        setCustomBreadcrumbs([
          { title: "User Management", path: "/users", isLast: false },
          { title: updatedUser.name, path: `/users/${id}`, isLast: true },
        ]);
        setPageTitle(updatedUser.name);
      }

      setIsEditProfileDialogOpen(false);
      showSuccessToast("Profile updated successfully");
    } catch (err) {
      console.error("Error updating profile:", err);
      showErrorToast(err, "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEditProfile = () => {
    if (user) {
      setEditProfileForm({
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      });
      setIsEditProfileDialogOpen(true);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
        <p className="text-slate-500">Loading user details...</p>
      </div>
    );
  }

  // Error state
  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          {error || "User Not Found"}
        </h2>
        <p className="text-slate-500 mb-4">
          {error || "The user you're looking for doesn't exist."}
        </p>
        <Button onClick={() => navigate("/users")} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Users
        </Button>
      </div>
    );
  }

  const getInitials = (name: string) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const getSubscriptionDaysLeft = () => {
    const activeSubscription = getActiveSubscription();
    if (!activeSubscription) return 0;
    return Math.ceil(
      (new Date(activeSubscription.end_date).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    );
  };

  const isSubscriptionActive = () => {
    const activeSubscription = getActiveSubscription();
    if (!activeSubscription) return false;
    const now = new Date();
    const endDate = new Date(activeSubscription.end_date);
    return activeSubscription.status === "ACTIVE" && endDate > now;
  };

  // Mock data for devices and logs (these would come from separate API calls in a real app)
  const userDevices: Array<{
    id: string;
    name: string;
    status: string;
    lastSeen: string;
    firmwareVersion: string;
  }> = []; // TODO: Implement device API

  const userLogs: Array<{
    id: string;
    timestamp: string;
    action: string;
    status: string;
    severity: string;
    details: string;
  }> = []; // TODO: Implement logs API

  const deviceColumns: Array<{
    header: string;
    accessor: string;
    render?: (
      value: unknown,
      row: {
        id: string;
        name: string;
        status: string;
        lastSeen: string;
        firmwareVersion: string;
      }
    ) => React.ReactNode;
  }> = [
    {
      header: "Device",
      accessor: "name",
      render: (value: unknown, row: { id: string }) => (
        <div>
          <p className="font-medium text-slate-900">{String(value)}</p>
          <p className="text-xs font-mono text-slate-500">{row.id}</p>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (value: unknown) => <StatusBadge status={String(value)} />,
    },
    {
      header: "Last Seen",
      accessor: "lastSeen",
      render: (value: unknown) =>
        formatDistanceToNow(new Date(String(value)), { addSuffix: true }),
    },
    {
      header: "Firmware",
      accessor: "firmwareVersion",
      render: (value: unknown) => (
        <span className="font-mono text-sm">{String(value)}</span>
      ),
    },
  ];

  const logColumns: Array<{
    header: string;
    accessor: string;
    render?: (
      value: unknown,
      row: {
        id: string;
        timestamp: string;
        action: string;
        status: string;
        severity: string;
        details: string;
      }
    ) => React.ReactNode;
  }> = [
    {
      header: "Time",
      accessor: "timestamp",
      render: (value: unknown) => (
        <div>
          <p className="text-sm">
            {format(new Date(String(value)), "MMM d, HH:mm")}
          </p>
          <p className="text-xs text-slate-500">
            {formatDistanceToNow(new Date(String(value)), { addSuffix: true })}
          </p>
        </div>
      ),
    },
    {
      header: "Action",
      accessor: "action",
      render: (value: unknown) => (
        <span className="capitalize">{String(value).replace(/_/g, " ")}</span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (value: unknown) => <StatusBadge status={String(value)} />,
    },
    {
      header: "Severity",
      accessor: "severity",
      render: (value: unknown) => <StatusBadge status={String(value)} />,
    },
    {
      header: "Details",
      accessor: "details",
      render: (value: unknown) => (
        <span className="text-sm text-slate-600 truncate max-w-xs block">
          {String(value)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate("/users")}
        className="mb-2"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Users
      </Button>

      {/* User Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-blue-100 text-blue-700 text-xl font-semibold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900">
                  {user.name}
                </h1>
                <StatusBadge status={user.accountStatus} />
              </div>
              <p className="text-slate-500 font-mono text-sm mt-1">{user.id}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" /> {user.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4" /> {user.mobile}
                </span>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Actions <MoreHorizontal className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleOpenEditProfile}>
                <Pencil className="w-4 h-4 mr-2" /> Edit Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleToggleStatus}>
                {user.accountStatus === "enabled" ? (
                  <>
                    <UserX className="w-4 h-4 mr-2" /> Disable Account
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4 mr-2" /> Enable Account
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleResetSubscription}>
                <RotateCcw className="w-4 h-4 mr-2" /> Reset Subscription
              </DropdownMenuItem>
              {/* <DropdownMenuItem onClick={handleForceLogout}>
                <LogOut className="w-4 h-4 mr-2" /> Force Logout
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview & Profile</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          {/* <TabsTrigger value="devices">Devices ({userDevices.length})</TabsTrigger>
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger> */}
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Member Since</p>
                    <p className="font-semibold text-slate-900">
                      {format(new Date(user.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Last Login</p>
                    <p className="font-semibold text-slate-900">
                      {user.lastLogin
                        ? formatDistanceToNow(new Date(user.lastLogin), {
                            addSuffix: true,
                          })
                        : "Never"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Assigned Devices</p>
                    <p className="font-semibold text-slate-900">
                      {user.assignedDevices} devices
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Information Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Personal information and contact details
                  </CardDescription>
                </div>
                <Button
                  onClick={handleOpenEditProfile}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-500">
                      Full Name
                    </Label>
                    <p className="text-lg font-semibold text-slate-900 mt-1">
                      {user.name}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-500">
                      Email Address
                    </Label>
                    <p className="text-lg text-slate-900 mt-1">{user.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-500">
                      Mobile Number
                    </Label>
                    <p className="text-lg text-slate-900 mt-1">{user.mobile}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-500">
                      User ID
                    </Label>
                    <p className="text-lg font-mono text-slate-900 mt-1">
                      {user.id}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-500">
                      Account Status
                    </Label>
                    <div className="mt-1">
                      <StatusBadge status={user.accountStatus} />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-500">
                      Subscription Status
                    </Label>
                    <div className="mt-1 space-y-1">
                      <StatusBadge status={getSubscriptionStatusInfo(user).status} />
                      <p className="text-xs text-slate-500">
                        {getSubscriptionStatusInfo(user).message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Activity Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Account Activity Summary</CardTitle>
              <CardDescription>
                Recent activity and account statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="text-sm text-slate-500">Last Login</p>
                      <p className="font-medium text-slate-900">
                        {user.lastLogin
                          ? format(
                              new Date(user.lastLogin),
                              "MMM d, yyyy HH:mm"
                            )
                          : "Never"}
                      </p>
                      <p className="text-xs text-slate-400">
                        {user.lastLogin
                          ? formatDistanceToNow(new Date(user.lastLogin), {
                              addSuffix: true,
                            })
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Cpu className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="text-sm text-slate-500">
                        Connected Devices
                      </p>
                      <p className="font-medium text-slate-900">
                        {user.assignedDevices} devices
                      </p>
                      <p className="text-xs text-slate-400">
                        Currently assigned
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="text-sm text-slate-500">Subscription</p>
                      <StatusBadge status={getSubscriptionStatusInfo(user).status} />
                      <p className="text-xs text-slate-400 mt-1">
                        {getSubscriptionStatusInfo(user).message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="mt-6">
          <div className="space-y-6">
            {/* Current Subscription Status */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Current Subscription</CardTitle>
                    <CardDescription>
                      Active subscription status and details
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {getActiveSubscription() ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsExtendDialogOpen(true)}
                        >
                          <CalendarDays className="w-4 h-4 mr-2" />
                          Extend
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsExpireDialogOpen(true)}
                        >
                          Expire
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => setIsAssignDialogOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Assign Subscription
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {(() => {
                  const activeSubscription = getActiveSubscription();
                  return activeSubscription ? (
                    <>
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-6 h-6 text-slate-600" />
                          <div>
                            <p className="font-semibold text-slate-900">
                              Active Subscription
                            </p>
                            <p className="text-sm text-slate-500">
                              {format(
                                new Date(activeSubscription.start_date),
                                "MMM d, yyyy"
                              )}{" "}
                              -{" "}
                              {format(
                                new Date(activeSubscription.end_date),
                                "MMM d, yyyy"
                              )}
                            </p>
                          </div>
                        </div>
                        <StatusBadge
                          status={getSubscriptionStatusInfo(user).status}
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-slate-600">
                            Subscription Period
                          </span>
                          <span className="text-sm font-medium">
                            {getSubscriptionDaysLeft() > 0
                              ? `${getSubscriptionDaysLeft()} days remaining`
                              : "Expired"}
                          </span>
                        </div>
                        <Progress
                          value={Math.max(
                            0,
                            Math.min(
                              100,
                              (getSubscriptionDaysLeft() / 30) * 100
                            )
                          )}
                          className="h-2"
                        />
                        <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                          <span>
                            Started:{" "}
                            {format(
                              new Date(activeSubscription.start_date),
                              "MMM d, yyyy"
                            )}
                          </span>
                          <span>
                            Expires:{" "}
                            {format(
                              new Date(activeSubscription.end_date),
                              "MMM d, yyyy"
                            )}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 mb-2">No Active Subscription</p>
                      <p className="text-sm text-slate-400 mb-4">
                        {getSubscriptionMessage(user, 'detailed')}
                      </p>
                      {/* <Button 
                        onClick={() => setIsAssignDialogOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Assign Subscription
                      </Button> */}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>

            {/* Subscription History */}
            {userSubscriptions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Subscription History</CardTitle>
                  <CardDescription>
                    All past and current subscriptions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userSubscriptions.map((subscription) => (
                      <div
                        key={subscription.id}
                        className="flex items-center justify-between p-3 border border-slate-200 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-slate-900">
                            {format(
                              new Date(subscription.start_date),
                              "MMM d, yyyy"
                            )}{" "}
                            -{" "}
                            {format(
                              new Date(subscription.end_date),
                              "MMM d, yyyy"
                            )}
                          </p>
                          <p className="text-sm text-slate-500">
                            Created:{" "}
                            {format(
                              new Date(subscription.created_at),
                              "MMM d, yyyy"
                            )}
                          </p>
                        </div>
                        <StatusBadge
                          status={subscription.status.toLowerCase()}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="devices" className="mt-6">
          <DataTable
            columns={deviceColumns}
            data={userDevices}
            pagination={false}
            searchable={false}
            emptyState={
              <div className="text-center py-8">
                <Cpu className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">
                  No devices assigned to this user
                </p>
              </div>
            }
          />
        </TabsContent>

        <TabsContent value="logs" className="mt-6">
          <DataTable columns={logColumns} data={userLogs} pageSize={5} />
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Information</CardTitle>
              <CardDescription>
                Account security and access details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="font-medium text-slate-900">
                      Phone OTP Authentication
                    </p>
                    <p className="text-sm text-slate-500">
                      Primary login method
                    </p>
                  </div>
                </div>
                <StatusBadge status="active">Enabled</StatusBadge>
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Active Sessions</p>
                  <p className="text-sm text-slate-500">1 mobile device</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    showSuccessToast("Terminate sessions feature coming soon")
                  }
                >
                  Terminate All
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">
                    Failed Login Attempts
                  </p>
                  <p className="text-sm text-slate-500">Last 30 days</p>
                </div>
                <span className="text-lg font-semibold text-slate-900">0</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Assign Subscription Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Subscription</DialogTitle>
            <DialogDescription>
              Set the start and end dates for the user's subscription.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={assignForm.startDate}
                onChange={(e) =>
                  setAssignForm((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={assignForm.endDate}
                onChange={(e) =>
                  setAssignForm((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAssignDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssignSubscription}
              disabled={
                !assignForm.startDate || !assignForm.endDate || submitting
              }
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Assigning...
                </>
              ) : (
                "Assign Subscription"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Extend Subscription Dialog */}
      <Dialog open={isExtendDialogOpen} onOpenChange={setIsExtendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Extend Subscription</DialogTitle>
            <DialogDescription>
              Set a new end date to extend the current subscription.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newEndDate">New End Date</Label>
              <Input
                id="newEndDate"
                type="date"
                value={extendForm.newEndDate}
                onChange={(e) =>
                  setExtendForm((prev) => ({
                    ...prev,
                    newEndDate: e.target.value,
                  }))
                }
                min={(() => {
                  const activeSubscription = getActiveSubscription();
                  return activeSubscription
                    ? format(
                        new Date(activeSubscription.end_date),
                        "yyyy-MM-dd"
                      )
                    : undefined;
                })()}
              />
              {(() => {
                const activeSubscription = getActiveSubscription();
                return (
                  activeSubscription && (
                    <p className="text-sm text-slate-500">
                      Current end date:{" "}
                      {format(
                        new Date(activeSubscription.end_date),
                        "MMM d, yyyy"
                      )}
                    </p>
                  )
                );
              })()}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsExtendDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExtendSubscription}
              disabled={!extendForm.newEndDate || submitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Extending...
                </>
              ) : (
                "Extend Subscription"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Expire Subscription Confirmation Dialog */}
      <Dialog open={isExpireDialogOpen} onOpenChange={setIsExpireDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Expire Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to expire this user's subscription? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <div>
                <p className="font-medium text-amber-800">Warning</p>
                <p className="text-sm text-amber-700">
                  The user will immediately lose access to their subscription
                  benefits.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsExpireDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExpireSubscription}
              disabled={submitting}
              variant="destructive"
              className="bg-red-500"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Expiring...
                </>
              ) : (
                "Yes, Expire Subscription"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog
        open={isEditProfileDialogOpen}
        onOpenChange={setIsEditProfileDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit User Profile</DialogTitle>
            <DialogDescription>
              Update the user's profile information. All fields are required.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editName">Full Name *</Label>
              <Input
                id="editName"
                type="text"
                placeholder="Enter full name"
                value={editProfileForm.name}
                onChange={(e) =>
                  setEditProfileForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className={
                  !editProfileForm.name.trim()
                    ? "border-red-300 focus:border-red-500"
                    : ""
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editEmail">Email Address *</Label>
              <Input
                id="editEmail"
                type="email"
                placeholder="Enter email address"
                value={editProfileForm.email}
                onChange={(e) =>
                  setEditProfileForm((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                className={
                  !editProfileForm.email.trim() ||
                  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editProfileForm.email)
                    ? "border-red-300 focus:border-red-500"
                    : ""
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editMobile">Mobile Number *</Label>
              <Input
                id="editMobile"
                type="tel"
                placeholder="Enter mobile number"
                value={editProfileForm.mobile}
                onChange={(e) =>
                  setEditProfileForm((prev) => ({
                    ...prev,
                    mobile: e.target.value,
                  }))
                }
                className={
                  !editProfileForm.mobile.trim()
                    ? "border-red-300 focus:border-red-500"
                    : ""
                }
              />
            </div>
            <p className="text-sm text-slate-500">* Required fields</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditProfileDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditProfile}
              disabled={
                !editProfileForm.name.trim() ||
                !editProfileForm.email.trim() ||
                !editProfileForm.mobile.trim() ||
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editProfileForm.email) ||
                submitting
              }
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDetail;
