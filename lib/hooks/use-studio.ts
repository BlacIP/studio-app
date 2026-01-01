'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';

export type Studio = {
  id: string;
  name: string | null;
  slug: string | null;
  status: string;
  logo_url?: string | null;
  logo_public_id?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  address?: string | null;
  social_links?: Record<string, string> | null;
};

const STUDIO_CACHE_KEY = 'studio_app_studio_v1';
let studioCache: Studio | null = null;

function readStudioCache(): Studio | null {
  if (studioCache) return studioCache;
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(STUDIO_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Studio;
    studioCache = parsed;
    return parsed;
  } catch {
    return null;
  }
}

function writeStudioCache(data: Studio) {
  studioCache = data;
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(STUDIO_CACHE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage errors (private mode, quota).
  }
}

export function clearStudioCache() {
  studioCache = null;
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem(STUDIO_CACHE_KEY);
  } catch {
    // Ignore storage errors.
  }
}

export function useStudio() {
  const initialFallback = studioCache ?? undefined;
  const [fallback, setFallback] = useState<Studio | undefined>(initialFallback);
  const [ready, setReady] = useState(Boolean(initialFallback));

  useEffect(() => {
    if (initialFallback) return;
    const cached = readStudioCache();
    if (cached) {
      setFallback(cached);
    }
    setReady(true);
  }, [initialFallback]);

  const swr = useSWR<Studio>(ready ? 'studios/me' : null, {
    fallbackData: fallback,
    revalidateOnMount: !fallback,
  });

  useEffect(() => {
    if (swr.data) {
      writeStudioCache(swr.data);
    }
  }, [swr.data]);

  return swr;
}
