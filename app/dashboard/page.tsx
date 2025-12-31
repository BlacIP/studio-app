'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';

export default function Page() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const studio = await api.get('studios/me');
        if (cancelled) return;
        if (studio?.status === 'ONBOARDING') {
          router.replace('/onboarding');
          return;
        }
        setReady(true);
      } catch (err) {
        console.error(err);
        router.replace('/login');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!ready) {
    return (
      <div className="px-6 py-10 text-sm text-text-sub-600">
        Loading your studio workspace...
      </div>
    );
  }

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
      </div>
    </div>
  );
}
