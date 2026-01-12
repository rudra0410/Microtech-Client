import React from 'react';
import { Inbox, Search, FileQuestion, AlertCircle, LucideIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

type EmptyStateType = 'empty' | 'search' | 'notFound' | 'error';

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: LucideIcon;
  className?: string;
}

const iconMap: Record<EmptyStateType, LucideIcon> = {
  empty: Inbox,
  search: Search,
  notFound: FileQuestion,
  error: AlertCircle,
};

const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'empty',
  title = 'No data found',
  description = 'There are no items to display at the moment.',
  actionLabel,
  onAction,
  icon: CustomIcon,
  className,
}) => {
  const Icon = CustomIcon || iconMap[type] || Inbox;

  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4', className)}>
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 text-center max-w-sm mb-4">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;