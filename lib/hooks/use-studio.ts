'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useSession, SESSION_CACHE_KEY } from '@/lib/hooks/use-session';

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
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(SESSION_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { studioId?: string };
    return parsed.studioId ?? null;
  } catch {
    return null;
  }
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
  const { data: session } = useSession();
  const [studioId, setStudioId] = useState<string | null>(session?.studioId ?? null);

  useEffect(() => {
    const resolvedId = session?.studioId ?? readSessionStudioId();
    setStudioId(resolvedId);
  }, [session?.studioId]);

  const swr = useSWR<Studio>(studioId ? 'studios/me' : null, {
    revalidateOnMount: false,
  });
  const { mutate } = swr;

  useEffect(() => {
    if (!studioId) return;
    const cached = readStudioCache(studioId);
    if (cached) {
      mutate(cached, false);
      return;
    }
    mutate();
  }, [mutate, studioId]);

  useEffect(() => {
    if (swr.data) {
      writeStudioCache(swr.data, studioId ?? null);
    }
  }, [studioId, swr.data]);

  return swr;
}
