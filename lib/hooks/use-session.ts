'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';

export type SessionUser = {
  id: string;
  email: string;
  name?: string;
  role?: string;
  permissions?: string[];
  studioId?: string;
  studioSlug?: string;
  studioName?: string;
  studioStatus?: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  display_name?: string | null;
  avatar_url?: string | null;
};

export const SESSION_CACHE_KEY = 'studio_app_session_v1';
export const SESSION_CACHE_UPDATED_EVENT = 'studio-app:session-cache-updated';
let sessionCache: SessionUser | null = null;

function dispatchSessionCacheUpdate(data: SessionUser | null) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent<SessionUser | null>(SESSION_CACHE_UPDATED_EVENT, {
      detail: data,
    })
  );
}

function readSessionCache(): SessionUser | null {
  if (sessionCache) return sessionCache;
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(SESSION_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SessionUser;
    sessionCache = parsed;
    return parsed;
  } catch {
    return null;
  }
}

export function getCachedSession(): SessionUser | null {
  return readSessionCache();
}

function writeSessionCache(data: SessionUser) {
  sessionCache = data;
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage errors (private mode, quota).
  }
  dispatchSessionCacheUpdate(data);
}

export function primeSessionCache(data: SessionUser) {
  writeSessionCache(data);
}

export function clearSessionCache() {
  sessionCache = null;
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem(SESSION_CACHE_KEY);
  } catch {
    // Ignore storage errors.
  }
  dispatchSessionCacheUpdate(null);
}

type UseSessionOptions = {
  requireFresh?: boolean;
};

export function useSession(options: UseSessionOptions = {}) {
  const { requireFresh = false } = options;
  const [fallback, setFallback] = useState<SessionUser | undefined>(undefined);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setFallback(readSessionCache() ?? undefined);
    setReady(true);
  }, []);

  const swr = useSWR<SessionUser>(ready ? 'auth/me' : null, {
    fallbackData: fallback,
    revalidateOnMount: requireFresh || !fallback,
  });

  useEffect(() => {
    if (swr.data) {
      writeSessionCache(swr.data);
    }
  }, [swr.data]);

  return {
    ...swr,
    data: swr.data ?? fallback,
    isLoading: !ready || swr.isLoading,
    isValidating: !ready || swr.isValidating,
  };
}
