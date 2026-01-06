'use client';

import Image from 'next/image';
import { RiCloseLine, RiDownloadLine } from '@remixicon/react';
import type { LightboxState } from './gallery-types';
import { getDownloadUrl } from './gallery-utils';

interface GalleryLightboxProps {
  lightbox: LightboxState | null;
  onClose: () => void;
}

export function GalleryLightbox({ lightbox, onClose }: GalleryLightboxProps) {
  if (!lightbox) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 animate-in fade-in duration-200">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-[101] rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
      >
        <RiCloseLine size={32} />
      </button>

      <a
        href={getDownloadUrl(lightbox.url, lightbox.filename)}
        download={lightbox.filename}
        target="_blank"
        className="absolute top-4 left-4 z-[101] rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
        title="Download Original"
      >
        <RiDownloadLine size={32} />
      </a>

      <div className="relative h-full w-full max-h-full max-w-full">
        <Image
          src={lightbox.url}
          alt="Full View"
          fill
          sizes="100vw"
          className="object-contain rounded-lg shadow-2xl"
        />
      </div>
    </div>
  );
}
