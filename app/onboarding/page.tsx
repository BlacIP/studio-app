'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { uploadStudioLogo } from '@/lib/logo-upload';
import { useStudio } from '@/lib/hooks/use-studio';
import SessionGuard from '@/components/session-guard';

const steps = [
  { id: 1, title: 'Studio basics', description: 'Tell us the essentials.' },
  { id: 2, title: 'Contact + branding', description: 'Optional details for your gallery footer.' },
];

function compactRecord(record: Record<string, string>) {
  const entries = Object.entries(record)
    .map(([key, val]) => [key, val.trim()])
    .filter(([, val]) => val.length > 0);
  if (entries.length === 0) return null;
  return Object.fromEntries(entries);
}

export default function OnboardingPage() {
  return (
    <>
      <SessionGuard />
      <OnboardingContent />
    </>
  );
}

function OnboardingContent() {
  const router = useRouter();
  const { data: studio, error: studioError } = useStudio();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [studioName, setStudioName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoPublicId, setLogoPublicId] = useState('');
  const [logoUploading, setLogoUploading] = useState(false);
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [address, setAddress] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [xSocial, setXSocial] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [error, setError] = useState('');
  const trimmedStudioName = studioName.trim();
  const isStepOne = step === 1;
  const isStepTwo = step === 2;
  const currentStep = steps[step - 1];
  const stepProgress = `${step} / ${steps.length}`;

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

    setStudioName(studio.name && studio.name !== 'Untitled Studio' ? studio.name : '');
    setLogoUrl(studio.logo_url || '');
    setContactEmail(studio.contact_email || '');
    setContactPhone(studio.contact_phone || '');
    setAddress(studio.address || '');
    setInstagram(studio.social_links?.instagram || '');
    setFacebook(studio.social_links?.facebook || '');
    setXSocial(studio.social_links?.x || '');
    setTiktok(studio.social_links?.tiktok || '');
  }, [router, studio, studioError]);

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

      const payload: Record<string, any> = {
        name: trimmedStudioName,
      };

      if (!skipOptional) {
        if (logoUrl.trim()) payload.logo_url = logoUrl.trim();
        if (logoPublicId.trim()) payload.logo_public_id = logoPublicId.trim();
        if (contactEmail.trim()) payload.contact_email = contactEmail.trim();
        if (contactPhone.trim()) payload.contact_phone = contactPhone.trim();
        if (address.trim()) payload.address = address.trim();

        const socialLinks = compactRecord({
          instagram,
          facebook,
          x: xSocial,
          tiktok,
        });
        if (socialLinks) payload.social_links = socialLinks;
      }

      await api.patch('studios/me', payload);
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Unable to save onboarding details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/50 flex items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl gap-8 md:grid-cols-[1.1fr_0.9fr] items-start">
        <Card className="shadow-xl border border-border/80">
          <CardHeader className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Onboarding</p>
            <CardTitle className="text-2xl">Set up your studio space</CardTitle>
            <CardDescription>
              Fill in your studio details now, or skip optional fields and update later in settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{currentStep.title}</span>
              <span>{stepProgress}</span>
            </div>

            {isStepOne && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="studioName">Studio name</Label>
                  <Input
                    id="studioName"
                    value={studioName}
                    onChange={(e) => setStudioName(e.target.value)}
                    placeholder="Lumiere Portraits"
                    required
                  />
                </div>
              </div>
            )}

            {isStepTwo && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="logoUpload">Studio logo (PNG)</Label>
                  <Input
                    id="logoUpload"
                    type="file"
                    accept="image/png"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setError('');
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
                    <p className="text-xs text-muted-foreground">Uploading logo...</p>
                  )}
                  {logoUrl && !logoUploading && (
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={logoUrl} alt="Studio logo preview" className="h-10 w-10 rounded-full object-cover" />
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
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="studio@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact phone</Label>
                    <Input
                      id="contactPhone"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+234..."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Studio address</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="City, Country"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      value={facebook}
                      onChange={(e) => setFacebook(e.target.value)}
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="xSocial">X (Twitter)</Label>
                    <Input
                      id="xSocial"
                      value={xSocial}
                      onChange={(e) => setXSocial(e.target.value)}
                      placeholder="https://x.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tiktok">TikTok</Label>
                    <Input
                      id="tiktok"
                      value={tiktok}
                      onChange={(e) => setTiktok(e.target.value)}
                      placeholder="https://tiktok.com/@..."
                    />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3">
              {isStepOne ? (
                <Button type="button" onClick={handleNext}>
                  Continue
                </Button>
              ) : (
                <div className="flex flex-wrap gap-3">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="button" variant="outline" onClick={() => handleSubmit(true)} disabled={loading}>
                    Skip for now
                  </Button>
                  <Button type="button" onClick={() => handleSubmit(false)} disabled={loading}>
                    {loading ? 'Saving…' : 'Finish onboarding'}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="hidden md:flex flex-col gap-4 rounded-2xl border border-border/80 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 text-sm text-muted-foreground">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Public Gallery</p>
            <h3 className="text-xl font-semibold text-foreground">Your branding shows up instantly.</h3>
            <p>
              The studio name and logo appear on every client gallery. Contact details and socials show in the
              footer so clients can reach you quickly.
            </p>
          </div>
          <div className="space-y-2">
            {steps.map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${step >= item.id ? 'bg-primary' : 'bg-muted-foreground/40'}`}
                />
                <span>{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
