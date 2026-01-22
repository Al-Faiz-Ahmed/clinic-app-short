import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import type { PaginationMeta } from './types';
import { cn } from '@/lib/utils';

interface PatientPaginationProps {
  pagination: PaginationMeta;
  loading: boolean;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export const PatientPagination = ({
  pagination,
  loading,
  onPageChange,
  onLimitChange,
}: PatientPaginationProps) => {
  const { page, limit, total, totalPages } = pagination;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && !loading) {
      onPageChange(newPage);
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (page > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 border-t border-border/50 bg-muted/20">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>
          Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} results
        </span>
        {onLimitChange && (
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            disabled={loading}
            className="ml-2 h-8 rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(1)}
          disabled={page === 1 || loading}
          className="h-8 w-8"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1 || loading}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1 mx-2">
          {getPageNumbers().map((pageNum, index) => {
            if (pageNum === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                  ...
                </span>
              );
            }

            const pageNumber = pageNum as number;
            const isActive = pageNumber === page;

            return (
              <Button
                key={pageNumber}
                variant={isActive ? 'default' : 'outline'}
                size="icon"
                onClick={() => handlePageChange(pageNumber)}
                disabled={loading}
                className={cn('h-8 w-8', isActive && 'bg-primary text-primary-foreground')}
              >
                {pageNumber}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages || loading}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(totalPages)}
          disabled={page === totalPages || loading}
          className="h-8 w-8"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
