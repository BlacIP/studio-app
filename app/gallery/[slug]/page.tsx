'use client';

import GalleryClient from '@/components/gallery/GalleryClient';
import { useState } from 'react';
import { getApiUrl } from '@/lib/api-client';
import GalleryHero from './components/gallery-hero';
import { useGalleryClient } from './hooks/use-gallery-client';
import type { Props } from './types';

export default function GalleryPage({ params }: Props) {
  const { client, loading } = useGalleryClient(params.slug);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadAll = async () => {
    setIsDownloading(true);
    try {
      const baseUrl = getApiUrl();
      const downloadUrl = `${baseUrl}/gallery/${params.slug}/download`;

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

  // Handle Archived/Deleted status
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

  const formattedDate = client.event_date
    ? new Date(client.event_date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';
  const openSlideshow = () => {
    const event = new CustomEvent('openSlideshow');
    window.dispatchEvent(event);
  };

  const scrollToGallery = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-bg-white-0 pb-20">
      <GalleryHero
        client={client}
        formattedDate={formattedDate}
        isDownloading={isDownloading}
        onDownloadAll={handleDownloadAll}
        onOpenSlideshow={openSlideshow}
        onViewGallery={scrollToGallery}
      />

      {/* Interactive Gallery Grid using Client Component */}
      <GalleryClient photos={client.photos} />

      <footer className="mt-20 border-t border-stroke-soft-200 py-8 text-center text-sm text-text-sub-600">
        <p>Powered by Studio Gallery</p>
      </footer>
    </div>
  );
}
