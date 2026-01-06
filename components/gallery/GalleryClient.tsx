'use client';

import { useCallback, useEffect, useState } from 'react';
import type { GalleryPhoto, LightboxState } from './gallery-types';
import { GalleryGrid } from './GalleryGrid';
import { GalleryLightbox } from './GalleryLightbox';
import { GallerySlideshow } from './GallerySlideshow';

interface GalleryClientProps {
  photos: GalleryPhoto[];
  downloadUrl?: string;
}

export default function GalleryClient({ photos }: GalleryClientProps) {
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const [isSlideshow, setIsSlideshow] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const hasPhotos = photos.length > 0;
  const lastSlideIndex = photos.length - 1;
  const showSlideshow = isSlideshow && hasPhotos;

  const goNextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev === lastSlideIndex ? 0 : prev + 1));
  }, [lastSlideIndex]);

  const goPreviousSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev === 0 ? lastSlideIndex : prev - 1));
  }, [lastSlideIndex]);

  // Auto-advance slideshow
  useEffect(() => {
    if (!isSlideshow || !isPlaying || !hasPhotos) return;

    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev === lastSlideIndex ? 0 : prev + 1));
    }, 5000); // 5 seconds

    return () => clearInterval(timer);
  }, [hasPhotos, isSlideshow, isPlaying, lastSlideIndex]);

  // Keyboard controls for slideshow
  useEffect(() => {
    if (!isSlideshow) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          goPreviousSlide();
          break;
        case 'ArrowRight':
          goNextSlide();
          break;
        case ' ':
          e.preventDefault();
          setIsPlaying((prev) => !prev);
          break;
        case 'Escape':
          setIsSlideshow(false);
          setIsPlaying(true);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNextSlide, goPreviousSlide, isSlideshow]);

  // Listen for slideshow event from hero button
  useEffect(() => {
    const handleOpenSlideshow = () => {
      setIsSlideshow(true);
      setCurrentSlideIndex(0);
      setIsPlaying(true);
    };

    window.addEventListener('openSlideshow', handleOpenSlideshow);
    return () => window.removeEventListener('openSlideshow', handleOpenSlideshow);
  }, []);

  return (
    <>
      {showSlideshow && (
        <GallerySlideshow
          photos={photos}
          currentIndex={currentSlideIndex}
          isPlaying={isPlaying}
          onClose={() => {
            setIsSlideshow(false);
            setIsPlaying(true);
          }}
          onNext={goNextSlide}
          onPrevious={goPreviousSlide}
          onTogglePlay={() => setIsPlaying((prev) => !prev)}
        />
      )}

      <GalleryLightbox lightbox={lightbox} onClose={() => setLightbox(null)} />
      <GalleryGrid photos={photos} onOpenLightbox={(photo) => setLightbox({ url: photo.url, filename: photo.filename })} />
    </>
  );
}
