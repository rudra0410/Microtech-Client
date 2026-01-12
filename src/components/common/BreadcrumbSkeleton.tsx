import React from 'react';
import { Skeleton } from '../ui/skeleton';

const BreadcrumbSkeleton: React.FC = () => {
  return (
    <div className="flex items-center text-sm text-slate-500 mb-0.5">
      {/* Home link skeleton */}
      <Skeleton className="h-4 w-10" />
      
      {/* First chevron */}
      <div className="w-4 h-4 mx-1 flex items-center justify-center">
        <div className="w-2 h-2 border-r border-b border-slate-300 rotate-45" />
      </div>
      
      {/* User Management skeleton */}
      <Skeleton className="h-4 w-24" />
      
      {/* Second chevron */}
      <div className="w-4 h-4 mx-1 flex items-center justify-center">
        <div className="w-2 h-2 border-r border-b border-slate-300 rotate-45" />
      </div>
      
      {/* Username skeleton (loading state) */}
      <Skeleton className="h-4 w-20" />
    </div>
  );
};

export default BreadcrumbSkeleton;