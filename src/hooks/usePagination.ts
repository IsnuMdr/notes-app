'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';

export function usePagination() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentPage = parseInt(searchParams.get('page') || '1');
  const currentLimit = parseInt(searchParams.get('limit') || '12');

  const updateUrl = useCallback(
    (updates: Record<string, string | number>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value.toString());
        } else {
          params.delete(key);
        }
      });

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      router.push(newUrl);
    },
    [router, searchParams, pathname],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      updateUrl({ page });
    },
    [updateUrl],
  );

  const handleLimitChange = useCallback(
    (limit: number) => {
      updateUrl({ limit, page: 1 }); // Reset to page 1 when changing limit
    },
    [updateUrl],
  );

  return {
    currentPage,
    currentLimit,
    handlePageChange,
    handleLimitChange,
    updateUrl,
  };
}
