import { useCallback } from 'react';
import { mutate } from 'swr';
import { api } from '@/lib/api-client';
import { removeClientFromClientsCache } from '@/lib/hooks/use-clients';
import type { Client } from '../types';

export function useClientStatus({
  client,
  clientId,
  setClient,
  onRefresh,
  showAlert,
  showConfirm,
}: {
  client: Client | null;
  clientId: string;
  setClient: React.Dispatch<React.SetStateAction<Client | null>>;
  onRefresh: () => Promise<unknown>;
  showAlert: (title: string, message: string) => void;
  showConfirm: (title: string, message: string, onConfirm: () => void) => void;
}) {
  const updateStatus = useCallback(
    async (newStatus: Client['status']) => {
      if (!client) return;

      const performUpdate = async () => {
        try {
          await api.put(`clients/${clientId}`, { status: newStatus });
          setClient({ ...client, status: newStatus });
          if (newStatus === 'DELETED') {
            removeClientFromClientsCache(clientId);
            await mutate('clients');
          }
          await onRefresh();
          if (newStatus === 'DELETED') {
            showAlert('Success', 'Client deleted (Soft Delete). Public link is now disabled.');
          }
        } catch (e) {
          console.error(e);
          showAlert('Error', 'Failed to update status');
        }
      };

      if (newStatus === 'DELETED') {
        showConfirm(
          'Delete Client?',
          'Are you sure you want to delete this client? The public link will show a "Under Construction" page.',
          performUpdate
        );
      } else {
        await performUpdate();
      }
    },
    [client, clientId, onRefresh, setClient, showAlert, showConfirm]
  );

  return { updateStatus };
}
