import { useEffect, useState } from 'react';
import { getApiUrl } from '@/lib/api-client';
import type { GalleryClientData } from '../types';

export function useGalleryClient(slug: string) {
  const [client, setClient] = useState<GalleryClientData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function fetchClient() {
      try {
        const baseUrl = getApiUrl();
        const url = `${baseUrl}/gallery/${slug}`;
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
  }, [slug]);

  return { client, loading };
}
