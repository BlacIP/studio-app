'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useSession, SESSION_CACHE_KEY } from '@/lib/hooks/use-session';

export type StudioClient = {
  id: string;
  name: string;
  slug: string;
  event_date: string;
  photo_count?: number | string;
  status?: string;
};

const CLIENTS_CACHE_KEY = 'studio_app_clients_v1';
let clientsCache: StudioClient[] | null = null;
let clientsCacheStudioId: string | null = null;

type ClientsCachePayload = {
  studioId: string | null;
  data: StudioClient[];
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

function readClientsCache(currentStudioId: string | null): StudioClient[] | null {
  if (!currentStudioId) return null;
  if (clientsCache && clientsCacheStudioId === currentStudioId) return clientsCache;
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(CLIENTS_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StudioClient[] | ClientsCachePayload;
    const payload = 'data' in parsed
      ? (parsed as ClientsCachePayload)
      : { studioId: currentStudioId, data: parsed as StudioClient[] };
    if (payload.studioId && payload.studioId !== currentStudioId) {
      clearClientsCache();
      return null;
    }
    clientsCache = payload.data;
    clientsCacheStudioId = payload.studioId ?? currentStudioId;
    return payload.data;
  } catch {
    return null;
  }
}

function writeClientsCache(data: StudioClient[], currentStudioId: string | null) {
  clientsCache = data;
  clientsCacheStudioId = currentStudioId;
  if (typeof window === 'undefined') return;
  try {
    const payload: ClientsCachePayload = {
      studioId: currentStudioId,
      data,
    };
    window.sessionStorage.setItem(CLIENTS_CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage errors.
  }
}

export function clearClientsCache() {
  clientsCache = null;
  clientsCacheStudioId = null;
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem(CLIENTS_CACHE_KEY);
  } catch {
    // Ignore storage errors.
  }
}

export function useClients() {
  const { data: session } = useSession();
  const currentStudioId = session?.studioId ?? readSessionStudioId();
  const initialFallback = readClientsCache(currentStudioId ?? null) ?? undefined;
  const [fallback, setFallback] = useState<StudioClient[] | undefined>(initialFallback);

  useEffect(() => {
    const cached = readClientsCache(currentStudioId ?? null);
    setFallback(cached ?? undefined);
  }, [currentStudioId]);

  const swr = useSWR<StudioClient[]>(currentStudioId ? 'clients' : null, {
    fallbackData: fallback,
    revalidateOnMount: !fallback,
  });

  useEffect(() => {
    if (Array.isArray(swr.data)) {
      writeClientsCache(swr.data, currentStudioId ?? null);
    }
  }, [currentStudioId, swr.data]);

  return swr;
}
