import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SectionHeader } from '@/components/ui/section-header';

export function InquiryList({
  inquiries,
  onViewInbox,
}: {
  inquiries: Array<{ id: string; name: string; type: string; received: string }>;
  onViewInbox: () => void;
}) {
  return (
    <Card className="rounded-2xl border-stroke-soft-200 bg-bg-white-0 p-5 shadow-sm">
      <SectionHeader
        title="Client inquiries"
        description="Stay responsive with fresh leads."
        action={
          <Button variant="ghost" onClick={onViewInbox}>
            View inbox
          </Button>
        }
      />
      <div className="mt-4 space-y-3">
        {inquiries.map((inquiry) => (
          <div
            key={inquiry.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stroke-soft-200 bg-bg-weak-50/60 px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-text-strong-950">{inquiry.name}</p>
              <p className="text-xs text-text-sub-600">
                {inquiry.type} · {inquiry.received}
              </p>
            </div>
            <Button size="sm">Respond</Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
