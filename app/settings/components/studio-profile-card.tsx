import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { StudioFormSetters, StudioFormState, StudioFormStatus } from '../types';

export function StudioProfileCard({
  publicProfileUrl,
  form,
  setters,
  status,
  message,
  error,
  onSave,
  onLogoUpload,
  onRemoveLogo,
}: {
  publicProfileUrl: string;
  form: StudioFormState;
  setters: StudioFormSetters;
  status: StudioFormStatus;
  message: string;
  error: string;
  onSave: () => void;
  onLogoUpload: (file: File) => void;
  onRemoveLogo: () => void;
}) {
  return (
    <Card className="border border-stroke-soft-200 bg-bg-white-0 shadow-sm">
      <CardHeader className="flex flex-col gap-3 border-b border-stroke-soft-200 px-6 py-5 md:flex-row md:items-start md:justify-between">
        <div>
          <CardTitle className="text-xl">Studio profile</CardTitle>
          <CardDescription className="text-sm text-text-sub-600">
            Keep your studio details current across every gallery page.
          </CardDescription>
        </div>
        {publicProfileUrl && (
          <Button variant="outline" asChild>
            <a href={publicProfileUrl} target="_blank" rel="noreferrer">
              View public profile
            </a>
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6 px-6 pb-6 pt-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Studio name</Label>
            <Input id="name" value={form.name} onChange={(e) => setters.setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Studio slug</Label>
            <Input id="slug" value={form.slug} onChange={(e) => setters.setSlug(e.target.value)} />
            <p className="text-xs text-text-sub-600">Changing the slug updates your public URL.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="ownerName">Owner name</Label>
            <Input
              id="ownerName"
              value={form.ownerName}
              onChange={(e) => setters.setOwnerName(e.target.value)}
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
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onLogoUpload(file);
            }}
          />
          {status.logoUploading && (
            <p className="text-xs text-text-sub-600">Uploading logo...</p>
          )}
          {form.logoUrl && (
            <div className="flex flex-wrap items-center gap-3 text-xs text-text-sub-600">
              <Image
                src={form.logoUrl}
                alt="Studio logo preview"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
              />
              <span>Logo uploaded. Save changes to apply it.</span>
              <button
                type="button"
                onClick={onRemoveLogo}
                disabled={status.logoRemoving}
                className="text-xs font-medium text-error-base hover:underline disabled:opacity-60"
              >
                {status.logoRemoving ? 'Removing...' : 'Remove logo'}
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
              value={form.contactEmail}
              onChange={(e) => setters.setContactEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactPhone">Contact phone</Label>
            <Input
              id="contactPhone"
              value={form.contactPhone}
              onChange={(e) => setters.setContactPhone(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Studio address</Label>
          <Input
            id="address"
            value={form.address}
            onChange={(e) => setters.setAddress(e.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              value={form.instagram}
              onChange={(e) => setters.setInstagram(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              value={form.facebook}
              onChange={(e) => setters.setFacebook(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="xSocial">X (Twitter)</Label>
            <Input
              id="xSocial"
              value={form.xSocial}
              onChange={(e) => setters.setXSocial(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tiktok">TikTok</Label>
            <Input
              id="tiktok"
              value={form.tiktok}
              onChange={(e) => setters.setTiktok(e.target.value)}
            />
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

        <Button type="button" onClick={onSave} disabled={status.loading}>
          {status.loading ? 'Saving…' : 'Save changes'}
        </Button>
      </CardContent>
    </Card>
  );
}
