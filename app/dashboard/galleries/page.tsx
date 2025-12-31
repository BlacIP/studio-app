'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { api } from '@/lib/api-client';
import { buildStudioGalleryUrl } from '@/lib/studio-url';
import { RiExternalLinkLine, RiImageLine, RiLinkM } from '@remixicon/react';

type Client = {
  id: string;
  name: string;
  slug: string;
  event_date: string;
  photo_count?: number | string;
  status?: string;
};

export default function GalleriesPage() {
  const [studioSlug, setStudioSlug] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [studio, clientList] = await Promise.all([
          api.get('studios/me'),
          api.get('clients'),
        ]);
        if (cancelled) return;
        setStudioSlug(studio?.slug || '');
        setClients(Array.isArray(clientList) ? clientList : []);
      } catch (err: any) {
        console.error(err);
        if (!cancelled) setError(err.message || 'Unable to load galleries.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleCopy = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 1500);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-text-sub-600">Loading galleries...</div>;
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-title-h4 font-bold text-text-strong-950">Galleries</h2>
        <p className="text-paragraph-sm text-text-sub-600">
          Share client galleries with a public link.
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-error-base/30 bg-error-base/10 px-4 py-3 text-sm text-error-base">
          {error}
        </div>
      ) : clients.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stroke-soft-200 bg-bg-white-0 p-12 text-center">
          <h3 className="text-lg font-semibold text-text-strong-950">No galleries yet</h3>
          <p className="mt-1 text-sm text-text-sub-600">
            Create a client to generate the first gallery link.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {clients.map((client) => {
            const galleryUrl = studioSlug ? buildStudioGalleryUrl(studioSlug, client.slug) : '';
            const photoCount = Number(client.photo_count || 0);
            return (
              <div
                key={client.id}
                className="flex flex-col justify-between rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-5 shadow-sm"
              >
                <div>
                  <h3 className="text-base font-semibold text-text-strong-950">{client.name}</h3>
                  <p className="text-sm text-text-sub-600">
                    {client.event_date ? format(new Date(client.event_date), 'PPP') : 'Date not set'}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs font-medium text-text-sub-600">
                    <RiImageLine size={14} />
                    <span>{photoCount} Photos</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                  <a
                    href={galleryUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg border border-stroke-soft-200 px-3 py-1.5 text-text-strong-950 hover:bg-bg-weak-50"
                  >
                    <RiExternalLinkLine size={16} />
                    View gallery
                  </a>
                  <button
                    type="button"
                    onClick={() => galleryUrl && handleCopy(galleryUrl, client.id)}
                    className="inline-flex items-center gap-1 rounded-lg border border-stroke-soft-200 px-3 py-1.5 text-text-strong-950 hover:bg-bg-weak-50"
                    disabled={!galleryUrl}
                  >
                    <RiLinkM size={16} />
                    {copiedId === client.id ? 'Copied' : 'Copy link'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
