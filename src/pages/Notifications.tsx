// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { useState } from "react";
// import { format, formatDistanceToNow } from "date-fns";
// import { Plus, Send, Clock, Users, Eye, BarChart3 } from "lucide-react";
// // import {  mockUsers, type Notification, type NotificationAudience, type NotificationStatus } from "../data/mock";
// import DataTable from "../components/common/DataTable";
// import StatusBadge from "../components/common/StatusBadge";
// import { Button } from "../components/ui/button";
// import { Card, CardContent } from "../components/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "../components/ui/dialog";
// import { Input } from "../components/ui/input";
// import { Label } from "../components/ui/label";
// import { Textarea } from "../components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../components/ui/select";
// import { Progress } from "../components/ui/progress";
// import { toast } from "sonner";

// const Notifications = () => {
//   const [notifications, setNotifications] = useState(mockNotifications);
//   const [isCreateOpen, setIsCreateOpen] = useState(false);
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
//   const [newNotification, setNewNotification] = useState<{
//     title: string;
//     message: string;
//     targetAudience: NotificationAudience;
//     schedule: "now" | "later";
//   }>({
//     title: "",
//     message: "",
//     targetAudience: "all",
//     schedule: "now",
//   });

//   const getTargetCount = (audience: NotificationAudience): number => {
//     switch (audience) {
//       case "all":
//         return mockUsers.length;
//       case "expiring_subscriptions":
//         return mockUsers.filter((u) => u.subscriptionStatus === "expiring")
//           .length;
//       case "specific_users":
//         return 0;
//       default:
//         return 0;
//     }
//   };

//   const handleCreateNotification = () => {
//     const newNotif: Notification = {
//       id: `NOTIF-${String(notifications.length + 1).padStart(3, "0")}`,
//       title: newNotification.title,
//       message: newNotification.message,
//       targetAudience: newNotification.targetAudience,
//       targetCount: getTargetCount(newNotification.targetAudience),
//       sentAt:
//         newNotification.schedule === "now" ? new Date().toISOString() : undefined,
//       scheduledFor:
//         newNotification.schedule === "later"
//           ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
//           : undefined,
//       status: (newNotification.schedule === "now" ? "delivered" : "scheduled") as NotificationStatus,
//       readRate: 0,
//     };
//     setNotifications((prev) => [newNotif, ...prev]);
//     setNewNotification({
//       title: "",
//       message: "",
//       targetAudience: "all",
//       schedule: "now",
//     });
//     setIsCreateOpen(false);
//     toast.success(
//       newNotification.schedule === "now"
//         ? "Notification sent!"
//         : "Notification scheduled!"
//     );
//   };

//   const handlePreview = () => {
//     setSelectedNotification({
//       id: "preview",
//       title: newNotification.title,
//       message: newNotification.message,
//       targetAudience: newNotification.targetAudience,
//       targetCount: getTargetCount(newNotification.targetAudience),
//       status: "delivered" as NotificationStatus,
//       readRate: 0,
//     });
//     setPreviewOpen(true);
//   };

//   const columns: Array<{
//     header: string;
//     accessor: keyof Notification;
//     render?: (value: unknown, row: Notification) => React.ReactNode;
//   }> = [
//     {
//       header: "Notification",
//       accessor: "title",
//       render: (value: unknown, row: Notification) => (
//         <div>
//           <p className="font-medium text-slate-900">{String(value)}</p>
//           <p className="text-sm text-slate-500 truncate max-w-xs">
//             {row.message}
//           </p>
//         </div>
//       ),
//     },
//     {
//       header: "Target",
//       accessor: "targetAudience",
//       render: (value: unknown, row: Notification) => (
//         <div>
//           <p className="capitalize">{String(value).replace(/_/g, " ")}</p>
//           <p className="text-xs text-slate-500">{row.targetCount} recipients</p>
//         </div>
//       ),
//     },
//     {
//       header: "Status",
//       accessor: "status",
//       render: (value: unknown) => <StatusBadge status={value as NotificationStatus} />,
//     },
//     {
//       header: "Sent / Scheduled",
//       accessor: "sentAt",
//       render: (value: unknown, row: Notification) => (
//         <div>
//           {value ? (
//             <>
//               <p className="text-slate-900">
//                 {format(new Date(String(value)), "MMM d, HH:mm")}
//               </p>
//               <p className="text-xs text-slate-500">
//                 {formatDistanceToNow(new Date(String(value)), { addSuffix: true })}
//               </p>
//             </>
//           ) : row.scheduledFor ? (
//             <>
//               <p className="text-slate-900">
//                 {format(new Date(row.scheduledFor), "MMM d, HH:mm")}
//               </p>
//               <p className="text-xs text-blue-600">Scheduled</p>
//             </>
//           ) : (
//             <span className="text-slate-400">-</span>
//           )}
//         </div>
//       ),
//     },
//     {
//       header: "Read Rate",
//       accessor: "readRate",
//       render: (value: unknown, row: Notification) =>
//         row.status === "delivered" ? (
//           <div className="w-24">
//             <div className="flex items-center justify-between text-xs mb-1">
//               <span className="text-slate-500">Read</span>
//               <span className="font-medium">{Number(value)}%</span>
//             </div>
//             <Progress value={Number(value)} className="h-1.5" />
//           </div>
//         ) : (
//           <span className="text-slate-400">-</span>
//         ),
//     },
//   ];

