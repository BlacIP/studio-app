'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { RiArrowRightLine, RiImageLine, RiUser3Line } from '@remixicon/react';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/ui/section-header';
import { useClients } from '@/lib/hooks/use-clients';

export default function ClientsPage() {
  const { data: clients, error, isValidating } = useClients();
  const loading = !clients && !error && isValidating;
  const clientList = clients || [];
  const hasClients = clientList.length > 0;
  const errorMessage = error?.message || 'Unable to load clients.';

  if (loading) {
    return <div className="p-8 text-center text-text-sub-600">Loading clients...</div>;
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <SectionHeader
          title="Clients"
          description="Manage your studio clients and galleries."
          action={(
            <Button asChild>
              <Link href="/dashboard/clients/new">Create Client</Link>
            </Button>
          )}
        />
      </div>

      {error && (
        <div className="rounded-lg border border-error-base/30 bg-error-base/10 px-4 py-3 text-sm text-error-base">
          {errorMessage}
        </div>
      )}
      {!error && !hasClients && (
        <div className="rounded-2xl border border-dashed border-stroke-soft-200 bg-bg-white-0 p-12 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-bg-weak-50 text-text-sub-600">
            <RiUser3Line />
          </div>
          <h3 className="text-lg font-semibold text-text-strong-950">No clients yet</h3>
          <p className="mt-1 text-sm text-text-sub-600">
            Create your first client gallery to start uploading photos.
          </p>
          <Button asChild variant="outline" className="mt-6">
            <Link href="/dashboard/clients/new">Create Client</Link>
          </Button>
        </div>
      )}
      {!error && hasClients && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clientList.map((client) => {
            const photoCount = Number(client.photo_count || 0);
            return (
              <Link
                key={client.id}
                href={`/dashboard/clients/${client.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stroke-soft-200 bg-bg-white-0 shadow-sm transition hover:-translate-y-0.5 hover:border-primary-base hover:shadow-md"
              >
                <div className="relative h-24 bg-gradient-to-br from-primary-alpha-16 via-bg-weak-50 to-bg-white-0">
                  <div className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-bg-white-0/90 text-primary-base shadow-sm">
                    <RiUser3Line size={18} />
                  </div>
                  <div className="absolute right-4 top-4 text-text-sub-600 transition-colors group-hover:text-primary-base">
                    <RiArrowRightLine size={18} />
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-4 p-5">
                  <div>
                    <h3 className="text-lg font-semibold text-text-strong-950">{client.name}</h3>
                    <p className="text-sm text-text-sub-600">
                      {client.event_date ? format(new Date(client.event_date), 'PPP') : 'Date not set'}
                    </p>
                    {client.status && (
                      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-text-sub-600">
                        {client.status}
                      </p>
                    )}
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-stroke-soft-200 pt-4 text-xs font-medium text-text-sub-600">
                    <span className="flex items-center gap-1.5">
                      <RiImageLine size={14} />
                      {photoCount} Photos
                    </span>
                    <span className="flex items-center gap-1 text-primary-base">
                      View
                      <RiArrowRightLine size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
