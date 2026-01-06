import type { GalleryPhoto } from '@/components/gallery/gallery-types';

export interface GalleryClientData {
  id: string;
  name: string;
  slug: string;
  event_date: string;
  status?: 'ACTIVE' | 'ARCHIVED' | 'DELETED';
  subheading?: string;
  header_media_url?: string;
  header_media_type?: 'image' | 'video';
  photos: GalleryPhoto[];
}

export interface Props {
  params: { slug: string };
}
