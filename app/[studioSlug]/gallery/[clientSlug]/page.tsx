'use client';

import GalleryClient from '@/components/gallery/GalleryClient';
import { buildStudioBaseUrl } from '@/lib/studio-url';
import { GalleryFooter } from './components/gallery-footer';
import { GalleryHero } from './components/gallery-hero';
import { GalleryState } from './components/gallery-state';
import { useGalleryClient } from './hooks/use-gallery-client';
import type { Props } from './types';
import { formatEventDate } from './utils';

export default function GalleryPage({ params }: Props) {
  const { studioSlug, clientSlug } = params;
  const { client, loading, isDownloading, downloadUrl, handleDownloadAll } = useGalleryClient({
    studioSlug,
    clientSlug,
  });

  if (loading) {
    return <GalleryState title="Loading gallery..." description="" loading />;
  }

  if (!client) {
    return (
      <GalleryState
        title="Gallery Not Found"
        description="The link might be invalid or expired."
      />
    );
  }

  if (client.status === 'ARCHIVED' || client.status === 'DELETED') {
    return (
      <GalleryState
        emoji="🚧"
        title="Under Construction"
        description="The page is under construction please contact the studio."
      />
    );
  }

  const studioName = client.studio?.name || client.studio_slug || studioSlug;
  const studioHomeUrl = buildStudioBaseUrl(studioSlug);
  const eventDateLabel = formatEventDate(client.event_date);
  const socials = client.studio?.social_links || {};

  const handlePlaySlideshow = () => {
    const event = new CustomEvent('openSlideshow');
    window.dispatchEvent(event);
  };

  return (
    <div className="min-h-screen bg-bg-white-0 pb-20">
      <GalleryHero
        studioName={studioName}
        studioLogoUrl={client.studio?.logo_url}
        studioHomeUrl={studioHomeUrl}
        clientName={client.name}
        clientSubheading={client.subheading}
        eventDateLabel={eventDateLabel}
        headerMediaUrl={client.header_media_url}
        headerMediaType={client.header_media_type}
        isDownloading={isDownloading}
        onDownloadAll={handleDownloadAll}
        onPlaySlideshow={handlePlaySlideshow}
      />

      <GalleryClient photos={client.photos} downloadUrl={downloadUrl} />

      <GalleryFooter
        studioName={studioName}
        studioLogoUrl={client.studio?.logo_url}
        contactEmail={client.studio?.contact_email}
        contactPhone={client.studio?.contact_phone}
        socials={socials}
      />
    </div>
  );
}
