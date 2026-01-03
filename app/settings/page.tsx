'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RiRefreshLine } from '@remixicon/react';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { uploadStudioLogo } from '@/lib/logo-upload';
import { buildStudioBaseUrl } from '@/lib/studio-url';
import { useStudio } from '@/lib/hooks/use-studio';
import { useSession } from '@/lib/hooks/use-session';
import ProfilePage from '@/components/profile-page';

function compactRecord(record: Record<string, string>) {
  const entries = Object.entries(record)
    .map(([key, val]) => [key, val.trim()])
    .filter(([, val]) => val.length > 0);
  if (entries.length === 0) return null;
  return Object.fromEntries(entries);
}

export default function StudioSettingsPage() {
  const router = useRouter();
  const { data: session, error: sessionError, mutate: mutateSession } = useSession();
  const { data: studio, error: studioError, isValidating } = useStudio();
  const [loading, setLoading] = useState(false);
  const didInit = useRef(false);
  const ownerDidInit = useRef(false);
  const [activeTab, setActiveTab] = useState<'studio' | 'profile' | 'archive' | 'recycle'>('studio');
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
  const [clients, setClients] = useState<any[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);

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

  useEffect(() => {
    if (activeTab === 'archive' || activeTab === 'recycle') {
      fetchClients();
    }
  }, [activeTab]);

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

  const calculateDaysLeft = (dateString: string, maxDays: number) => {
    const updated = new Date(dateString).getTime();
    const now = new Date().getTime();
    const diffDays = (now - updated) / (1000 * 3600 * 24);
    return Math.max(0, Math.ceil(maxDays - diffDays));
  };

  const fetchClients = async () => {
    setLoadingClients(true);
    try {
      const data = await api.get('admin/legacy/clients');
      setClients(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingClients(false);
    }
  };

  const runCleanup = async () => {
    if (
      !confirm(
        'This will permanently delete items in Recycle Bin older than 7 days and move Archive items older than 30 days to Recycle Bin. Continue?'
      )
    )
      return;
    try {
      // TODO: Implement lifecycle endpoint in backend
      // await api.post('admin/lifecycle/cleanup');
      // fetchClients();
    } catch (e) {
      console.error(e);
    }
  };

  const updateClientStatus = async (id: string, status: string) => {
    if (status === 'DELETED_FOREVER') {
      if (
        !confirm(
          'Are you sure you want to permanently delete this client and all photos? This cannot be undone.'
        )
      )
        return;
      try {
        await api.delete(`admin/legacy/clients/${id}`);
        fetchClients();
      } catch (e) {
        console.error(e);
      }
      return;
    }

    try {
      await api.put(`admin/legacy/clients/${id}`, { status });
      fetchClients();
    } catch (e) {
      console.error(e);
    }
  };

  if (!studio && isValidating) {
    return (
      <div className="px-6 py-10 text-sm text-text-sub-600">
        Loading studio settings...
      </div>
    );
  }
  if (!studio) {
    return <div className="px-6 py-10 text-sm text-text-sub-600">Studio not found.</div>;
  }

  return (
    <div className="w-full text-text-strong-950">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <div className="space-y-4">
          <div className="rounded-2xl border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-text-sub-600">Settings</p>
            <h1 className="mt-2 text-title-h4 font-bold text-text-strong-950">Account settings</h1>
            <p className="mt-2 text-sm text-text-sub-600">
              Manage your personal profile and studio details from one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 rounded-full bg-bg-weak-50 p-1 w-full sm:w-fit">
            <button
              onClick={() => setActiveTab('studio')}
              className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-full transition-colors ${activeTab === 'studio'
                ? 'bg-bg-white-0 text-text-strong-950 shadow-sm ring-1 ring-stroke-soft-200'
                : 'text-text-sub-600 hover:text-text-strong-950'
                }`}
            >
              Studio settings
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-full transition-colors ${activeTab === 'profile'
                ? 'bg-bg-white-0 text-text-strong-950 shadow-sm ring-1 ring-stroke-soft-200'
                : 'text-text-sub-600 hover:text-text-strong-950'
                }`}
            >
              My profile
            </button>
            <button
              onClick={() => setActiveTab('archive')}
              className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-full transition-colors ${activeTab === 'archive'
                ? 'bg-bg-white-0 text-text-strong-950 shadow-sm ring-1 ring-stroke-soft-200'
                : 'text-text-sub-600 hover:text-text-strong-950'
                }`}
            >
              Archive
            </button>
            <button
              onClick={() => setActiveTab('recycle')}
              className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-full transition-colors ${activeTab === 'recycle'
                ? 'bg-bg-white-0 text-text-strong-950 shadow-sm ring-1 ring-stroke-soft-200'
                : 'text-text-sub-600 hover:text-text-strong-950'
                }`}
            >
              Recycle Bin
            </button>
          </div>
        </div>

        {activeTab === 'profile' && (
          <div className="animate-in fade-in slide-in-from-left-4 duration-300">
            <ProfilePage />
          </div>
        )}

        {activeTab === 'studio' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <Card className="border border-stroke-soft-200 bg-bg-white-0 shadow-sm">
              <CardHeader className="flex flex-col gap-3 border-b border-stroke-soft-200 px-6 py-5 md:flex-row md:items-start md:justify-between">
                <div>
                  <CardTitle className="text-xl">Studio profile</CardTitle>
                  <CardDescription className="text-sm text-text-sub-600">
                    Keep your studio details current across every gallery page.
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
              <CardContent className="space-y-6 px-6 pb-6 pt-5">
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

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Owner name</Label>
                    <Input
                      id="ownerName"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="Studio owner name"
                    />
                    <p className="text-xs text-text-sub-600">
                      This is shown in your account menu and admin records.
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
                  <div className="rounded-lg border border-success-base/30 bg-success-base/10 px-3 py-2 text-sm text-success-base">
                    {message}
                  </div>
                )}
                {error && (
                  <div className="rounded-lg border border-error-base/30 bg-error-base/10 px-3 py-2 text-sm text-error-base">
                    {error}
                  </div>
                )}

                <Button type="button" onClick={handleSave} disabled={loading}>
                  {loading ? 'Saving…' : 'Save changes'}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {(activeTab === 'archive' || activeTab === 'recycle') && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="rounded-2xl border border-stroke-soft-200 bg-bg-white-0 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stroke-soft-200 px-6 py-4">
                <div>
                  <h2 className="text-lg font-semibold text-text-strong-950">
                    {activeTab === 'archive' ? 'Archive' : 'Recycle Bin'}
                  </h2>
                  <p className="mt-1 text-sm text-text-sub-600">
                    {activeTab === 'archive'
                      ? 'Clients in Archive are kept for 30 days before moving to Recycle Bin.'
                      : 'Clients in Recycle Bin are kept for 7 days before permanent deletion.'}
                  </p>
                </div>
                <button
                  onClick={runCleanup}
                  className="flex items-center gap-2 rounded-full border border-stroke-soft-200 bg-bg-weak-50 px-4 py-2 text-sm text-text-sub-600 hover:text-text-strong-950"
                >
                  <RiRefreshLine size={16} /> Run Lifecycle Cleanup
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[700px]">
                  <thead className="bg-bg-weak-50/70 text-text-sub-600">
                    <tr>
                      <th className="px-6 py-3 font-medium">Client</th>
                      <th className="px-6 py-3 font-medium">Status Updated</th>
                      <th className="px-6 py-3 font-medium">Auto-Move In</th>
                      <th className="px-6 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stroke-soft-200">
                    {loadingClients && (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-text-sub-600">
                          Loading clients...
                        </td>
                      </tr>
                    )}
                    {!loadingClients &&
                      clients
                        .filter(
                          (client) =>
                            client.status === (activeTab === 'archive' ? 'ARCHIVED' : 'DELETED')
                        )
                        .map((client) => (
                          <tr key={client.id}>
                            <td className="px-6 py-3 font-medium text-text-strong-950">{client.name}</td>
                            <td className="px-6 py-3 text-text-sub-600">
                              {new Date(client.statusUpdatedAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-3 text-text-sub-600">
                              {calculateDaysLeft(
                                client.statusUpdatedAt,
                                activeTab === 'archive' ? 30 : 7
                              )}{' '}
                              Days
                            </td>
                            <td className="px-6 py-3 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => updateClientStatus(client.id, 'ACTIVE')}
                                  className="rounded-full border border-stroke-soft-200 bg-bg-weak-50 px-3 py-1.5 text-xs font-semibold text-text-strong-950 hover:bg-bg-weak-100"
                                >
                                  Restore
                                </button>
                                {activeTab === 'archive' ? (
                                  <button
                                    onClick={() => updateClientStatus(client.id, 'DELETED')}
                                    className="rounded-full px-3 py-1.5 text-xs font-semibold text-error-base hover:bg-error-weak/10"
                                  >
                                    Move to Bin
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => updateClientStatus(client.id, 'DELETED_FOREVER')}
                                    className="rounded-full px-3 py-1.5 text-xs font-semibold text-error-base hover:bg-error-weak/10"
                                  >
                                    Delete Forever
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                    {!loadingClients &&
                      clients.filter(
                        (client) =>
                          client.status === (activeTab === 'archive' ? 'ARCHIVED' : 'DELETED')
                      ).length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-text-sub-600">
                            No clients in {activeTab === 'archive' ? 'Archive' : 'Recycle Bin'}.
                          </td>
                        </tr>
                      )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
