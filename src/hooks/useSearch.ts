import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Note } from '@/types/notes';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'all' | 'my' | 'shared' | 'public'>('all');
  const [isSearching, setIsSearching] = useState(false);

  const {
    data: results,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['search', query, type],
    queryFn: async () => {
      if (!query.trim()) return [];

      const response = await axios.get('/api/search', {
        params: { q: query.trim(), type },
      });
      return response.data as Note[];
    },
    enabled: !!query.trim() && isSearching,
  });

  const executeSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setIsSearching(!!searchQuery.trim());
  };

  const clearSearch = () => {
    setQuery('');
    setIsSearching(false);
  };

  return {
    query,
    setQuery,
    type,
    setType,
    results: results || [],
    isLoading,
    error,
    isSearching,
    executeSearch,
    clearSearch,
  };
}
