'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import {
  getCachedSession,
  SESSION_CACHE_UPDATED_EVENT,
} from '@/lib/hooks/use-session';

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
let studioCacheStudioId: string | null = null;

type StudioCachePayload = {
  studioId: string | null;
  data: Studio;
};

function readSessionStudioId(): string | null {
  return getCachedSession()?.studioId ?? null;
}

function readStudioCache(currentStudioId: string | null): Studio | null {
  if (!currentStudioId) return null;
  if (studioCache && studioCacheStudioId === currentStudioId) return studioCache;
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(STUDIO_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Studio | StudioCachePayload;
    const payload = 'data' in parsed
      ? (parsed as StudioCachePayload)
      : { studioId: (parsed as Studio).id ?? null, data: parsed as Studio };
    if (payload.studioId && payload.studioId !== currentStudioId) {
      clearStudioCache();
      return null;
    }
    studioCache = payload.data;
    studioCacheStudioId = payload.studioId ?? payload.data.id ?? null;
    return payload.data;
  } catch {
    return null;
  }
}

function writeStudioCache(data: Studio, currentStudioId: string | null) {
  studioCache = data;
  studioCacheStudioId = currentStudioId ?? data.id ?? null;
  if (typeof window === 'undefined') return;
  try {
    const payload: StudioCachePayload = {
      studioId: studioCacheStudioId,
      data,
    };
    window.sessionStorage.setItem(STUDIO_CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage errors (private mode, quota).
  }
}

export function primeStudioCache(data: Studio, currentStudioId?: string | null) {
  writeStudioCache(data, currentStudioId ?? data.id ?? null);
}

export function clearStudioCache() {
  studioCache = null;
  studioCacheStudioId = null;
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem(STUDIO_CACHE_KEY);
  } catch {
    // Ignore storage errors.
  }
}

export function useStudio() {
  const [studioId, setStudioId] = useState<string | null>(null);
  const [fallback, setFallback] = useState<Studio | undefined>(undefined);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const syncFromSession = () => {
      const nextStudioId = readSessionStudioId();
      setStudioId(nextStudioId);
      setFallback(readStudioCache(nextStudioId) ?? undefined);
      setReady(true);
    };

    syncFromSession();
    window.addEventListener(SESSION_CACHE_UPDATED_EVENT, syncFromSession);
    return () => {
      window.removeEventListener(SESSION_CACHE_UPDATED_EVENT, syncFromSession);
    };
  }, []);

  const swr = useSWR<Studio>(ready && studioId ? 'studios/me' : null, {
    fallbackData: fallback,
    revalidateOnMount: !fallback,
  });

  useEffect(() => {
    if (swr.data) {
      writeStudioCache(swr.data, studioId ?? null);
    }
  }, [studioId, swr.data]);

  return {
    ...swr,
    data: swr.data ?? fallback,
    isLoading: !ready || swr.isLoading,
    isValidating: !ready || swr.isValidating,
  };
}
