/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ReactNode } from 'react';
import { cn } from '../../lib/utils';

type StatusType = 
  | 'active' | 'enabled' | 'success' | 'delivered'
  | 'expiring' | 'warning' | 'pending' | 'scheduled'
  | 'expired' | 'disabled' | 'failed' | 'error' | 'inactive'
  | 'online' | 'offline'
  | 'info'
  | 'owner' | 'admin' | 'support';

interface StatusBadgeProps {
  status: string;
  className?: string;
  children?: ReactNode;
}

const statusStyles: Record<string, string> = {
  // Subscription/Account statuses
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  enabled: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  
  expiring: 'bg-amber-50 text-amber-700 border-amber-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
  
  expired: 'bg-red-50 text-red-700 border-red-200',
  disabled: 'bg-red-50 text-red-700 border-red-200',
  failed: 'bg-red-50 text-red-700 border-red-200',
  error: 'bg-red-50 text-red-700 border-red-200',
  cancelled: 'bg-orange-50 text-orange-700 border-orange-200',
  inactive: 'bg-slate-100 text-slate-600 border-slate-200',
  
  // Device statuses
  online: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  offline: 'bg-slate-100 text-slate-600 border-slate-200',
  
  // Severity levels
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  
  // Roles
  owner: 'bg-violet-50 text-violet-700 border-violet-200',
  admin: 'bg-blue-50 text-blue-700 border-blue-200',
  support: 'bg-slate-100 text-slate-600 border-slate-200',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className, children }) => {
  const normalizedStatus = status?.toLowerCase().replace(/[\s-]/g, '_');
  const style = statusStyles[normalizedStatus] || 'bg-slate-100 text-slate-600 border-slate-200';
  
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        style,
        className
      )}
    >
      {children || status}
    </span>
  );
};

export default StatusBadge;