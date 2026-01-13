/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  MoreHorizontal,
  Pencil,
  X,
  Loader2,
  Calendar,
  Users,
  RefreshCw,
} from "lucide-react";
import DataTable from "../components/common/DataTable";
import StatusBadge from "../components/common/StatusBadge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  subscriptionService,
  SubscriptionWithUser,
} from "../services/subscriptionService";
import { useSubscriptions } from "../hooks";
import TableSkeleton from "../components/common/LoadingState";

const StatCardSkeleton = () => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <div>
          <Skeleton className="h-4 w-24 mb-1" />
          <Skeleton className="h-8 w-12" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// const TableSkeleton = () => (
//   <Card>
//     <CardContent className="p-0">
//       <div className="p-6">
//         {/* Table header skeleton */}
//         <div className="flex items-center justify-between mb-4">
//           <Skeleton className="h-10 w-64" />
//           <div className="flex gap-2">
//             <Skeleton className="h-10 w-24" />
//             <Skeleton className="h-10 w-24" />
//           </div>
//         </div>

//         {/* Table rows skeleton */}
//         <div className="space-y-3">
//           {[1, 2, 3, 4, 5].map((i) => (
//             <div
//               key={i}
//               className="flex items-center gap-4 p-4 border rounded-lg"
//             >
//               <Skeleton className="h-4 w-32" />
//               <Skeleton className="h-4 w-48" />
//               <Skeleton className="h-4 w-24" />
//               <Skeleton className="h-4 w-32" />
//               <Skeleton className="h-6 w-16 rounded-full" />
//               <Skeleton className="h-8 w-8 rounded" />
//             </div>
//           ))}
//         </div>
//       </div>
//     </CardContent>
//   </Card>
// );

