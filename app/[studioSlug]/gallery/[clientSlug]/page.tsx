'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import GalleryClient from '@/components/gallery/GalleryClient';
import { getApiUrl } from '@/lib/api-client';
import { buildStudioBaseUrl } from '@/lib/studio-url';
import { cn } from '@/utils/cn';

interface Props {
  params: { studioSlug: string; clientSlug: string };
}

interface Photo {
  id: string;
  url: string;
  public_id?: string;
  filename: string;
}

interface StudioInfo {
  name?: string | null;
  slug?: string | null;
  logo_url?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  address?: string | null;
  social_links?: Record<string, string> | null;
}

interface Client {
  id: string;
  name: string;
  slug: string;
  event_date: string;
  status?: 'ACTIVE' | 'ARCHIVED' | 'DELETED';
  subheading?: string;
  header_media_url?: string;
  header_media_type?: 'image' | 'video';
  studio_slug?: string | null;
  studio?: StudioInfo;
  photos: Photo[];
}

function getInitials(name: string) {
  const cleaned = name.trim();
  if (!cleaned) return 'ST';
  const words = cleaned.split(' ').filter(Boolean);
  const initials = words.slice(0, 2).map((word) => word[0]).join('');
  return initials.toUpperCase();
}

function StudioHeader({
  studioName,
  logoUrl,
  homeUrl,
  overlay,
}: {
  studioName: string;
  logoUrl?: string | null;
  homeUrl: string;
  overlay?: boolean;
}) {
  const wrapperClass = overlay
    ? 'absolute left-0 right-0 top-0 z-50 border-none text-white'
    : 'border-b border-stroke-soft-200 text-text-strong-950';
  const navClass = overlay
    ? 'text-white/80 hover:text-white'
    : 'text-text-sub-600 hover:text-text-strong-950';

  return (
    <div className={cn(wrapperClass, overlay ? 'bg-transparent' : 'bg-bg-white-0')}>
      <header className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
        <div className="flex items-center gap-2 text-label-md font-bold text-inherit">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={studioName} className="h-7 w-7 rounded-full object-cover" />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-bg-weak-100 text-[10px] font-semibold text-text-strong-950">
              {getInitials(studioName)}
            </div>
          )}
          <span>{studioName}</span>
        </div>
        <nav className={cn('hidden items-center gap-4 text-sm sm:flex', navClass)}>
          <Link href={homeUrl} className="transition-colors">
            Studio home
          </Link>
          <span className={overlay ? 'font-medium text-white' : 'font-medium text-text-strong-950'}>
            Gallery
          </span>
        </nav>
      </header>
    </div>
  );
}

