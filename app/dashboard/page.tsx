'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { buildStudioBaseUrl } from '@/lib/studio-url';
import { useStudio } from '@/lib/hooks/use-studio';

export default function Page() {
  const router = useRouter();
  const { data: studio, error: studioError, isValidating } = useStudio();
  const [studioSlug, setStudioSlug] = useState('');

  useEffect(() => {
    if (studioError) {
      router.replace('/login');
      return;
    }
    if (!studio) {
      return;
    }
    if (studio.status === 'ONBOARDING') {
      router.replace('/onboarding');
      return;
    }
    setStudioSlug(studio.slug || '');
  }, [router, studio, studioError]);

  if (!studio && isValidating) {
    return (
      <div className="px-6 py-10 text-sm text-text-sub-600">
        Loading your studio workspace...
      </div>
    );
  }

  const publicUrl = studioSlug ? buildStudioBaseUrl(studioSlug) : '';

  return (
    <div className="px-6 py-10">
      <h1 className="text-2xl font-semibold text-text-strong-950">Studio dashboard</h1>
      <p className="mt-2 text-sm text-text-sub-600">
        You are signed in. Studio onboarding and workspace setup will appear here.
      </p>
      <div className="mt-4">
        <a className="text-sm font-medium text-primary underline-offset-4 hover:underline" href="/settings">
          Update studio settings
        </a>
        {publicUrl && (
          <a
            className="ml-4 text-sm font-medium text-primary underline-offset-4 hover:underline"
            href={publicUrl}
            target="_blank"
            rel="noreferrer"
          >
            View public studio page
          </a>
        )}
      </div>
    </div>
  );
}
