import type { OnboardingStep } from '../types';

export function OnboardingAside({
  step,
  steps,
}: {
  step: number;
  steps: OnboardingStep[];
}) {
  return (
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
  );
}