export default function GalleryPage({ params }: Props) {
  const { studioSlug, clientSlug } = params;
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    async function fetchClient() {
      try {
        const baseUrl = getApiUrl();
        const url = `${baseUrl}/gallery/${studioSlug}/${clientSlug}`;
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setClient(data);
        } else {
          setClient(null);
        }
      } catch (error) {
        console.error('Error fetching client:', error);
        setClient(null);
      } finally {
        setLoading(false);
      }
    }
    fetchClient();
  }, [studioSlug, clientSlug]);

  const handleDownloadAll = async () => {
    setIsDownloading(true);
    try {
      const baseUrl = getApiUrl();
      const downloadUrl = `${baseUrl}/gallery/${studioSlug}/${clientSlug}/download`;
      window.location.href = downloadUrl;
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download gallery. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-white-0">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-base mx-auto"></div>
          <p className="mt-4 text-text-sub-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-white-0 text-text-sub-600">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-strong-950">Gallery Not Found</h1>
          <p className="mt-2">The link might be invalid or expired.</p>
        </div>
      </div>
    );
  }

  if (client.status === 'ARCHIVED' || client.status === 'DELETED') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-white-0 text-text-sub-600">
        <div className="text-center max-w-md px-6">
          <div className="mb-4 text-4xl">🚧</div>
          <h1 className="text-2xl font-bold text-text-strong-950">Under Construction</h1>
          <p className="mt-2 text-lg">The page is under construction please contact the studio.</p>
        </div>
      </div>
    );
  }

  const studioName = client.studio?.name || client.studio_slug || studioSlug;
  const studioHomeUrl = buildStudioBaseUrl(studioSlug);
  const downloadUrl = `${getApiUrl()}/gallery/${studioSlug}/${clientSlug}/download`;
  const socials = client.studio?.social_links || {};

  return (
    <div className="min-h-screen bg-bg-white-0 pb-20">
      {client.header_media_url ? (
        <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-bg-weak-50">
          <StudioHeader
            studioName={studioName}
            logoUrl={client.studio?.logo_url}
            homeUrl={studioHomeUrl}
            overlay
          />

          {client.header_media_type === 'video' ? (
            <video
              src={client.header_media_url}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={client.header_media_url}
              alt={client.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
            <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 3.75rem)' }} className="font-semibold text-white break-words leading-tight">
              {client.name}
            </h1>
            {client.subheading && (
              <p
                style={{ fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)' }}
                className="mt-4 text-white/90 max-w-3xl mx-auto whitespace-pre-wrap leading-relaxed"
              >
                {client.subheading}
              </p>
            )}
            <p style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)' }} className="mt-5 font-normal text-white/80">
              {client.event_date &&
                new Date(client.event_date).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
            </p>
            <div className="mt-8 flex flex-col items-center gap-4">
              <button
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                className="px-8 py-4 border-2 border-white text-white rounded-lg font-normal text-lg hover:bg-white/10 transition-all"
              >
                View Gallery ↓
              </button>
              <div className="flex gap-3">
                <button
                  onClick={handleDownloadAll}
                  disabled={isDownloading}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors backdrop-blur-sm disabled:opacity-50"
                  title={isDownloading ? 'Preparing download...' : 'Download All'}
                >
                  {isDownloading ? (
                    <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => {
                    const event = new CustomEvent('openSlideshow');
                    window.dispatchEvent(event);
                  }}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors backdrop-blur-sm"
                  title="Play Slideshow"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <StudioHeader studioName={studioName} logoUrl={client.studio?.logo_url} homeUrl={studioHomeUrl} />
          <div className="py-16 sm:py-24 px-4 text-center bg-bg-weak-50 border-b border-stroke-soft-200">
            <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 3.75rem)' }} className="font-semibold text-text-strong-950 break-words leading-tight">
              {client.name}
            </h1>
            {client.subheading && (
              <p
                style={{ fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)' }}
                className="mt-4 text-text-sub-600 max-w-3xl mx-auto whitespace-pre-wrap leading-relaxed"
              >
                {client.subheading}
              </p>
            )}
            <p style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)' }} className="mt-5 font-normal text-text-sub-600">
              {client.event_date &&
                new Date(client.event_date).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
            </p>
            <div className="mt-6 flex flex-col items-center gap-4">
              <div className="flex gap-3">
                <button
                  onClick={handleDownloadAll}
                  disabled={isDownloading}
                  className="p-3 bg-bg-white-0 hover:bg-bg-weak-50 rounded-lg text-text-strong-950 transition-colors shadow-sm border border-stroke-soft-200 disabled:opacity-50"
                  title={isDownloading ? 'Preparing download...' : 'Download All'}
                >
                  {isDownloading ? (
                    <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => {
                    const event = new CustomEvent('openSlideshow');
                    window.dispatchEvent(event);
                  }}
                  className="p-3 bg-bg-white-0 hover:bg-bg-weak-50 rounded-lg text-text-strong-950 transition-colors shadow-sm border border-stroke-soft-200"
                  title="Play Slideshow"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <GalleryClient photos={client.photos} downloadUrl={downloadUrl} />

      <footer className="mt-20 border-t border-stroke-soft-200">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-5 py-8 text-sm text-text-sub-600">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <div className="flex items-center gap-2 text-text-strong-950">
              {client.studio?.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={client.studio.logo_url} alt={studioName} className="h-6 w-6 rounded-full object-cover" />
              ) : (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-bg-weak-100 text-[10px] font-semibold text-text-strong-950">
                  {getInitials(studioName)}
                </div>
              )}
              <span className="text-sm font-medium">{studioName}</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {client.studio?.contact_email && <span>{client.studio.contact_email}</span>}
              {client.studio?.contact_phone && <span>{client.studio.contact_phone}</span>}
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
          <p className="text-center">Powered by Studio Gallery</p>
        </div>
      </footer>
    </div>
  );
}
