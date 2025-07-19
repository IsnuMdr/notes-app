'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface SearchAndFilterProps {
  showFilterOptions?: boolean;
  filterOptions?: Array<{ value: string; label: string }>;
}

export function SearchAndFilter({
  showFilterOptions = true,
  filterOptions = [
    { value: 'all', label: 'All Notes' },
    { value: 'my', label: 'My Notes' },
    { value: 'shared', label: 'Shared with Me' },
    { value: 'public', label: 'Public Notes' },
  ],
}: SearchAndFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [filter, setFilter] = useState(searchParams.get('filter') || 'all');

  const updateUrl = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Always reset to page 1 when searching/filtering
    params.set('page', '1');

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : '?';

    startTransition(() => {
      router.push(newUrl);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl({ search, filter });
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
    updateUrl({ search, filter: value });
  };

  const clearFilters = () => {
    setSearch('');
    setFilter('all');
    startTransition(() => {
      router.push('?');
    });
  };

  const hasActiveFilters = search || (filter && filter !== 'all');

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-10"
              disabled={isPending}
            />
            {search && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-8 w-8 p-0"
                onClick={() => {
                  setSearch('');
                  updateUrl({ search: '', filter });
                }}
                disabled={isPending}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>

        {showFilterOptions && (
          <Select value={filter} onValueChange={handleFilterChange} disabled={isPending}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {search && (
            <Badge variant="secondary">
              Search: &quot;{search}&quot;
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => {
                  setSearch('');
                  updateUrl({ search: '', filter });
                }}
                disabled={isPending}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filter && filter !== 'all' && (
            <Badge variant="secondary">
              Filter: {filterOptions.find((opt) => opt.value === filter)?.label}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => {
                  setFilter('all');
                  updateUrl({ search, filter: 'all' });
                }}
                disabled={isPending}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          <Button variant="outline" size="sm" onClick={clearFilters} disabled={isPending}>
            Clear all
          </Button>
        </div>
      )}

      {isPending && <LoadingOverlay />}
    </div>
  );
}

function LoadingOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-black"></div>
    </div>
  );
}
