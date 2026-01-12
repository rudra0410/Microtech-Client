/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow, format } from "date-fns";
import {
  Plus,
  MoreHorizontal,
  Eye,
  EyeOff,
  Pencil,
  UserX,
  UserCheck,
  RotateCcw,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { type User } from "../data/mock";
import { type CreateUserData } from "../services/userService";
import { useUsers } from "../hooks";
import DataTable from "../components/common/DataTable";
import StatusBadge from "../components/common/StatusBadge";
import { TableSkeleton } from "../components/common/LoadingState";
import { Button } from "../components/ui/button";
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
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { getSubscriptionStatusInfo } from "../utils/subscriptionUtils";

interface ConfirmDialog {
  open: boolean;
  type: "toggle" | "reset" | "logout" | "bulk-enable" | "bulk-disable" | null;
  user: User | null;
  count?: number;
}

const Users = () => {
  const navigate = useNavigate();
  const {
    users,
    loading,
    loadUsers,
    createNewUser,
    toggleUserStatus,
    resetSubscription,
    forceUserLogout,
  } = useUsers();

  const [refreshing, setRefreshing] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // Track which user action is loading
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]); // Track selected users for bulk actions
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialog>({
    open: false,
    type: null,
    user: null,
  });
  const [newUser, setNewUser] = useState<CreateUserData>({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [mobileInput, setMobileInput] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    if (value.length <= 10) {
      setMobileInput(value);
      // Update the newUser mobile with +91 prefix
      setNewUser((p) => ({ ...p, mobile: value ? `+91${value}` : "" }));
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    if (users.length === 0) {
      loadUsers();
    }
  }, [users.length, loadUsers]);

  // Refresh users function
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadUsers();
      toast.success("Users refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh users");
    } finally {
      setRefreshing(false);
    }
  };

  const handleViewUser = (user: User) => {
    navigate(`/users/${user.id}`);
  };

  const handleToggleStatus = async (user: User) => {
    try {
      setActionLoading(`toggle-${user.id}`);
      const isCurrentlyEnabled = user.accountStatus === "enabled";
      const newActiveStatus = !isCurrentlyEnabled; // If currently enabled, disable (false), if disabled, enable (true)

      await toggleUserStatus(user.id, newActiveStatus);
      toast.success(
        `User ${newActiveStatus ? "enabled" : "disabled"} successfully`
      );
      setConfirmDialog({ open: false, type: null, user: null });
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleResetSubscription = async (user: User) => {
    try {
      setActionLoading(`reset-${user.id}`);
      await resetSubscription(user.id);
      toast.success("Subscription reset successfully");
      setConfirmDialog({ open: false, type: null, user: null });
    } catch (error) {
      console.error("Error resetting subscription:", error);
      toast.error("Failed to reset subscription");
    } finally {
      setActionLoading(null);
    }
  };

  const handleForceLogout = async (user: User) => {
    try {
      setActionLoading(`logout-${user.id}`);
      await forceUserLogout(user.id);
      toast.success(`${user.name} has been logged out from all sessions`);
      setConfirmDialog({ open: false, type: null, user: null });
    } catch (error) {
      console.error("Error forcing logout:", error);
      toast.error("Failed to logout user");
    } finally {
      setActionLoading(null);
    }
  };

  const handleBulkEnable = async () => {
    if (selectedUsers.length === 0) return;
    setConfirmDialog({
      open: true,
      type: "bulk-enable",
      user: null,
      count: selectedUsers.length,
    });
  };

  const handleBulkDisable = async () => {
    if (selectedUsers.length === 0) return;
    setConfirmDialog({
      open: true,
      type: "bulk-disable",
      user: null,
      count: selectedUsers.length,
    });
  };

  const executeBulkEnable = async () => {
    setBulkActionLoading(true);
    try {
      const promises = selectedUsers.map((userId) =>
        toggleUserStatus(userId, true)
      );
      await Promise.all(promises);
      toast.success(`${selectedUsers.length} users enabled successfully`);
      setSelectedUsers([]);
      setConfirmDialog({ open: false, type: null, user: null });
    } catch (error) {
      console.error("Error enabling users:", error);
      toast.error("Failed to enable some users");
    } finally {
      setBulkActionLoading(false);
    }
  };

  const executeBulkDisable = async () => {
    setBulkActionLoading(true);
    try {
      const promises = selectedUsers.map((userId) =>
        toggleUserStatus(userId, false)
      );
      await Promise.all(promises);
      toast.success(`${selectedUsers.length} users disabled successfully`);
      setSelectedUsers([]);
      setConfirmDialog({ open: false, type: null, user: null });
    } catch (error) {
      console.error("Error disabling users:", error);
      toast.error("Failed to disable some users");
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      setIsCreating(true);
      await createNewUser(newUser);
      setNewUser({ name: "", email: "", mobile: "", password: "" });
      setMobileInput("");
      setIsCreateOpen(false);
      toast.success("User created successfully");
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user");
    } finally {
      setIsCreating(false);
    }
  };

  const columns: Array<{
    header: string;
    accessor: keyof User | string;
    sortable?: boolean;
    render?: (value: unknown, row: User) => React.ReactNode;
  }> = [
    {
      header: "Name",
      accessor: "name",
      sortable: true,
      render: (value: unknown) => (
        <span className="font-medium text-slate-900">{String(value)}</span>
      ),
    },
    {
      header: "Email",
      accessor: "email",
      sortable: true,
      render: (value: unknown) => (
        <span className="text-slate-600">{String(value)}</span>
      ),
    },
    {
      header: "Mobile",
      accessor: "mobile",
      render: (value: unknown) => (
        <span className="text-slate-600">{String(value)}</span>
      ),
    },
    {
      header: "Subscription",
      accessor: "subscriptionStatus",
      sortable: true,
      render: (value: unknown, row: User) => {
        console.log(row);
        const subscriptionInfo = getSubscriptionStatusInfo(row);
        console.log(subscriptionInfo);

        return (
          <div>
            <StatusBadge status={subscriptionInfo.status} />
            <p className="text-xs text-slate-500 mt-1">
              {subscriptionInfo.message}
            </p>
          </div>
        );
      },
    },
    // {
    //   header: 'Devices',
    //   accessor: 'assignedDevices',
    //   sortable: true,
    //   render: (value: number) => (
    //     <div className="flex items-center gap-1">
    //       <Cpu className="w-4 h-4 text-slate-400" />
    //       <span>{value}</span>
    //     </div>
    //   ),
    // },
    {
      header: "Status",
      accessor: "accountStatus",
      sortable: true,
      render: (value: unknown, row: User) => (
        <div className="flex items-center gap-2">
          <StatusBadge status={String(value)} />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDialog({ open: true, type: "toggle", user: row });
                  }}
                  disabled={actionLoading === `toggle-${row.id}`}
                  className="h-6 px-2 text-xs hover:bg-slate-100"
                >
                  {actionLoading === `toggle-${row.id}` ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : row.accountStatus === "enabled" ? (
                    <UserX className="w-3 h-3 text-red-600" />
                  ) : (
                    <UserCheck className="w-3 h-3 text-green-600" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {row.accountStatus === "enabled" ? "Disable" : "Enable"} user
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    },
    {
      header: "Created",
      accessor: "createdAt",
      sortable: true,
      render: (value: unknown) => (
        <div>
          <p className="text-slate-900">
            {format(new Date(String(value)), "MMM d, yyyy")}
          </p>
          <p className="text-xs text-slate-500">
            {formatDistanceToNow(new Date(String(value)), { addSuffix: true })}
          </p>
        </div>
      ),
    },
    {
      header: "Last Login",
      accessor: "lastLogin",
      sortable: true,
      render: (value: unknown, row: User) => (
        <div>
          {value ? (
            <>
              <p className="text-slate-900">
                {format(new Date(String(value)), "MMM d, yyyy")}
              </p>
              <p className="text-xs text-slate-500">
                {formatDistanceToNow(new Date(String(value)), {
                  addSuffix: true,
                })}
              </p>
            </>
          ) : (
            <p className="text-slate-500 text-sm">Never logged in</p>
          )}
        </div>
      ),
    },
    // {
    //   header: "Actions",
    //   accessor: "id",
    //   render: (_: unknown, row: User) => (
    //     <DropdownMenu>
    //       <DropdownMenuTrigger asChild>
    //         <Button variant="ghost" size="icon" className="h-8 w-8">
    //           <MoreHorizontal className="w-4 h-4" />
    //         </Button>
    //       </DropdownMenuTrigger>
    //       <DropdownMenuContent align="end" className="w-48">
    //         <DropdownMenuItem onClick={() => handleViewUser(row)}>
    //           <Eye className="w-4 h-4 mr-2" /> View Details
    //         </DropdownMenuItem>
    //         <DropdownMenuItem>
    //           <Pencil className="w-4 h-4 mr-2" /> Edit Profile
    //         </DropdownMenuItem>
    //         <DropdownMenuSeparator />
    //         {/* <DropdownMenuItem
    //           onClick={() =>
    //             setConfirmDialog({ open: true, type: "toggle", user: row })
    //           }
    //           disabled={actionLoading === `toggle-${row.id}`}
    //         >
    //           {actionLoading === `toggle-${row.id}` ? (
    //             <Loader2 className="w-4 h-4 mr-2 animate-spin" />
    //           ) : row.accountStatus === "enabled" ? (
    //             <UserX className="w-4 h-4 mr-2" />
    //           ) : (
    //             <UserCheck className="w-4 h-4 mr-2" />
    //           )}
    //           {actionLoading === `toggle-${row.id}`
    //             ? "Processing..."
    //             : row.accountStatus === "enabled"
    //             ? "Disable Account"
    //             : "Enable Account"}
    //         </DropdownMenuItem> */}
    //         {/* <DropdownMenuItem
    //           onClick={() =>
    //             setConfirmDialog({ open: true, type: "reset", user: row })
    //           }
    //           disabled={actionLoading === `reset-${row.id}`}
    //         >
    //           {actionLoading === `reset-${row.id}` ? (
    //             <Loader2 className="w-4 h-4 mr-2 animate-spin" />
    //           ) : (
    //             <RotateCcw className="w-4 h-4 mr-2" />
    //           )}
    //           {actionLoading === `reset-${row.id}`
    //             ? "Processing..."
    //             : "Reset Subscription"}
    //         </DropdownMenuItem> */}
    //         {/* <DropdownMenuItem
    //           onClick={() =>
    //             setConfirmDialog({ open: true, type: "logout", user: row })
    //           }
    //         >
    //           <LogOut className="w-4 h-4 mr-2" /> Force Logout
    //         </DropdownMenuItem> */}
    //       </DropdownMenuContent>
    //     </DropdownMenu>
    //   ),
    // },
  ];

  const filters = [
    {
      key: "subscriptionStatus",
      label: "Subscription",
      options: [
        { value: "active", label: "Active" },
        { value: "expired", label: "Expired" },
        { value: "cancelled", label: "Cancelled" },
        { value: "inactive", label: "Inactive" },
      ],
    },
    {
      key: "accountStatus",
      label: "Status",
      options: [
        { value: "enabled", label: "Enabled" },
        { value: "disabled", label: "Disabled" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">All Users</h2>
          <p className="text-sm text-slate-500">
            {users.length} total users
            {selectedUsers.length > 0 && (
              <span className="ml-2 text-blue-600">
                • {selectedUsers.length} selected
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedUsers.length > 0 && (
            <>
              <Button
                variant="outline"
                onClick={handleBulkEnable}
                disabled={bulkActionLoading}
                className="flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                Enable ({selectedUsers.length})
              </Button>
              <Button
                variant="outline"
                onClick={handleBulkDisable}
                disabled={bulkActionLoading}
                className="flex items-center gap-2"
              >
                <UserX className="w-4 h-4" />
                Disable ({selectedUsers.length})
              </Button>
            </>
          )}
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" /> Add User
          </Button>
        </div>
      </div>

      {/* Data Table */}
      {refreshing ? (
        <TableSkeleton rows={8} />
      ) : (
        <DataTable
          columns={columns}
          data={users}
          selectable={true}
          onSelectionChange={setSelectedUsers}
          searchPlaceholder="Search users by name, email, or ID..."
          filters={filters}
          onRowClick={handleViewUser}
          isLoading={loading}
        />
      )}

      {/* Create User Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new user to the system.
              {/* They will receive their login credentials and can change their password after first login. */}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="John Doe"
                disabled={isCreating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser((p) => ({ ...p, email: e.target.value }))
                }
                placeholder="john@example.com"
                disabled={isCreating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm font-medium">
                  +91
                </div>
                <Input
                  id="mobile"
                  type="tel"
                  value={mobileInput}
                  onChange={handleMobileChange}
                  placeholder="0000000000"
                  className="pl-12"
                  maxLength={10}
                  disabled={isCreating}
                />
              </div>
              {mobileInput && mobileInput.length < 10 && (
                <p className="text-xs text-red-500">
                  Please enter a valid 10-digit mobile number
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser((p) => ({ ...p, password: e.target.value }))
                  }
                  placeholder="Enter password (min 6 characters)"
                  className="pr-10"
                  disabled={isCreating}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isCreating}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-slate-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-slate-400" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateOpen(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateUser}
              disabled={
                isCreating ||
                !newUser.name ||
                !newUser.email ||
                !mobileInput ||
                mobileInput.length !== 10 ||
                !newUser.password
              }
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create User"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          setConfirmDialog({ open, type: null, user: null })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmDialog.type === "toggle" &&
                (confirmDialog.user?.accountStatus === "enabled"
                  ? "Disable User"
                  : "Enable User")}
              {confirmDialog.type === "reset" && "Reset Subscription"}
              {confirmDialog.type === "logout" && "Force Logout"}
              {confirmDialog.type === "bulk-enable" && "Enable Users"}
              {confirmDialog.type === "bulk-disable" && "Disable Users"}
            </DialogTitle>
            <DialogDescription>
              {confirmDialog.type === "toggle" &&
                `Are you sure you want to ${
                  confirmDialog.user?.accountStatus === "enabled"
                    ? "disable"
                    : "enable"
                } ${confirmDialog.user?.name}'s account? This will ${
                  confirmDialog.user?.accountStatus === "enabled"
                    ? "prevent them from accessing the system"
                    : "allow them to access the system"
                }.`}
              {confirmDialog.type === "reset" &&
                `This will reset ${confirmDialog.user?.name}'s subscription to 30 days from now.`}
              {confirmDialog.type === "logout" &&
                `This will log out ${confirmDialog.user?.name} from all active sessions.`}
              {confirmDialog.type === "bulk-enable" &&
                `Are you sure you want to enable ${confirmDialog.count} selected users?`}
              {confirmDialog.type === "bulk-disable" &&
                `Are you sure you want to disable ${confirmDialog.count} selected users?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setConfirmDialog({ open: false, type: null, user: null })
              }
              disabled={actionLoading !== null || bulkActionLoading}
            >
              Cancel
            </Button>
            <Button
              variant={
                (confirmDialog.type === "toggle" &&
                  confirmDialog.user?.accountStatus === "enabled") ||
                confirmDialog.type === "bulk-disable"
                  ? "destructive"
                  : "default"
              }
              onClick={() => {
                if (confirmDialog.user) {
                  if (confirmDialog.type === "toggle")
                    handleToggleStatus(confirmDialog.user);
                  if (confirmDialog.type === "reset")
                    handleResetSubscription(confirmDialog.user);
                  if (confirmDialog.type === "logout")
                    handleForceLogout(confirmDialog.user);
                }
                if (confirmDialog.type === "bulk-enable") executeBulkEnable();
                if (confirmDialog.type === "bulk-disable") executeBulkDisable();
              }}
              disabled={actionLoading !== null || bulkActionLoading}
              className={
                confirmDialog.type !== "toggle" ||
                confirmDialog.user?.accountStatus !== "enabled"
                  ? "bg-emerald-500 hover:bg-emerald-700"
                  : "bg-red-500 text-white"
              }
            >
              {actionLoading !== null || bulkActionLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;
