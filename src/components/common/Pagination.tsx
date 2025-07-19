import Link from 'next/link';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LimitSelector from './LimitSelector';

interface ServerPaginationProps {
  currentPage: number;
  totalPages: number;
  currentLimit: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
  searchParams: { [key: string]: string | string[] | undefined };
}

export function Pagination({
  currentPage,
  totalPages,
  currentLimit = 12,
  total,
  hasNext,
  hasPrev,
  searchParams,
}: ServerPaginationProps) {
  // Create URL with updated params
  const createUrl = (updates: Record<string, string | number>) => {
    const params = new URLSearchParams();

    // Preserve existing params
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && !updates.hasOwnProperty(key)) {
        params.set(key, Array.isArray(value) ? value[0] : value);
      }
    });

    // Apply updates
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    });

    return `?${params.toString()}`;
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const startItem = (currentPage - 1) * currentLimit + 1;
  const endItem = Math.min(currentPage * currentLimit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Results Info & Limit Selector */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>
          Showing {startItem} to {endItem} of {total} notes
        </span>
        <div className="flex items-center gap-2">
          <span>Show:</span>
          <LimitSelector currentLimit={currentLimit} searchParams={searchParams} />
          <span>per page</span>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" asChild disabled={!hasPrev}>
            <Link href={createUrl({ page: currentPage - 1 })}>
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Previous</span>
            </Link>
          </Button>

          <div className="flex items-center space-x-1">
            {generatePageNumbers().map((page, index) => (
              <Button
                key={index}
                variant={page === currentPage ? 'default' : 'outline'}
                size="sm"
                asChild={typeof page === 'number'}
                disabled={page === '...'}
                className="min-w-[36px] h-8"
              >
                {typeof page === 'number' ? (
                  <Link href={createUrl({ page })}>{page}</Link>
                ) : (
                  <span>
                    <MoreHorizontal className="h-4 w-4" />
                  </span>
                )}
              </Button>
            ))}
          </div>

          <Button variant="outline" size="sm" asChild disabled={!hasNext}>
            <Link href={createUrl({ page: currentPage + 1 })}>
              <span className="hidden sm:inline mr-1">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
