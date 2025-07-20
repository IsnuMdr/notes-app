'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLoading } from '@/providers/LoadingProvider';

export function useNavigationLoading() {
  const { showLoading, hideLoading } = useLoading();
  const pathname = usePathname();

  useEffect(() => {
    // Hide loading when pathname changes (navigation complete)
    hideLoading();
  }, [pathname, hideLoading]);

  const navigateWithLoading = (href: string, message = 'Navigating...') => {
    showLoading(message);
    window.location.href = href;
  };

  return { navigateWithLoading };
}
