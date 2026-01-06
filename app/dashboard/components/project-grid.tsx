import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SectionHeader } from '@/components/ui/section-header';
import * as StatusBadge from '@/components/ui/status-badge';
import * as ProgressBar from '@/components/ui/progress-bar';

export function ProjectGrid({
  projects,
  onViewAll,
}: {
  projects: Array<{
    id: string;
    title: string;
    location: string;
    status: string;
    progress: number;
    accent: string;
  }>;
  onViewAll: () => void;
}) {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Recent"
        title="In-progress projects"
        description="Your most active projects, ready for the next move."
        action={
          <Button variant="ghost" onClick={onViewAll}>
            View all
          </Button>
        }
      />
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="group overflow-hidden rounded-2xl border-stroke-soft-200 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="relative">
              <div className={`aspect-[4/3] w-full bg-gradient-to-br ${project.accent}`} />
              <div className="absolute left-4 top-4">
                <StatusBadge.Root variant="stroke" status="pending">
                  <StatusBadge.Dot />
                  <span className="text-xs font-medium text-text-sub-600">{project.status}</span>
                </StatusBadge.Root>
              </div>
            </div>
            <div className="space-y-4 px-5 pb-5 pt-4">
              <div>
                <h3 className="text-lg font-semibold text-text-strong-950">{project.title}</h3>
                <p className="text-sm text-text-sub-600">{project.location}</p>
              </div>
              <ProgressBar.Root value={project.progress} max={100} />
              <div className="flex items-center justify-between text-xs text-text-sub-600">
                <span>{project.progress}% complete</span>
                <Button variant="ghost" size="sm">
                  Open
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
