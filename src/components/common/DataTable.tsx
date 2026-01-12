import { useState, useMemo, ReactNode } from 'react';
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  X,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { cn } from '../../lib/utils';
import EmptyState from './EmptyState';
import { TableSkeleton } from './LoadingState';

interface FilterOption {
  value: string;
  label: string;
}

interface Filter {
  key: string;
  label: string;
  options: FilterOption[];
}

interface Column<T = Record<string, unknown>> {
  accessor: string;
  header: string;
  sortable?: boolean;
  width?: string;
  render?: (value: unknown, row: T) => ReactNode;
}

interface SortConfig {
  key: string | null;
  direction: 'asc' | 'desc';
}

interface DataTableProps<T = Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  selectable?: boolean;
  onSelectionChange?: (selectedIds: string[]) => void;
  pagination?: boolean;
  pageSize?: number;
  emptyState?: ReactNode;
  onRowClick?: (row: T) => void;
  stickyHeader?: boolean;
  filters?: Filter[];
  className?: string;
}

const DataTable = <T extends { id: string }>({
  columns,
  data,
  isLoading = false,
  searchable = true,
  searchPlaceholder = 'Search...',
  selectable = false,
  onSelectionChange,
  pagination = true,
  pageSize: initialPageSize = 10,
  emptyState,
  onRowClick,
  stickyHeader = true,
  filters,
  className,
}: DataTableProps<T>) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  // Filter data
  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((row) =>
        columns.some((col) => {
          const value = (row as Record<string, unknown>)[col.accessor];
          return value?.toString().toLowerCase().includes(query);
        })
      );
    }

    // Apply active filters
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        result = result.filter((row) => (row as Record<string, unknown>)[key] === value);
      }
    });

    return result;
  }, [data, searchQuery, columns, activeFilters]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortConfig.key!];
      const bVal = (b as Record<string, unknown>)[sortConfig.key!];

      // Handle null/undefined values
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return sortConfig.direction === 'asc' ? -1 : 1;
      if (bVal == null) return sortConfig.direction === 'asc' ? 1 : -1;

      // Convert to comparable values
      let aCompare: string | number;
      let bCompare: string | number;

      // Try to convert to numbers if both values are numeric
      const aNum = Number(aVal);
      const bNum = Number(bVal);
      
      if (!isNaN(aNum) && !isNaN(bNum)) {
        aCompare = aNum;
        bCompare = bNum;
      } else {
        // Convert to strings for comparison
        aCompare = String(aVal).toLowerCase();
        bCompare = String(bVal).toLowerCase();
      }

      if (aCompare < bCompare) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aCompare > bCompare) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelection = new Set(paginatedData.map((row) => row.id));
      setSelectedRows(newSelection);
      onSelectionChange?.(Array.from(newSelection));
    } else {
      setSelectedRows(new Set());
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelection = new Set(selectedRows);
    if (checked) {
      newSelection.add(id);
    } else {
      newSelection.delete(id);
    }
    setSelectedRows(newSelection);
    onSelectionChange?.(Array.from(newSelection));
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return <ChevronsUpDown className="w-4 h-4 text-slate-400" />;
    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="w-4 h-4 text-blue-600" />
    ) : (
      <ChevronDown className="w-4 h-4 text-blue-600" />
    );
  };

  const allSelected = paginatedData.length > 0 && paginatedData.every((row) => selectedRows.has(row.id));

  if (isLoading) {
    return <TableSkeleton rows={pageSize} />;
  }

  return (
    <div className={cn('bg-white rounded-xl border border-slate-200 overflow-hidden', className)}>
      {/* Toolbar */}
      {(searchable || filters) && (
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center gap-3">
          {searchable && (
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={searchPlaceholder}
                className="pl-9 h-9"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
          {filters?.map((filter) => (
            <Select
              key={filter.key}
              value={activeFilters[filter.key] || 'all'}
              onValueChange={(value) => {
                setActiveFilters((prev) => ({ ...prev, [filter.key]: value }));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[160px] h-9">
                <Filter className="w-4 h-4 mr-2 text-slate-400" />
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All {filter.label}</SelectItem>
                {filter.options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
          {selectedRows.size > 0 && (
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-slate-600">{selectedRows.size} selected</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedRows(new Set());
                  onSelectionChange?.([]);
                }}
              >
                Clear
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={cn(stickyHeader && 'sticky top-0 z-10')}>
            <tr className="bg-slate-50 border-b border-slate-200">
              {selectable && (
                <th className="w-12 px-4 py-3">
                  <Checkbox checked={allSelected} onCheckedChange={handleSelectAll} />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.accessor}
                  className={cn(
                    'px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider',
                    col.sortable && 'cursor-pointer select-none hover:bg-slate-100'
                  )}
                  style={{ width: col.width }}
                  onClick={() => col.sortable && handleSort(col.accessor)}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && getSortIcon(col.accessor)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)}>
                  {emptyState || (
                    <EmptyState
                      type={searchQuery ? 'search' : 'empty'}
                      title={searchQuery ? 'No results found' : 'No data'}
                      description={
                        searchQuery
                          ? `No results match "${searchQuery}"`
                          : 'There are no items to display.'
                      }
                    />
                  )}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  className={cn(
                    'hover:bg-slate-50 transition-colors',
                    onRowClick && 'cursor-pointer',
                    selectedRows.has(row.id) && 'bg-blue-50'
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {selectable && (
                    <td className="w-12 px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedRows.has(row.id)}
                        onCheckedChange={(checked) => handleSelectRow(row.id, checked as boolean)}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.accessor} className="px-4 py-3 text-sm text-slate-700">
                      {col.render ? col.render((row as Record<string, unknown>)[col.accessor], row) : String((row as Record<string, unknown>)[col.accessor] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && sortedData.length > 0 && (
        <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>Rows per page:</span>
            <Select value={pageSize.toString()} onValueChange={(v) => setPageSize(Number(v))}>
              <SelectTrigger className="w-16 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="ml-4">
              {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, sortedData.length)} of{' '}
              {sortedData.length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="h-8 w-8"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setCurrentPage(pageNum)}
                  className={cn('h-8 w-8', currentPage === pageNum && 'bg-blue-600 hover:bg-blue-700 text-white')}
                >
                  {pageNum}
                </Button>
              );
            })}
            <Button
              variant="ghost"
              size="icon"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="h-8 w-8"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;