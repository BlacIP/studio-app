'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { buildStudioBaseUrl } from '@/lib/studio-url';

type Photo = {
  id: string;
  url: string;
  filename?: string | null;
};

type GalleryResponse = {
  id: string;
  name: string;
  slug: string;
  event_date: string | null;
  subheading: string | null;
  status: string | null;
  header_media_url: string | null;
  header_media_type: string | null;
  studio_slug: string | null;
  studio?: {
    name?: string | null;
    slug?: string | null;
    logo_url?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    address?: string | null;
    social_links?: Record<string, string> | null;
  };
  photos: Photo[];
};

type PageProps = {
  params: { studioSlug: string; clientSlug: string };
};

export default function GalleryPage({ params }: PageProps) {
  const { studioSlug, clientSlug } = params;
  const [gallery, setGallery] = useState<GalleryResponse | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = (await api.get(`gallery/${studioSlug}/${clientSlug}`)) as GalleryResponse;
        if (!cancelled) setGallery(data);
      } catch (err: any) {
        console.error(err);
        if (!cancelled) setError(err.message || 'Unable to load gallery.');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [studioSlug, clientSlug]);

  const studioName = gallery?.studio?.name || gallery?.studio_slug || studioSlug;
  const studioHomeUrl = useMemo(() => buildStudioBaseUrl(studioSlug), [studioSlug]);

  if (error) {
    return (
      <div className="min-h-screen px-6 py-10">
        <h1 className="text-2xl font-semibold text-text-strong-950">Gallery unavailable</h1>
        <p className="mt-2 text-sm text-text-sub-600">{error}</p>
      </div>
    );
  }

  if (!gallery) {
    return (
      <div className="min-h-screen px-6 py-10 text-sm text-text-sub-600">
        Loading gallery...
      </div>
    );
  }

  const socials = gallery.studio?.social_links || {};

  return (
    <div className="min-h-screen bg-bg-weak-50 text-text-strong-950">
      <header className="border-b border-stroke-soft-200 bg-bg-white-0">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            {gallery.studio?.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={gallery.studio.logo_url}
                alt={`${studioName} logo`}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-weak-100 text-sm font-semibold">
                {studioName.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-text-sub-600">Studio</p>
              <h1 className="text-lg font-semibold">{studioName}</h1>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-text-sub-600 md:flex">
            <Link href={studioHomeUrl} className="hover:text-text-strong-950">
              Studio home
            </Link>
            <span className="font-medium text-text-strong-950">Gallery</span>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold">{gallery.name}</h2>
            <p className="mt-1 text-sm text-text-sub-600">{gallery.subheading || 'Client gallery'}</p>
          </div>
          <a
            href={`/api/gallery/${studioSlug}/${clientSlug}/download`}
            className="rounded-lg border border-stroke-soft-200 bg-bg-white-0 px-4 py-2 text-sm font-medium shadow-sm hover:border-text-sub-600"
          >
            Download gallery
          </a>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.photos.length === 0 && (
            <div className="rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-6 text-sm text-text-sub-600">
              No photos uploaded yet.
            </div>
          )}
          {gallery.photos.map((photo) => (
            <div key={photo.id} className="overflow-hidden rounded-xl border border-stroke-soft-200 bg-bg-white-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={photo.filename || gallery.name}
                className="h-56 w-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-stroke-soft-200 bg-bg-white-0">
        <div className="mx-auto w-full max-w-6xl px-6 py-6 text-sm text-text-sub-600">
          <div className="flex flex-wrap gap-4">
            {gallery.studio?.contact_email && <span>{gallery.studio.contact_email}</span>}
            {gallery.studio?.contact_phone && <span>{gallery.studio.contact_phone}</span>}
            {socials.instagram && (
              <a className="underline underline-offset-4" href={socials.instagram}>
                Instagram
              </a>
            )}
            {socials.facebook && (
              <a className="underline underline-offset-4" href={socials.facebook}>
                Facebook
              </a>
            )}
            {socials.x && (
              <a className="underline underline-offset-4" href={socials.x}>
                X (Twitter)
              </a>
            )}
            {socials.tiktok && (
              <a className="underline underline-offset-4" href={socials.tiktok}>
                TikTok
              </a>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
