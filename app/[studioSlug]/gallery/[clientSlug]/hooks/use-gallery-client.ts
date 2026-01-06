import { useEffect, useState } from 'react';
import { getApiUrl } from '@/lib/api-client';
import type { Client } from '../types';

export function useGalleryClient({
  studioSlug,
  clientSlug,
}: {
  studioSlug: string;
  clientSlug: string;
}) {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    let active = true;

    async function fetchClient() {
      try {
        const baseUrl = getApiUrl();
        const url = `${baseUrl}/gallery/${studioSlug}/${clientSlug}`;
        const response = await fetch(url);
        if (!active) return;
        if (response.ok) {
          const data = await response.json();
          setClient(data);
        } else {
          setClient(null);
        }
      } catch (error) {
        console.error('Error fetching client:', error);
        if (active) setClient(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchClient();
    return () => {
      active = false;
    };
  }, [clientSlug, studioSlug]);

  const downloadUrl = `${getApiUrl()}/gallery/${studioSlug}/${clientSlug}/download`;

  const handleDownloadAll = async () => {
    setIsDownloading(true);
    try {
      window.location.href = downloadUrl;
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download gallery. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    client,
    loading,
    isDownloading,
    downloadUrl,
    handleDownloadAll,
  };
}
