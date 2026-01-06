import Image from 'next/image';
import { getInitials } from '../utils';

export function GalleryFooter({
  studioName,
  studioLogoUrl,
  contactEmail,
  contactPhone,
  socials,
}: {
  studioName: string;
  studioLogoUrl?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  socials: Record<string, string>;
}) {
  return (
    <footer className="mt-20 border-t border-stroke-soft-200">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-5 py-8 text-sm text-text-sub-600">
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-2 text-text-strong-950">
            {studioLogoUrl ? (
              <Image
                src={studioLogoUrl}
                alt={studioName}
                width={24}
                height={24}
                className="h-6 w-6 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-bg-weak-100 text-[10px] font-semibold text-text-strong-950">
                {getInitials(studioName)}
              </div>
            )}
            <span className="text-sm font-medium">{studioName}</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {contactEmail && <span>{contactEmail}</span>}
            {contactPhone && <span>{contactPhone}</span>}
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
  );
}
