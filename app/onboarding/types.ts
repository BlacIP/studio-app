export const steps = [
  { id: 1, title: 'Studio basics', description: 'Tell us the essentials.' },
  { id: 2, title: 'Contact + branding', description: 'Optional details for your gallery footer.' },
] as const;

export type OnboardingStep = (typeof steps)[number];

export type OnboardingFormState = {
  studioName: string;
  logoUrl: string;
  logoPublicId: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  instagram: string;
  facebook: string;
  xSocial: string;
  tiktok: string;
};
