import React from 'react';
import { Skeleton } from '../ui/skeleton';
import { cn } from '../../lib/utils';

export { TradingTableSkeleton } from './TradingTableSkeleton';

interface TableSkeletonProps {
  rows?: number;
}

// Table skeleton loader
export const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 6 }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Table skeleton */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header skeleton */}
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-left">
                <Skeleton className="h-4 w-12" />
              </th>
              <th className="px-6 py-4 text-left">
                <Skeleton className="h-4 w-20" />
              </th>
              <th className="px-6 py-4 text-left">
                <Skeleton className="h-4 w-24" />
              </th>
              <th className="px-6 py-4 text-left">
                <Skeleton className="h-4 w-24" />
              </th>
              <th className="px-6 py-4 text-left">
                <Skeleton className="h-4 w-16" />
              </th>
              <th className="px-6 py-4 text-left">
                <Skeleton className="h-4 w-12" />
              </th>
            </tr>
          </thead>
          {/* Row skeletons */}
          <tbody className="divide-y divide-gray-100">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={`row-${rowIndex}`} className="hover:bg-gray-50">
                {/* Desk column */}
                <td className="px-6 py-4">
                  <Skeleton className={cn(
                    "h-4",
                    rowIndex === 0 ? "w-16" : 
                    rowIndex === 1 ? "w-20" : 
                    rowIndex === 2 ? "w-18" :
                    rowIndex === 3 ? "w-12" :
                    rowIndex === 4 ? "w-14" : "w-16"
                  )} />
                </td>
                {/* Commodity column */}
                <td className="px-6 py-4">
                  <Skeleton className={cn(
                    "h-4",
                    rowIndex === 0 ? "w-24" : 
                    rowIndex === 1 ? "w-32" : 
                    rowIndex === 2 ? "w-36" :
                    rowIndex === 3 ? "w-28" :
                    rowIndex === 4 ? "w-30" : "w-26"
                  )} />
                </td>
                {/* Trader Name column */}
                <td className="px-6 py-4">
                  <Skeleton className={cn(
                    "h-4",
                    rowIndex === 0 ? "w-32" : 
                    rowIndex === 1 ? "w-40" : 
                    rowIndex === 2 ? "w-28" :
                    rowIndex === 3 ? "w-36" :
                    rowIndex === 4 ? "w-32" : "w-38"
                  )} />
                </td>
                {/* Trader Email column */}
                <td className="px-6 py-4">
                  <Skeleton className={cn(
                    "h-4",
                    rowIndex === 0 ? "w-48" : 
                    rowIndex === 1 ? "w-44" : 
                    rowIndex === 2 ? "w-52" :
                    rowIndex === 3 ? "w-40" :
                    rowIndex === 4 ? "w-46" : "w-42"
                  )} />
                </td>
                {/* Quantity column */}
                <td className="px-6 py-4">
                  <Skeleton className={cn(
                    "h-4",
                    rowIndex === 0 ? "w-20" : 
                    rowIndex === 1 ? "w-24" : 
                    rowIndex === 2 ? "w-18" :
                    rowIndex === 3 ? "w-22" :
                    rowIndex === 4 ? "w-20" : "w-24"
                  )} />
                </td>
                {/* Price column */}
                <td className="px-6 py-4">
                  <Skeleton className={cn(
                    "h-4",
                    rowIndex === 0 ? "w-24" : 
                    rowIndex === 1 ? "w-20" : 
                    rowIndex === 2 ? "w-28" :
                    rowIndex === 3 ? "w-22" :
                    rowIndex === 4 ? "w-26" : "w-24"
                  )} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface CardSkeletonProps {
  className?: string;
}

// Card skeleton loader
export const CardSkeleton: React.FC<CardSkeletonProps> = ({ className }) => {
  return (
    <div className={cn('p-6 rounded-xl border border-slate-200 bg-white', className)}>
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-8 w-20 mb-2" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
};

// Stats card skeleton
export const StatsCardSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};

// Detail page skeleton
export const DetailSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <TableSkeleton rows={3} />
    </div>
  );
};

interface PageLoaderProps {
  message?: string;
}

// Page loading spinner
export const PageLoader: React.FC<PageLoaderProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
};

export default TableSkeleton;