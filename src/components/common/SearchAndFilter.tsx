'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePagination } from '@/hooks/usePagination';
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

export function SearchAndFilter() {
  const searchParams = useSearchParams();
  const { updateUrl } = usePagination();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [filter, setFilter] = useState(searchParams.get('filter') || 'all');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl({ search, page: 1 });
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
    updateUrl({ filter: value === 'all' ? '' : value, page: 1 });
  };

  const clearFilters = () => {
    setSearch('');
    setFilter('all');
    updateUrl({ search: '', filter: '', page: 1 });
  };

  // Sync with URL changes
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setFilter(searchParams.get('filter') || 'all');
  }, [searchParams]);

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
            />
            {search && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-8 w-8 p-0"
                onClick={() => {
                  setSearch('');
                  updateUrl({ search: '', page: 1 });
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>

        <Select value={filter} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Notes</SelectItem>
            <SelectItem value="my">My Notes</SelectItem>
            <SelectItem value="shared">Shared with Me</SelectItem>
            <SelectItem value="public">Public Notes</SelectItem>
          </SelectContent>
        </Select>
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
                  updateUrl({ search: '', page: 1 });
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filter && filter !== 'all' && (
            <Badge variant="secondary">
              Filter: {filter}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => {
                  setFilter('all');
                  updateUrl({ filter: '', page: 1 });
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
