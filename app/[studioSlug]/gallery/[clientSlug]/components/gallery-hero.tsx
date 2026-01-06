import Image from 'next/image';
import { GalleryActions } from './gallery-actions';
import { StudioHeader } from './studio-header';

export function GalleryHero({
  studioName,
  studioLogoUrl,
  studioHomeUrl,
  clientName,
  clientSubheading,
  eventDateLabel,
  headerMediaUrl,
  headerMediaType,
  isDownloading,
  onDownloadAll,
  onPlaySlideshow,
}: {
  studioName: string;
  studioLogoUrl?: string | null;
  studioHomeUrl: string;
  clientName: string;
  clientSubheading?: string;
  eventDateLabel?: string;
  headerMediaUrl?: string;
  headerMediaType?: 'image' | 'video';
  isDownloading: boolean;
  onDownloadAll: () => void;
  onPlaySlideshow: () => void;
}) {
  const hasHeader = Boolean(headerMediaUrl);

  if (hasHeader) {
    return (
      <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-bg-weak-50">
        <StudioHeader
          studioName={studioName}
          logoUrl={studioLogoUrl}
          homeUrl={studioHomeUrl}
          overlay
        />

        {headerMediaType === 'video' ? (
          <video
            src={headerMediaUrl}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <Image
            src={headerMediaUrl}
            alt={clientName}
            fill
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h1
            style={{ fontSize: 'clamp(1.5rem, 5vw, 3.75rem)' }}
            className="font-semibold text-white break-words leading-tight"
          >
            {clientName}
          </h1>
          {clientSubheading && (
            <p
              style={{ fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)' }}
              className="mt-4 text-white/90 max-w-3xl mx-auto whitespace-pre-wrap leading-relaxed"
            >
              {clientSubheading}
            </p>
          )}
          {eventDateLabel && (
            <p
              style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)' }}
              className="mt-5 font-normal text-white/80"
            >
              {eventDateLabel}
            </p>
          )}
          <GalleryActions
            variant="overlay"
            isDownloading={isDownloading}
            onDownloadAll={onDownloadAll}
            onPlaySlideshow={onPlaySlideshow}
            showScroll
            onScrollToGallery={() =>
              window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
            }
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <StudioHeader studioName={studioName} logoUrl={studioLogoUrl} homeUrl={studioHomeUrl} />
      <div className="py-16 sm:py-24 px-4 text-center bg-bg-weak-50 border-b border-stroke-soft-200">
        <h1
          style={{ fontSize: 'clamp(1.5rem, 5vw, 3.75rem)' }}
          className="font-semibold text-text-strong-950 break-words leading-tight"
        >
          {clientName}
        </h1>
        {clientSubheading && (
          <p
            style={{ fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)' }}
            className="mt-4 text-text-sub-600 max-w-3xl mx-auto whitespace-pre-wrap leading-relaxed"
          >
            {clientSubheading}
          </p>
        )}
        {eventDateLabel && (
          <p
            style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)' }}
            className="mt-5 font-normal text-text-sub-600"
          >
            {eventDateLabel}
          </p>
        )}
        <GalleryActions
          variant="default"
          isDownloading={isDownloading}
          onDownloadAll={onDownloadAll}
          onPlaySlideshow={onPlaySlideshow}
        />
      </div>
    </>
  );
}
