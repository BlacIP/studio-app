'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';
import { buildStudioGalleryUrl } from '@/lib/studio-url';

type StudioPublic = {
  name: string;
  slug: string;
  status: string;
  logo_url?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  address?: string | null;
  social_links?: Record<string, string> | null;
};

type StudioGallery = {
  id: string;
  name: string;
  slug: string;
  event_date: string | null;
  subheading: string | null;
  header_media_url: string | null;
  header_media_type: string | null;
  photo_count: number;
};

type PageProps = {
  params: { studioSlug: string };
};

export default function StudioHomePage({ params }: PageProps) {
  const { studioSlug } = params;
  const [studio, setStudio] = useState<StudioPublic | null>(null);
  const [galleries, setGalleries] = useState<StudioGallery[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = (await api.get(`studios/public/${studioSlug}`)) as StudioPublic;
        if (!cancelled) setStudio(data);
        const galleryData = (await api.get(`studios/public/${studioSlug}/clients`)) as StudioGallery[];
        if (!cancelled) setGalleries(galleryData);
      } catch (err: unknown) {
        console.error(err);
        const message = err instanceof Error ? err.message : 'Unable to load studio.';
        if (!cancelled) setError(message);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [studioSlug]);

  if (error) {
    return (
      <div className="min-h-screen px-6 py-10">
        <h1 className="text-2xl font-semibold text-text-strong-950">Studio not found</h1>
        <p className="mt-2 text-sm text-text-sub-600">{error}</p>
      </div>
    );
  }

  if (!studio) {
    return (
      <div className="min-h-screen px-6 py-10 text-sm text-text-sub-600">
        Loading studio...
      </div>
    );
  }

  const socials = studio.social_links || {};
  const hasGalleries = galleries.length > 0;
  const studioInitials = studio.name.slice(0, 2).toUpperCase();
  const socialLinks = [
    { label: 'Instagram', href: socials.instagram },
    { label: 'Facebook', href: socials.facebook },
    { label: 'X (Twitter)', href: socials.x },
    { label: 'TikTok', href: socials.tiktok },
  ].filter((item) => item.href);

  return (
    <div className="min-h-screen bg-bg-weak-50 text-text-strong-950">
      <header className="border-b border-stroke-soft-200 bg-bg-white-0">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            {studio.logo_url ? (
              <Image
                src={studio.logo_url}
                alt={`${studio.name} logo`}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-weak-100 text-sm font-semibold">
                {studioInitials}
              </div>
            )}
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-text-sub-600">Studio</p>
              <h1 className="text-lg font-semibold">{studio.name}</h1>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-text-sub-600 md:flex">
            <span className="font-medium text-text-strong-950">Home</span>
            <span>Client galleries</span>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
          <section className="rounded-2xl border border-stroke-soft-200 bg-bg-white-0 p-8 shadow-sm">
            <h2 className="text-2xl font-semibold">Welcome to {studio.name}</h2>
            <p className="mt-2 text-sm text-text-sub-600">
              This is your public studio homepage. Client galleries, updates, and share links will live here.
            </p>
            <div className="mt-6 grid gap-3 text-sm text-text-sub-600">
              {studio.address && <p>{studio.address}</p>}
            </div>
            <div className="mt-8">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-text-sub-600">
                Recent galleries
              </h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {!hasGalleries && (
                  <div className="rounded-xl border border-stroke-soft-200 bg-bg-weak-50 p-4 text-sm text-text-sub-600">
                    No galleries yet.
                  </div>
                )}
                {galleries.map((gallery) => (
                  <a
                    key={gallery.id}
                    href={buildStudioGalleryUrl(studio.slug, gallery.slug)}
                    className="group overflow-hidden rounded-xl border border-stroke-soft-200 bg-bg-white-0 transition hover:border-text-sub-600"
                  >
                    <div className="relative h-32 w-full bg-bg-weak-50">
                      {gallery.header_media_url && (
                        <Image
                          src={gallery.header_media_url}
                          alt={gallery.name}
                          fill
                          sizes="(min-width: 640px) 50vw, 100vw"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold">{gallery.name}</p>
                        <span className="text-xs text-text-sub-600">{gallery.photo_count} photos</span>
                      </div>
                      {gallery.subheading && (
                        <p className="mt-1 text-xs text-text-sub-600">{gallery.subheading}</p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>

          <aside className="rounded-2xl border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-sm">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-text-sub-600">
              Contact
            </h3>
            <div className="mt-4 space-y-2 text-sm text-text-sub-600">
              {studio.contact_email && <p>{studio.contact_email}</p>}
              {studio.contact_phone && <p>{studio.contact_phone}</p>}
              {socialLinks.map((link) => (
                <a key={link.label} className="block underline underline-offset-4" href={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
