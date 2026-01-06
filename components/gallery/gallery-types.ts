export interface GalleryPhoto {
  id: string;
  url: string;
  public_id?: string;
  filename: string;
  width?: number;
  height?: number;
}

export interface LightboxState {
  url: string;
  filename: string;
}
