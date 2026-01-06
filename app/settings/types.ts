export const settingsTabs = [
  { id: 'studio', label: 'Studio settings' },
  { id: 'profile', label: 'My profile' },
  { id: 'archive', label: 'Archive' },
  { id: 'recycle', label: 'Recycle Bin' },
] as const;

export type SettingsTab = (typeof settingsTabs)[number]['id'];

export type StudioFormState = {
  name: string;
  slug: string;
  logoUrl: string;
  logoPublicId: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  instagram: string;
  facebook: string;
  xSocial: string;
  tiktok: string;
  ownerName: string;
};

export type StudioFormSetters = {
  setName: (value: string) => void;
  setSlug: (value: string) => void;
  setLogoUrl: (value: string) => void;
  setLogoPublicId: (value: string) => void;
  setContactEmail: (value: string) => void;
  setContactPhone: (value: string) => void;
  setAddress: (value: string) => void;
  setInstagram: (value: string) => void;
  setFacebook: (value: string) => void;
  setXSocial: (value: string) => void;
  setTiktok: (value: string) => void;
  setOwnerName: (value: string) => void;
};

export type StudioFormStatus = {
  loading: boolean;
  logoUploading: boolean;
  logoRemoving: boolean;
};

export type LifecycleClient = {
  id: string;
  name: string;
  status: string;
  statusUpdatedAt: string;
};

export type LifecycleConfig = {
  title: string;
  description: string;
  status: string;
  days: number;
};
