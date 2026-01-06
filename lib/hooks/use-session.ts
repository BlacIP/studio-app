'use client';

import { useEffect } from 'react';
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
let sessionCache: SessionUser | null = null;

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

function writeSessionCache(data: SessionUser) {
  sessionCache = data;
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage errors (private mode, quota).
  }
}

export function clearSessionCache() {
  sessionCache = null;
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem(SESSION_CACHE_KEY);
  } catch {
    // Ignore storage errors.
  }
}

type UseSessionOptions = {
  requireFresh?: boolean;
};

export function useSession(options: UseSessionOptions = {}) {
  const { requireFresh = false } = options;
  const swr = useSWR<SessionUser>('auth/me', {
    revalidateOnMount: requireFresh,
  });
  const { mutate } = swr;

  useEffect(() => {
    const cached = readSessionCache();
    if (cached) {
      mutate(cached, false);
      if (requireFresh) {
        mutate();
      }
      return;
    }

    mutate();
  }, [mutate, requireFresh]);

  useEffect(() => {
    if (swr.data) {
      writeSessionCache(swr.data);
    }
  }, [swr.data]);

  return swr;
}
