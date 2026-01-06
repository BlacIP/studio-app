import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SectionHeader } from '@/components/ui/section-header';

export function TaskList({
  tasks,
  onViewAll,
}: {
  tasks: Array<{ id: string; title: string; due: string }>;
  onViewAll: () => void;
}) {
  return (
    <Card className="rounded-2xl border-stroke-soft-200 bg-bg-white-0 p-5 shadow-sm">
      <SectionHeader
        title="Priority tasks"
        description="Focus on what moves today forward."
        action={
          <Button variant="ghost" onClick={onViewAll}>
            View all
          </Button>
        }
      />
      <div className="mt-4 space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between rounded-xl border border-stroke-soft-200 bg-bg-weak-50/60 px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-text-strong-950">{task.title}</p>
              <p className="text-xs text-text-sub-600">Due {task.due}</p>
            </div>
            <Button size="sm" variant="outline">
              Done
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
