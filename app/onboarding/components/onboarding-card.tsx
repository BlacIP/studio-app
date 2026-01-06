import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { OnboardingFormState, OnboardingStep } from '../types';
import { StepOneFields } from './step-one-fields';
import { StepTwoFields } from './step-two-fields';

export function OnboardingCard({
  step,
  steps,
  form,
  error,
  loading,
  logoUploading,
  onFieldChange,
  onLogoUpload,
  onNext,
  onBack,
  onSubmit,
}: {
  step: number;
  steps: OnboardingStep[];
  form: OnboardingFormState;
  error: string;
  loading: boolean;
  logoUploading: boolean;
  onFieldChange: (field: keyof OnboardingFormState, value: string) => void;
  onLogoUpload: (file: File) => void;
  onNext: () => void;
  onBack: () => void;
  onSubmit: (skipOptional: boolean) => void;
}) {
  const isStepOne = step === 1;
  const currentStep = steps[step - 1];
  const stepProgress = `${step} / ${steps.length}`;

  return (
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

        {isStepOne ? (
          <StepOneFields
            studioName={form.studioName}
            onStudioNameChange={(value) => onFieldChange('studioName', value)}
          />
        ) : (
          <StepTwoFields
            form={form}
            logoUploading={logoUploading}
            onLogoUpload={onLogoUpload}
            onFieldChange={onFieldChange}
          />
        )}

        {error && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          {isStepOne ? (
            <Button type="button" onClick={onNext}>
              Continue
            </Button>
          ) : (
            <div className="flex flex-wrap gap-3">
              <Button type="button" variant="outline" onClick={onBack}>
                Back
              </Button>
              <Button type="button" variant="outline" onClick={() => onSubmit(true)} disabled={loading}>
                Skip for now
              </Button>
              <Button type="button" onClick={() => onSubmit(false)} disabled={loading}>
                {loading ? 'Saving…' : 'Finish onboarding'}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
