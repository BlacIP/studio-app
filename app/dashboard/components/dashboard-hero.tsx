import { Button } from '@/components/ui/button';

export function DashboardHero({
  publicUrl,
  onCreateProject,
}: {
  publicUrl: string;
  onCreateProject: () => void;
}) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-sm md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-text-sub-600">Studio overview</p>
        <h1 className="mt-2 text-3xl font-semibold text-text-strong-950">Studio dashboard</h1>
        <p className="mt-2 text-sm text-text-sub-600">
          Recent work, tasks, and inquiries in one calm view.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {publicUrl && (
          <Button asChild variant="outline">
            <a href={publicUrl} target="_blank" rel="noreferrer">
              View public studio
            </a>
          </Button>
        )}
        <Button onClick={onCreateProject}>Create new project</Button>
      </div>
    </section>
  );
}
