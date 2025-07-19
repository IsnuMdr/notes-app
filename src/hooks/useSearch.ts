import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Note } from '@/types/notes';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'all' | 'my' | 'shared' | 'public'>('all');

  const {
    data: results,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['search', query, type],
    queryFn: async () => {
      if (!query.trim()) return [];

      const response = await axios.get('/api/search', {
        params: { q: query, type },
      });
      return response.data as Note[];
    },
    enabled: !!query.trim(),
  });

  return {
    query,
    setQuery,
    type,
    setType,
    results: results || [],
    isLoading,
    error,
  };
}
