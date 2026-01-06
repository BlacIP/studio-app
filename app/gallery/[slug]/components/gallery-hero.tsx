import Image from 'next/image';
import Header from '@/components/header';
import type { GalleryClientData } from '../types';

interface GalleryHeroProps {
  client: GalleryClientData;
  formattedDate: string;
  isDownloading: boolean;
  onDownloadAll: () => void;
  onOpenSlideshow: () => void;
  onViewGallery: () => void;
}

export default function GalleryHero({
  client,
  formattedDate,
  isDownloading,
  onDownloadAll,
  onOpenSlideshow,
  onViewGallery,
}: GalleryHeroProps) {
  const hasHeaderMedia = Boolean(client.header_media_url);
  const titleStyle = { fontSize: 'clamp(1.5rem, 5vw, 3.75rem)' } as const;
  const subtitleStyle = { fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)' } as const;
  const dateStyle = { fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)' } as const;
  const downloadTitle = isDownloading ? 'Preparing download...' : 'Download All';
  const actionButtonClass = hasHeaderMedia
    ? 'rounded-lg bg-white/10 p-3 text-white transition-colors hover:bg-white/20 backdrop-blur-sm disabled:opacity-50'
    : 'rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-3 text-text-strong-950 shadow-sm transition-colors hover:bg-bg-weak-50 disabled:opacity-50';
  const slideshowButtonClass = hasHeaderMedia
    ? 'rounded-lg bg-white/10 p-3 text-white transition-colors hover:bg-white/20 backdrop-blur-sm'
    : 'rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-3 text-text-strong-950 shadow-sm transition-colors hover:bg-bg-weak-50';

  const downloadIcon = isDownloading ? (
    <svg className="h-6 w-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  ) : (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </svg>
  );

  const actions = (
    <div className="flex gap-3">
      <button
        onClick={onDownloadAll}
        disabled={isDownloading}
        className={actionButtonClass}
        title={downloadTitle}
      >
        {downloadIcon}
      </button>
      <button
        onClick={onOpenSlideshow}
        className={slideshowButtonClass}
        title="Play Slideshow"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    </div>
  );

  if (hasHeaderMedia) {
    return (
      <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-bg-weak-50">
        <Header className="absolute left-0 right-0 top-0 z-50 border-none bg-transparent text-white" />

        {client.header_media_type === 'video' ? (
          <video
            src={client.header_media_url}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <Image
            src={client.header_media_url}
            alt={client.name}
            fill
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
          <h1 style={titleStyle} className="break-words font-semibold leading-tight text-white">
            {client.name}
          </h1>
          {client.subheading && (
            <p
              style={subtitleStyle}
              className="mx-auto mt-4 max-w-3xl whitespace-pre-wrap leading-relaxed text-white/90"
            >
              {client.subheading}
            </p>
          )}
          <p style={dateStyle} className="mt-5 font-normal text-white/80">
            {formattedDate}
          </p>
          <div className="mt-8 flex flex-col items-center gap-4">
            <button
              onClick={onViewGallery}
              className="rounded-lg border-2 border-white px-8 py-4 text-lg font-normal text-white transition-all hover:bg-white/10"
            >
              View Gallery ↓
            </button>
            {actions}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="border-b border-stroke-soft-200 bg-bg-weak-50 px-4 py-16 text-center sm:py-24">
        <h1 style={titleStyle} className="break-words font-semibold leading-tight text-text-strong-950">
          {client.name}
        </h1>
        {client.subheading && (
          <p
            style={subtitleStyle}
            className="mx-auto mt-4 max-w-3xl whitespace-pre-wrap leading-relaxed text-text-sub-600"
          >
            {client.subheading}
          </p>
        )}
        <p style={dateStyle} className="mt-5 font-normal text-text-sub-600">
          {formattedDate}
        </p>
        <div className="mt-6 flex flex-col items-center gap-4">{actions}</div>
      </div>
    </>
  );
}
