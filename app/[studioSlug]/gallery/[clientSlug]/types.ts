export interface Props {
  params: { studioSlug: string; clientSlug: string };
}

export interface Photo {
  id: string;
  url: string;
  public_id?: string;
  filename: string;
}

export interface StudioInfo {
  name?: string | null;
  slug?: string | null;
  logo_url?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  address?: string | null;
  social_links?: Record<string, string> | null;
}

export interface Client {
  id: string;
  name: string;
  slug: string;
  event_date: string;
  status?: 'ACTIVE' | 'ARCHIVED' | 'DELETED';
  subheading?: string;
  header_media_url?: string;
  header_media_type?: 'image' | 'video';
  studio_slug?: string | null;
  studio?: StudioInfo;
  photos: Photo[];
}
