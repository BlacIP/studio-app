import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/utils/cn';
import { getInitials } from '../utils';

export function StudioHeader({
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
            <Image
              src={logoUrl}
              alt={studioName}
              width={28}
              height={28}
              className="h-7 w-7 rounded-full object-cover"
            />
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
