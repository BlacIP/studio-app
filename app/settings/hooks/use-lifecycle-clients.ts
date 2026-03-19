import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api-client';
import type { LifecycleClient } from '../types';

export function useLifecycleClients(active: boolean) {
  const [clients, setClients] = useState<LifecycleClient[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);

  const fetchClients = useCallback(async () => {
    setLoadingClients(true);
    try {
      const data = await api.get<LifecycleClient[]>('clients/lifecycle');
      setClients(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingClients(false);
    }
  }, []);

  useEffect(() => {
    if (active) {
      fetchClients();
    }
  }, [active, fetchClients]);

  const runCleanup = useCallback(async () => {
    if (
      !confirm(
        'This will permanently delete items in Recycle Bin older than 7 days and move Archive items older than 30 days to Recycle Bin. Continue?'
      )
    )
      return;
    try {
      await api.post('clients/lifecycle/cleanup', {});
      await fetchClients();
    } catch (e) {
      console.error(e);
    }
  }, [fetchClients]);

  const updateClientStatus = useCallback(
    async (id: string, status: string) => {
      if (status === 'DELETED_FOREVER') {
        if (
          !confirm(
            'Are you sure you want to permanently delete this client and all photos? This cannot be undone.'
          )
        )
          return;
        try {
          await api.delete(`clients/${id}`);
          await fetchClients();
        } catch (e) {
          console.error(e);
        }
        return;
      }

      try {
        await api.put(`clients/${id}`, { status });
        await fetchClients();
      } catch (e) {
        console.error(e);
      }
    },
    [fetchClients]
  );

  return { clients, loadingClients, runCleanup, updateClientStatus };
}
