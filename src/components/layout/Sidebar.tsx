/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Cpu,
  ScrollText,
  Bell,
  Shield,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
  module: string | null;
  requiredRole?: "owner" | "admin" | "support";
}

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const navItems: NavItem[] = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/dashboard",
    module: null,
  },
  {
    icon: Users,
    label: "Users",
    path: "/users",
    module: "users",
    requiredRole: "admin",
  },
  {
    icon: CreditCard,
    label: "Subscriptions",
    path: "/subscriptions",
    module: "subscriptions",
    requiredRole: "admin",
  },
  // {
  //   icon: Cpu,
  //   label: 'Devices',
  //   path: '/devices',
  //   module: 'devices'
  // },
  // {
  //   icon: ScrollText,
  //   label: 'Logs & Analytics',
  //   path: '/logs',
  //   module: 'logs',
  //   requiredRole: 'support'
  // },
  // {
  //   icon: Bell,
  //   label: 'Notifications',
  //   path: '/notifications',
  //   module: 'notifications'
  // },
  // {
  //   icon: Shield,
  //   label: 'Admins & Roles',
  //   path: '/admins',
  //   module: 'admins',
  //   requiredRole: 'owner'
  // },
  // {
  //   icon: Settings,
  //   label: 'Settings',
  //   path: '/settings',
  //   module: 'settings'
  // },
];

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse }) => {
  const location = useLocation();
  const { logout, hasPermission, user, isOwner, isAdmin } = useAuth();

  const isActiveRoute = (path: string): boolean => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const canAccessModule = (module: string | null): boolean => {
    if (!module) return true;
    return hasPermission(module, "read");
  };

  const canAccessRole = (
    requiredRole?: "owner" | "admin" | "support"
  ): boolean => {
    if (!requiredRole || !user) return true;

    const roleHierarchy = {
      owner: 3,
      admin: 2,
      support: 1,
    };

    const userRoleLevel =
      roleHierarchy[user.role as keyof typeof roleHierarchy] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole];

    return userRoleLevel >= requiredRoleLevel;
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-white border-r border-slate-200 transition-all duration-300 ease-in-out flex flex-col",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "h-16 flex items-center border-b border-slate-200 px-4",
          collapsed ? "justify-center" : "justify-between"
        )}
      >
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-600 to-blue-700 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-slate-900">IoT Admin</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-600 to-blue-700 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <TooltipProvider delayDuration={0}>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const canAccessByModule = canAccessModule(item.module);
              const canAccessByRole = canAccessRole(item.requiredRole);
              const canAccess = canAccessByModule && canAccessByRole;
              const isActive = isActiveRoute(item.path);

              // Don't render the item if user doesn't have access
              if (!canAccess) {
                return null;
              }

              const linkContent = (
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                    collapsed && "justify-center px-2"
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5 shrink-0",
                      isActive && "text-blue-600"
                    )}
                  />
                  {!collapsed && <span>{item.label}</span>}
                </div>
              );

              return (
                <li key={item.path}>
                  {collapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <NavLink to={item.path}>{linkContent}</NavLink>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="font-medium">
                        <span>{item.label}</span>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <NavLink to={item.path}>{linkContent}</NavLink>
                  )}
                </li>
              );
            })}
          </ul>
        </TooltipProvider>
      </nav>

      {/* Logout */}
      <div className="border-t border-slate-200 p-3">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={logout}
                className={cn(
                  "w-full text-slate-600 hover:text-red-600 hover:bg-red-50",
                  collapsed ? "px-2" : "justify-start gap-3"
                )}
              >
                <LogOut className="w-5 h-5" />
                {!collapsed && <span>Logout</span>}
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right" className="font-medium">
                Logout
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => onCollapse(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-slate-600" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-slate-600" />
        )}
      </button>
    </aside>
  );
};

export default Sidebar;
