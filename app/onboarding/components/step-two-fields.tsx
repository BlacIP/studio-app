import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { OnboardingFormState } from '../types';

export function StepTwoFields({
  form,
  logoUploading,
  onLogoUpload,
  onFieldChange,
}: {
  form: OnboardingFormState;
  logoUploading: boolean;
  onLogoUpload: (file: File) => void;
  onFieldChange: (field: keyof OnboardingFormState, value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="logoUpload">Studio logo (PNG)</Label>
        <Input
          id="logoUpload"
          type="file"
          accept="image/png"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onLogoUpload(file);
          }}
        />
        {logoUploading && (
          <p className="text-xs text-muted-foreground">Uploading logo...</p>
        )}
        {form.logoUrl && !logoUploading && (
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Image
              src={form.logoUrl}
              alt="Studio logo preview"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
            <span>Logo ready to save.</span>
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
            onChange={(e) => onFieldChange('contactEmail', e.target.value)}
            placeholder="studio@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactPhone">Contact phone</Label>
          <Input
            id="contactPhone"
            value={form.contactPhone}
            onChange={(e) => onFieldChange('contactPhone', e.target.value)}
            placeholder="+234..."
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Studio address</Label>
        <Input
          id="address"
          value={form.address}
          onChange={(e) => onFieldChange('address', e.target.value)}
          placeholder="City, Country"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="instagram">Instagram</Label>
          <Input
            id="instagram"
            value={form.instagram}
            onChange={(e) => onFieldChange('instagram', e.target.value)}
            placeholder="https://instagram.com/..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="facebook">Facebook</Label>
          <Input
            id="facebook"
            value={form.facebook}
            onChange={(e) => onFieldChange('facebook', e.target.value)}
            placeholder="https://facebook.com/..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="xSocial">X (Twitter)</Label>
          <Input
            id="xSocial"
            value={form.xSocial}
            onChange={(e) => onFieldChange('xSocial', e.target.value)}
            placeholder="https://x.com/..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tiktok">TikTok</Label>
          <Input
            id="tiktok"
            value={form.tiktok}
            onChange={(e) => onFieldChange('tiktok', e.target.value)}
            placeholder="https://tiktok.com/@..."
          />
        </div>
      </div>
    </div>
  );
}
