function SpinnerIcon() {
  return (
    <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </svg>
  );
}

function SlideshowIcon() {
  return (
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
  );
}

const variantClass = {
  overlay: 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm',
  default: 'bg-bg-white-0 hover:bg-bg-weak-50 text-text-strong-950 shadow-sm border border-stroke-soft-200',
};

export function GalleryActions({
  variant,
  isDownloading,
  onDownloadAll,
  onPlaySlideshow,
  showScroll,
  onScrollToGallery,
}: {
  variant: 'overlay' | 'default';
  isDownloading: boolean;
  onDownloadAll: () => void;
  onPlaySlideshow: () => void;
  showScroll?: boolean;
  onScrollToGallery?: () => void;
}) {
  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      {showScroll && onScrollToGallery && (
        <button
          onClick={onScrollToGallery}
          className="px-8 py-4 border-2 border-white text-white rounded-lg font-normal text-lg hover:bg-white/10 transition-all"
        >
          View Gallery ↓
        </button>
      )}
      <div className="flex gap-3">
        <button
          onClick={onDownloadAll}
          disabled={isDownloading}
          className={`p-3 rounded-lg transition-colors disabled:opacity-50 ${variantClass[variant]}`}
          title={isDownloading ? 'Preparing download...' : 'Download All'}
        >
          {isDownloading ? <SpinnerIcon /> : <DownloadIcon />}
        </button>
        <button
          onClick={onPlaySlideshow}
          className={`p-3 rounded-lg transition-colors ${variantClass[variant]}`}
          title="Play Slideshow"
        >
          <SlideshowIcon />
        </button>
      </div>
    </div>
  );
}
