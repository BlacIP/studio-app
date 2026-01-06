'use client';

import Image from 'next/image';
import type { GalleryPhoto } from './gallery-types';

interface GallerySlideshowProps {
  photos: GalleryPhoto[];
  currentIndex: number;
  isPlaying: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onTogglePlay: () => void;
}

export function GallerySlideshow({
  photos,
  currentIndex,
  isPlaying,
  onClose,
  onNext,
  onPrevious,
  onTogglePlay,
}: GallerySlideshowProps) {
  const currentPhoto = photos[currentIndex];
  if (!currentPhoto) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black">
      <div className="absolute top-0 left-0 right-0 z-[101] flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="text-lg font-medium text-white">
          {currentIndex + 1} / {photos.length}
        </div>
        <button
          onClick={onClose}
          className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
        >
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center p-4">
        <div className="relative h-full w-full max-h-full max-w-full">
          <Image
            src={currentPhoto.url}
            alt={currentPhoto.filename}
            fill
            sizes="100vw"
            className="object-contain"
          />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-[101] flex items-center justify-center gap-4 bg-gradient-to-t from-black/80 to-transparent p-6">
        <button
          onClick={onPrevious}
          className="rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
          title="Previous (←)"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={onTogglePlay}
          className="rounded-full bg-white/10 p-4 text-white transition-colors hover:bg-white/20"
          title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
        >
          {isPlaying ? (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </button>

        <button
          onClick={onNext}
          className="rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
          title="Next (→)"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