//   const sentCount = notifications.filter(
//     (n) => n.status === "delivered"
//   ).length;
//   const scheduledCount = notifications.filter(
//     (n) => n.status === "scheduled"
//   ).length;
//   const avgReadRate = Math.round(
//     notifications
//       .filter((n) => n.status === "delivered")
//       .reduce((acc, n) => acc + n.readRate, 0) / sentCount || 0
//   );

//   return (
//     <div className="space-y-6">
//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
//                 <Send className="w-5 h-5 text-blue-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-slate-500">Total Sent</p>
//                 <p className="text-xl font-bold text-slate-900">{sentCount}</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
//                 <Clock className="w-5 h-5 text-amber-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-slate-500">Scheduled</p>
//                 <p className="text-xl font-bold text-slate-900">
//                   {scheduledCount}
//                 </p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
//                 <BarChart3 className="w-5 h-5 text-emerald-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-slate-500">Avg. Read Rate</p>
//                 <p className="text-xl font-bold text-slate-900">
//                   {avgReadRate}%
//                 </p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
//                 <Users className="w-5 h-5 text-violet-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-slate-500">Total Reach</p>
//                 <p className="text-xl font-bold text-slate-900">
//                   {notifications.reduce((acc, n) => acc + n.targetCount, 0)}
//                 </p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-lg font-semibold text-slate-900">
//             Notification History
//           </h2>
//           <p className="text-sm text-slate-500">
//             Manage and send notifications to users
//           </p>
//         </div>
//         <Button
//           onClick={() => setIsCreateOpen(true)}
//           className="bg-blue-600 hover:bg-blue-700"
//         >
//           <Plus className="w-4 h-4 mr-2" /> Create Notification
//         </Button>
//       </div>

//       {/* Data Table */}
//       <DataTable
//         columns={columns}
//         data={notifications}
//         searchable={false}
//         pagination={false}
//       />

//       {/* Create Notification Dialog */}
//       <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
//         <DialogContent className="max-w-lg">
//           <DialogHeader>
//             <DialogTitle>Create Notification</DialogTitle>
//             <DialogDescription>
//               Send a push notification to users.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4 py-4">
//             <div className="space-y-2">
//               <Label htmlFor="title">Title</Label>
//               <Input
//                 id="title"
//                 value={newNotification.title}
//                 onChange={(e) =>
//                   setNewNotification((p) => ({ ...p, title: e.target.value }))
//                 }
//                 placeholder="Notification title"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="message">Message</Label>
//               <Textarea
//                 id="message"
//                 value={newNotification.message}
//                 onChange={(e) =>
//                   setNewNotification((p) => ({ ...p, message: e.target.value }))
//                 }
//                 placeholder="Write your message..."
//                 rows={3}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Target Audience</Label>
//               <Select
//                 value={newNotification.targetAudience}
//                 onValueChange={(v: NotificationAudience) =>
//                   setNewNotification((p) => ({ ...p, targetAudience: v }))
//                 }
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">
//                     All Users ({mockUsers.length})
//                   </SelectItem>
//                   <SelectItem value="expiring_subscriptions">
//                     Expiring Subscriptions (
//                     {
//                       mockUsers.filter(
//                         (u) => u.subscriptionStatus === "expiring"
//                       ).length
//                     }
//                     )
//                   </SelectItem>
//                   <SelectItem value="specific_users">Specific Users</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label>Schedule</Label>
//               <Select
//                 value={newNotification.schedule}
//                 onValueChange={(v: "now" | "later") =>
//                   setNewNotification((p) => ({ ...p, schedule: v }))
//                 }
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="now">Send Now</SelectItem>
//                   <SelectItem value="later">Schedule for Later</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {newNotification.title && newNotification.message && (
//               <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
//                 <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
//                   <Eye className="w-4 h-4" />
//                   <span>Preview</span>
//                 </div>
//                 <p className="font-semibold text-slate-900">
//                   {newNotification.title}
//                 </p>
//                 <p className="text-sm text-slate-600 mt-1">
//                   {newNotification.message}
//                 </p>
//                 <p className="text-xs text-slate-400 mt-2">
//                   Will be sent to{" "}
//                   {getTargetCount(newNotification.targetAudience)} users
//                 </p>
//               </div>
//             )}
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
//               Cancel
//             </Button>
//             <Button
//               onClick={handleCreateNotification}
//               disabled={!newNotification.title || !newNotification.message}
//               className="bg-blue-600 hover:bg-blue-700"
//             >
//               {newNotification.schedule === "now" ? "Send Now" : "Schedule"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default Notifications;
