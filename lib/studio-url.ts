export function buildStudioBaseUrl(studioSlug: string, path = ''): string {
  const normalizedPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  const customBase = process.env.NEXT_PUBLIC_CUSTOM_DOMAIN_BASE;

  if (typeof window === 'undefined' || !customBase) {
    return `/${studioSlug}${normalizedPath}`;
  }

  const hostname = window.location.hostname;
  if (hostname.endsWith(`.${customBase}`)) {
    return normalizedPath || '/';
  }

  return `https://${studioSlug}.${customBase}${normalizedPath}`;
}

export function buildStudioGalleryUrl(studioSlug: string, clientSlug: string): string {
  return buildStudioBaseUrl(studioSlug, `/gallery/${clientSlug}`);
}