const Subscriptions = () => {
  const {
    subscriptions,
    loading,
    loadAllSubscriptions,
    updateSubscriptionData,
    getSubscriptionsByStatus,
  } = useSubscriptions();

  const [refreshing, setRefreshing] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] =
    useState<SubscriptionWithUser | null>(null);
  const [editForm, setEditForm] = useState({
    start_date: "",
    end_date: "",
    status: "ACTIVE" as "ACTIVE" | "EXPIRED" | "CANCELLED",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (subscriptions.length === 0) {
      loadAllSubscriptions();
    }
  }, [subscriptions.length, loadAllSubscriptions]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadAllSubscriptions();
      toast.success("Subscriptions refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh subscriptions");
    } finally {
      setRefreshing(false);
    }
  };

  const handleEditSubscription = async () => {
    if (!editingSubscription) return;

    try {
      setSubmitting(true);
      await updateSubscriptionData(editingSubscription.id, {
        start_date: editForm.start_date,
        end_date: editForm.end_date,
        status: editForm.status,
      });

      setIsEditOpen(false);
      setEditingSubscription(null);
      setEditForm({ start_date: "", end_date: "", status: "ACTIVE" });
      toast.success("Subscription updated successfully");
      loadAllSubscriptions();
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast.error("Failed to update subscription");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubscription = async (subscriptionId: string) => {
    try {
      await subscriptionService.deleteSubscription(subscriptionId);
      toast.success("Subscription deleted successfully");
      loadAllSubscriptions();
    } catch (error) {
      console.error("Error deleting subscription:", error);
      toast.error("Failed to delete subscription");
    }
  };

  const openEditDialog = (subscription: SubscriptionWithUser) => {
    setEditingSubscription(subscription);
    setEditForm({
      start_date: format(new Date(subscription.start_date), "yyyy-MM-dd"),
      end_date: format(new Date(subscription.end_date), "yyyy-MM-dd"),
      status: subscription.status,
    });
    setIsEditOpen(true);
  };

  const subscriptionColumns: Array<{
    header: string;
    accessor: keyof SubscriptionWithUser;
    sortable?: boolean;
    render?: (value: unknown, row: SubscriptionWithUser) => React.ReactNode;
  }> = [
    {
      header: "User",
      accessor: "users",
      sortable: true,
      render: (value: unknown) => {
        const user = value as { username: string; email: string };
        return (
          <div>
            <p className="font-medium text-slate-900">{user.username}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
        );
      },
    },
    {
      header: "Status",
      accessor: "status",
      sortable: true,
      render: (value: unknown) => (
        <StatusBadge status={String(value).toLowerCase()} />
      ),
    },
    {
      header: "Start Date",
      accessor: "start_date",
      sortable: true,
      render: (value: unknown) =>
        format(new Date(String(value)), "MMM d, yyyy"),
    },
    {
      header: "End Date",
      accessor: "end_date",
      sortable: true,
      render: (value: unknown, _row: SubscriptionWithUser) => {
        const endDate = new Date(String(value));
        const now = new Date();
        const daysRemaining = Math.ceil(
          (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );

        return (
          <div>
            <p className="text-slate-900">{format(endDate, "MMM d, yyyy")}</p>
            <p className="text-xs text-slate-500">
              {daysRemaining > 0
                ? `${daysRemaining} days remaining`
                : `Expired ${Math.abs(daysRemaining)} days ago`}
            </p>
          </div>
        );
      },
    },
    {
      header: "Created",
      accessor: "created_at",
      sortable: true,
      render: (value: unknown) =>
        format(new Date(String(value)), "MMM d, yyyy"),
    },
    {
      header: "Actions",
      accessor: "id" as keyof SubscriptionWithUser,
      render: (_: unknown, row: SubscriptionWithUser) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openEditDialog(row)}>
              <Pencil className="w-4 h-4 mr-2" /> Edit Subscription
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => handleDeleteSubscription(row.id)}
            >
              <X className="w-4 h-4 mr-2" /> Delete Subscription
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const activeSubscriptions = getSubscriptionsByStatus("ACTIVE").length;
  const expiredSubscriptions = getSubscriptionsByStatus("EXPIRED").length;
  const cancelledSubscriptions = getSubscriptionsByStatus("CANCELLED").length;

  if (loading || refreshing) {
    return (
      <div className="space-y-6">
        {/* Header with refresh button skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Subscriptions</h1>
            <p className="text-slate-600">
              Manage user subscriptions and billing
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>

        {/* Table skeleton */}
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Subscriptions</h1>
          <p className="text-slate-600">
            Manage user subscriptions and billing
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw
            className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Subscriptions</p>
                <p className="text-2xl font-bold text-slate-900">
                  {subscriptions.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Active Subscriptions</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {activeSubscriptions}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <X className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Expired</p>
                <p className="text-2xl font-bold text-red-600">
                  {expiredSubscriptions}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <X className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Cancelled</p>
                <p className="text-2xl font-bold text-amber-600">
                  {cancelledSubscriptions}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscriptions Table */}
      <Card>
        <CardContent className="p-0">
          <DataTable
            columns={subscriptionColumns}
            data={subscriptions}
            searchPlaceholder="Search users..."
            filters={[
              {
                key: "status",
                label: "Status",
                options: [
                  { value: "ACTIVE", label: "Active" },
                  { value: "EXPIRED", label: "Expired" },
                  { value: "CANCELLED", label: "Cancelled" },
                ],
              },
            ]}
          />
        </CardContent>
      </Card>

      {/* Edit Subscription Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subscription</DialogTitle>
            <DialogDescription>
              Update the subscription details for{" "}
              {editingSubscription?.users.username}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editStartDate">Start Date</Label>
              <Input
                id="editStartDate"
                type="date"
                value={editForm.start_date}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    start_date: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editEndDate">End Date</Label>
              <Input
                id="editEndDate"
                type="date"
                value={editForm.end_date}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, end_date: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editStatus">Status</Label>
              <select
                id="editStatus"
                title="Subscription status"
                value={editForm.status}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    status: e.target.value as
                      | "ACTIVE"
                      | "EXPIRED"
                      | "CANCELLED",
                  }))
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ACTIVE">Active</option>
                <option value="EXPIRED">Expired</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditSubscription}
              disabled={
                !editForm.start_date || !editForm.end_date || submitting
              }
              className="bg-blue-600 hover:bg-blue-700"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Subscription"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Subscriptions;
