'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';

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

function readClientsCache(): StudioClient[] | null {
  if (clientsCache) return clientsCache;
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(CLIENTS_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StudioClient[];
    clientsCache = parsed;
    return parsed;
  } catch {
    return null;
  }
}

function writeClientsCache(data: StudioClient[]) {
  clientsCache = data;
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(CLIENTS_CACHE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage errors.
  }
}

export function clearClientsCache() {
  clientsCache = null;
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem(CLIENTS_CACHE_KEY);
  } catch {
    // Ignore storage errors.
  }
}

export function useClients() {
  const initialFallback = clientsCache ?? undefined;
  const [fallback, setFallback] = useState<StudioClient[] | undefined>(initialFallback);
  const [ready, setReady] = useState(Boolean(initialFallback));

  useEffect(() => {
    if (initialFallback) return;
    const cached = readClientsCache();
    if (cached) {
      setFallback(cached);
    }
    setReady(true);
  }, [initialFallback]);

  const swr = useSWR<StudioClient[]>(ready ? 'clients' : null, {
    fallbackData: fallback,
    revalidateOnMount: !fallback,
  });

  useEffect(() => {
    if (Array.isArray(swr.data)) {
      writeClientsCache(swr.data);
    }
  }, [swr.data]);

  return swr;
}
