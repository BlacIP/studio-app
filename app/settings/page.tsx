'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { uploadStudioLogo } from '@/lib/logo-upload';
import { buildStudioBaseUrl } from '@/lib/studio-url';

type StudioResponse = {
  name: string | null;
  slug: string | null;
  status: string;
  logo_url?: string | null;
  logo_public_id?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  address?: string | null;
  social_links?: Record<string, string> | null;
};

function compactRecord(record: Record<string, string>) {
  const entries = Object.entries(record)
    .map(([key, val]) => [key, val.trim()])
    .filter(([, val]) => val.length > 0);
  if (entries.length === 0) return null;
  return Object.fromEntries(entries);
}

export default function StudioSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
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
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const studio = (await api.get('studios/me')) as StudioResponse;
        if (cancelled) return;
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
        setReady(true);
      } catch (err) {
        console.error(err);
        router.replace('/login');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

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

      const payload: Record<string, any> = {
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

      await api.patch('studios/me', payload);
      setMessage('Studio settings updated.');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Unable to update settings.');
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
      const payload: Record<string, any> = {
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
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Unable to remove logo.');
    } finally {
      setLogoRemoving(false);
    }
  };

  if (!ready) {
    return (
      <div className="px-6 py-10 text-sm text-text-sub-600">
        Loading studio settings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-weak-50 px-6 py-10 text-text-strong-950">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <Card className="border border-stroke-soft-200 shadow-sm">
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <CardTitle className="text-2xl">Studio settings</CardTitle>
              <CardDescription>
                Update your branding and contact details. Changes appear on public galleries.
              </CardDescription>
            </div>
            {slug && (
              <Button variant="outline" asChild>
                <a href={buildStudioBaseUrl(slug)} target="_blank" rel="noreferrer">
                  View public profile
                </a>
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Studio name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Studio slug</Label>
                <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
                <p className="text-xs text-text-sub-600">
                  Changing the slug updates your public URL.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="logoUpload">Logo upload (PNG)</Label>
              <Input
                id="logoUpload"
                type="file"
                accept="image/png"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setError('');
                  setMessage('');
                  setLogoUploading(true);
                  try {
                    const result = await uploadStudioLogo(file);
                    setLogoUrl(result.url);
                    setLogoPublicId(result.publicId);
                  } catch (err: any) {
                    console.error(err);
                    setError(err.message || 'Failed to upload logo.');
                  } finally {
                    setLogoUploading(false);
                  }
                }}
              />
              {logoUploading && (
                <p className="text-xs text-text-sub-600">Uploading logo...</p>
              )}
              {logoUrl && (
                <div className="flex flex-wrap items-center gap-3 text-xs text-text-sub-600">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logoUrl} alt="Studio logo preview" className="h-10 w-10 rounded-full object-cover" />
                  <span>Logo uploaded. Save changes to apply it.</span>
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    disabled={logoRemoving}
                    className="text-xs font-medium text-error-base hover:underline disabled:opacity-60"
                  >
                    {logoRemoving ? 'Removing...' : 'Remove logo'}
                  </button>
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact phone</Label>
                <Input
                  id="contactPhone"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Studio address</Label>
              <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input id="instagram" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input id="facebook" value={facebook} onChange={(e) => setFacebook(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="xSocial">X (Twitter)</Label>
                <Input id="xSocial" value={xSocial} onChange={(e) => setXSocial(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tiktok">TikTok</Label>
                <Input id="tiktok" value={tiktok} onChange={(e) => setTiktok(e.target.value)} />
              </div>
            </div>

            {message && (
              <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {message}
              </div>
            )}
            {error && (
              <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="button" onClick={handleSave} disabled={loading}>
              {loading ? 'Saving…' : 'Save changes'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
