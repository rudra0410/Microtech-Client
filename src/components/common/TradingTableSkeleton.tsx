import React from 'react';
import { Skeleton } from '../ui/skeleton';
import { cn } from '../../lib/utils';

interface TradingTableSkeletonProps {
  rows?: number;
}

export const TradingTableSkeleton: React.FC<TradingTableSkeletonProps> = ({ rows = 6 }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header skeleton */}
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-left font-medium text-gray-700">
                <Skeleton className="h-4 w-12" />
              </th>
              <th className="px-6 py-4 text-left font-medium text-gray-700">
                <Skeleton className="h-4 w-20" />
              </th>
              <th className="px-6 py-4 text-left font-medium text-gray-700">
                <Skeleton className="h-4 w-24" />
              </th>
              <th className="px-6 py-4 text-left font-medium text-gray-700">
                <Skeleton className="h-4 w-24" />
              </th>
              <th className="px-6 py-4 text-left font-medium text-gray-700">
                <Skeleton className="h-4 w-16" />
              </th>
              <th className="px-6 py-4 text-left font-medium text-gray-700">
                <Skeleton className="h-4 w-12" />
              </th>
            </tr>
          </thead>
          {/* Row skeletons */}
          <tbody className="divide-y divide-gray-100">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={`row-${rowIndex}`} className="hover:bg-gray-50">
                {/* Desk column - short values */}
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
                {/* Commodity column - medium values */}
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
                {/* Trader Name column - varied lengths */}
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
                {/* Trader Email column - longer values */}
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
                {/* Quantity column - numeric values */}
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
                {/* Price column - numeric values */}
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

export default TradingTableSkeleton;