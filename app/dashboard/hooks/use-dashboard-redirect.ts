import { useEffect, useState } from 'react';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useStudio } from '@/lib/hooks/use-studio';
import { buildStudioBaseUrl } from '@/lib/studio-url';

export function useDashboardRedirect({
  router,
}: {
  router: AppRouterInstance;
}) {
  const { data: studio, error: studioError, isValidating } = useStudio();
  const [studioSlug, setStudioSlug] = useState('');

  useEffect(() => {
    if (studioError) {
      router.replace('/login');
      return;
    }
    if (!studio) return;
    if (studio.status === 'ONBOARDING') {
      router.replace('/onboarding');
      return;
    }
    setStudioSlug(studio.slug || '');
  }, [router, studio, studioError]);

  const showLoading = !studio && isValidating;
  const publicUrl = studioSlug ? buildStudioBaseUrl(studioSlug) : '';

  return { showLoading, publicUrl };
}
