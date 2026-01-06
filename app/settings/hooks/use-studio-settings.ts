import { useEffect, useRef, useState } from 'react';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { api } from '@/lib/api-client';
import { uploadStudioLogo } from '@/lib/logo-upload';
import type { Studio } from '@/lib/hooks/use-studio';
import type { SessionUser } from '@/lib/hooks/use-session';
import type { StudioFormSetters, StudioFormState } from '../types';
import { compactRecord } from '../utils';

type StudioPayload = {
  name: string;
  slug?: string;
  logo_url?: string;
  logo_public_id?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  social_links?: Record<string, string>;
  clear_logo?: boolean;
};

export function useStudioSettingsForm({
  studio,
  studioError,
  session,
  sessionError,
  mutateSession,
  router,
}: {
  studio?: Studio | null;
  studioError?: unknown;
  session?: SessionUser | null;
  sessionError?: unknown;
  mutateSession: (data?: SessionUser | null, shouldRevalidate?: boolean) => void;
  router: AppRouterInstance;
}) {
  const [loading, setLoading] = useState(false);
  const didInit = useRef(false);
  const ownerDidInit = useRef(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoPublicId, setLogoPublicId] = useState('');
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoRemoving, setLogoRemoving] = useState(false);
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [address, setAddress] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [xSocial, setXSocial] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    if (studioError) {
      router.replace('/login');
      return;
    }
    if (!studio || didInit.current) return;
    setName(studio.name || '');
    setSlug(studio.slug || '');
    setLogoUrl(studio.logo_url || '');
    setLogoPublicId(studio.logo_public_id || '');
    setContactEmail(studio.contact_email || '');
    setContactPhone(studio.contact_phone || '');
    setAddress(studio.address || '');
    setInstagram(studio.social_links?.instagram || '');
    setFacebook(studio.social_links?.facebook || '');
    setXSocial(studio.social_links?.x || '');
    setTiktok(studio.social_links?.tiktok || '');
    didInit.current = true;
  }, [router, studio, studioError]);
  useEffect(() => {
    if (sessionError) return;
    if (!session || ownerDidInit.current) return;
    setOwnerName(session.displayName || session.name || '');
    ownerDidInit.current = true;
  }, [session, sessionError]);
  const handleSave = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      if (!name.trim()) {
        setError('Studio name is required.');
        setLoading(false);
        return;
      }
      const payload: StudioPayload = {
        name: name.trim(),
        slug: slug.trim() || undefined,
        logo_url: logoUrl.trim() || undefined,
        logo_public_id: logoPublicId.trim() || undefined,
        contact_email: contactEmail.trim() || undefined,
        contact_phone: contactPhone.trim() || undefined,
        address: address.trim() || undefined,
      };

      const socialLinks = compactRecord({
        instagram,
        facebook,
        x: xSocial,
        tiktok,
      });
      if (socialLinks) payload.social_links = socialLinks;
      const trimmedOwnerName = ownerName.trim();
      const currentOwnerName = session?.displayName || session?.name || '';
      if (trimmedOwnerName && trimmedOwnerName !== currentOwnerName) {
        const userResponse = await api.patch('auth/me', { displayName: trimmedOwnerName });
        if (userResponse?.user) {
          mutateSession(userResponse.user, false);
        }
      }
      await api.patch('studios/me', payload);
      setMessage('Studio settings updated.');
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Unable to update settings.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };
  const handleRemoveLogo = async () => {
    if (!logoUrl) return;
    setLogoRemoving(true);
    setError('');
    setMessage('');
    try {
      const payload: StudioPayload = {
        name: name.trim(),
        slug: slug.trim() || undefined,
        clear_logo: true,
      };
      const socialLinks = compactRecord({
        instagram,
        facebook,
        x: xSocial,
        tiktok,
      });
      if (socialLinks) payload.social_links = socialLinks;
      if (contactEmail.trim()) payload.contact_email = contactEmail.trim();
      if (contactPhone.trim()) payload.contact_phone = contactPhone.trim();
      if (address.trim()) payload.address = address.trim();
      await api.patch('studios/me', payload);
      setLogoUrl('');
      setLogoPublicId('');
      setMessage('Logo removed.');
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Unable to remove logo.';
      setError(message);
    } finally {
      setLogoRemoving(false);
    }
  };
  const handleLogoUpload = async (file: File) => {
    setError('');
    setMessage('');
    setLogoUploading(true);
    try {
      const result = await uploadStudioLogo(file);
      setLogoUrl(result.url);
      setLogoPublicId(result.publicId);
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Failed to upload logo.';
      setError(message);
    } finally {
      setLogoUploading(false);
    }
  };
  const formState: StudioFormState = {
    name,
    slug,
    logoUrl,
    logoPublicId,
    contactEmail,
    contactPhone,
    address,
    instagram,
    facebook,
    xSocial,
    tiktok,
    ownerName,
  };
  const setters: StudioFormSetters = {
    setName,
    setSlug,
    setLogoUrl,
    setLogoPublicId,
    setContactEmail,
    setContactPhone,
    setAddress,
    setInstagram,
    setFacebook,
    setXSocial,
    setTiktok,
    setOwnerName,
  };
  return {
    loading,
    logoUploading,
    logoRemoving,
    message,
    error,
    formState,
    setters,
    handleSave,
    handleRemoveLogo,
    handleLogoUpload,
  };
}
