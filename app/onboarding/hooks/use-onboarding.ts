import { useEffect, useMemo, useRef, useState } from 'react';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { api } from '@/lib/api-client';
import { uploadStudioLogo } from '@/lib/logo-upload';
import type { Studio } from '@/lib/hooks/use-studio';
import type { OnboardingFormState } from '../types';
import { compactRecord } from '../utils';

const initialForm: OnboardingFormState = {
  studioName: '',
  logoUrl: '',
  logoPublicId: '',
  contactEmail: '',
  contactPhone: '',
  address: '',
  instagram: '',
  facebook: '',
  xSocial: '',
  tiktok: '',
};

type OnboardingPayload = {
  name: string;
  logo_url?: string;
  logo_public_id?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  social_links?: Record<string, string>;
};

export function useOnboarding({
  studio,
  studioError,
  router,
}: {
  studio?: Studio | null;
  studioError?: unknown;
  router: AppRouterInstance;
}) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<OnboardingFormState>(initialForm);
  const didInit = useRef(false);

  useEffect(() => {
    if (studioError) {
      router.replace('/login');
      return;
    }
    if (!studio) return;
    if (studio.status === 'ACTIVE') {
      router.replace('/dashboard');
      return;
    }
    if (didInit.current) return;

    setForm((prev) => ({
      ...prev,
      studioName: studio.name && studio.name !== 'Untitled Studio' ? studio.name : '',
      logoUrl: studio.logo_url || '',
      contactEmail: studio.contact_email || '',
      contactPhone: studio.contact_phone || '',
      address: studio.address || '',
      instagram: studio.social_links?.instagram || '',
      facebook: studio.social_links?.facebook || '',
      xSocial: studio.social_links?.x || '',
      tiktok: studio.social_links?.tiktok || '',
    }));
    didInit.current = true;
  }, [router, studio, studioError]);

  const trimmedStudioName = useMemo(() => form.studioName.trim(), [form.studioName]);

  const setField = (field: keyof OnboardingFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setError('');
    if (!trimmedStudioName) {
      setError('Studio name is required.');
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (skipOptional: boolean) => {
    setLoading(true);
    setError('');
    try {
      if (!trimmedStudioName) {
        setError('Studio name is required.');
        setLoading(false);
        return;
      }

      const payload: OnboardingPayload = {
        name: trimmedStudioName,
      };

      if (!skipOptional) {
        if (form.logoUrl.trim()) payload.logo_url = form.logoUrl.trim();
        if (form.logoPublicId.trim()) payload.logo_public_id = form.logoPublicId.trim();
        if (form.contactEmail.trim()) payload.contact_email = form.contactEmail.trim();
        if (form.contactPhone.trim()) payload.contact_phone = form.contactPhone.trim();
        if (form.address.trim()) payload.address = form.address.trim();

        const socialLinks = compactRecord({
          instagram: form.instagram,
          facebook: form.facebook,
          x: form.xSocial,
          tiktok: form.tiktok,
        });
        if (socialLinks) payload.social_links = socialLinks;
      }

      await api.patch('studios/me', payload);
      router.push('/dashboard');
      router.refresh();
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : 'Unable to save onboarding details.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (file: File) => {
    setError('');
    setLogoUploading(true);
    try {
      const result = await uploadStudioLogo(file);
      setForm((prev) => ({
        ...prev,
        logoUrl: result.url,
        logoPublicId: result.publicId,
      }));
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Failed to upload logo.';
      setError(message);
    } finally {
      setLogoUploading(false);
    }
  };

  return {
    step,
    setStep,
    loading,
    logoUploading,
    error,
    form,
    setField,
    handleNext,
    handleSubmit,
    handleLogoUpload,
  };
}
