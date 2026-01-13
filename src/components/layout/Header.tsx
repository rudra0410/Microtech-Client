import React from "react";
import { useLocation, Link } from "react-router-dom";
import { ChevronRight, Bell } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useBreadcrumb } from "../../context/BreadcrumbContext";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import StatusBadge from "../common/StatusBadge";
import BreadcrumbSkeleton from "../common/BreadcrumbSkeleton";
import { Skeleton } from "../ui/skeleton";

interface Breadcrumb {
  title: string;
  path: string;
  isLast: boolean;
}

const routeTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/users": "User Management",
  "/subscriptions": "Subscription Management",
  "/devices": "Device Management",
  "/logs": "Logs & Analytics",
  "/notifications": "Notifications",
  "/admins": "Admins & Roles",
  "/settings": "Settings",
};

const getBreadcrumbs = (pathname: string): Breadcrumb[] => {
  const parts = pathname.split("/").filter(Boolean);
  const breadcrumbs: Breadcrumb[] = [];
  let path = "";

  parts.forEach((part, index) => {
    path += `/${part}`;
    const title =
      routeTitles[path] ||
      part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, " ");
    breadcrumbs.push({ title, path, isLast: index === parts.length - 1 });
  });

  return breadcrumbs;
};

const Header: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { customBreadcrumbs, pageTitle, isLoading } = useBreadcrumb();

  // Use custom breadcrumbs if available, otherwise generate from route
  const breadcrumbs = customBreadcrumbs || getBreadcrumbs(location.pathname);
  const currentPageTitle =
    pageTitle ||
    routeTitles[location.pathname] ||
    breadcrumbs[breadcrumbs.length - 1]?.title ||
    "Dashboard";

  const getInitials = (name?: string): string => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || ""
    );
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      {/* Left: Breadcrumbs & Title */}
      <div>
        {isLoading ? (
          <BreadcrumbSkeleton />
        ) : (
          <nav className="flex items-center text-sm text-slate-500 mb-0.5">
            <Link
              to="/dashboard"
              className="hover:text-slate-700 transition-colors"
            >
              Home
            </Link>
            {breadcrumbs.map((crumb) => (
              <React.Fragment key={crumb.path}>
                <ChevronRight className="w-4 h-4 mx-1" />
                {crumb.isLast ? (
                  <span className="text-slate-900 font-medium">
                    {crumb.title}
                  </span>
                ) : (
                  <Link
                    to={crumb.path}
                    className="hover:text-slate-700 transition-colors"
                  >
                    {crumb.title}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        {isLoading ? (
          <Skeleton className="h-6 w-32 mt-1" />
        ) : (
          <h1 className="text-xl font-semibold text-slate-900">
            {currentPageTitle}
          </h1>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        {/* <div className="relative hidden lg:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Search..."
            className="pl-9 w-64 h-9 bg-slate-50 border-slate-200 focus:bg-white"
          />
        </div> */}

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-slate-600 hover:text-slate-900"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-72 overflow-y-auto">
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">
                    Subscription Expiring
                  </span>
                  <Badge variant="outline" className="text-xs">
                    Warning
                  </Badge>
                </div>
                <p className="text-xs text-slate-500">
                  14 users have subscriptions expiring in 7 days
                </p>
                <span className="text-xs text-slate-400">2 hours ago</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">
                    Failed Login Attempt
                  </span>
                  <Badge variant="destructive" className="text-xs">
                    Alert
                  </Badge>
                </div>
                <p className="text-xs text-slate-500">
                  3 failed login attempts detected
                </p>
                <span className="text-xs text-slate-400">5 hours ago</span>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center justify-center text-blue-600 font-medium">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-2 h-auto py-1.5"
            >
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-medium">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium text-slate-900">
                  {user?.name}
                </span>
                <StatusBadge
                  status={user?.role || ""}
                  className="text-[10px] px-1.5 py-0"
                />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user?.name}</span>
                <span className="text-xs font-normal text-slate-500">
                  {user?.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile Settings</DropdownMenuItem>
            <DropdownMenuItem>Account Security</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="text-red-600 focus:text-red-600"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
