import React from 'react';
import { TradingTableSkeleton } from './TradingTableSkeleton';

export const SkeletonDemo: React.FC = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Trading Table Loading State</h1>
        <TradingTableSkeleton rows={6} />
      </div>
    </div>
  );
};

export default SkeletonDemo;