'use client';

import { useRouter } from 'next/navigation';
import SessionGuard from '@/components/session-guard';
import { useStudio } from '@/lib/hooks/use-studio';
import { OnboardingAside } from './components/onboarding-aside';
import { OnboardingCard } from './components/onboarding-card';
import { useOnboarding } from './hooks/use-onboarding';
import { steps } from './types';

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
  const {
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
  } = useOnboarding({ studio, studioError, router });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/50 flex items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl gap-8 md:grid-cols-[1.1fr_0.9fr] items-start">
        <OnboardingCard
          step={step}
          steps={steps}
          form={form}
          error={error}
          loading={loading}
          logoUploading={logoUploading}
          onFieldChange={setField}
          onLogoUpload={handleLogoUpload}
          onNext={handleNext}
          onBack={() => setStep(1)}
          onSubmit={handleSubmit}
        />
        <OnboardingAside step={step} steps={steps} />
      </div>
    </div>
  );
}
