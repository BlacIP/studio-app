'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { RiArrowRightLine, RiImageLine, RiUser3Line } from '@remixicon/react';
import { useClients } from '@/lib/hooks/use-clients';

export default function ClientsPage() {
  const { data: clients, error, isValidating } = useClients();
  const loading = !clients && !error && isValidating;

  if (loading) {
    return <div className="p-8 text-center text-text-sub-600">Loading clients...</div>;
  }

  return (
    <div className="w-full">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-title-h4 font-bold text-text-strong-950">Clients</h2>
          <p className="text-paragraph-sm text-text-sub-600">
            Manage your studio clients and galleries.
          </p>
        </div>
        <Link
          href="/dashboard/clients/new"
          className="rounded-lg bg-primary-base px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          + Create Client
        </Link>
      </div>

      {error ? (
        <div className="rounded-lg border border-error-base/30 bg-error-base/10 px-4 py-3 text-sm text-error-base">
          {error.message || 'Unable to load clients.'}
        </div>
      ) : (clients || []).length === 0 ? (
        <div className="rounded-xl border border-dashed border-stroke-soft-200 bg-bg-white-0 p-12 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-bg-weak-50">
            <RiUser3Line className="text-text-sub-600" />
          </div>
          <h3 className="text-lg font-semibold text-text-strong-950">No clients yet</h3>
          <p className="mt-1 text-sm text-text-sub-600">
            Create your first client gallery to start uploading photos.
          </p>
          <Link
            href="/dashboard/clients/new"
            className="mt-6 inline-block rounded-lg border border-stroke-soft-200 bg-bg-white-0 px-4 py-2 text-sm font-medium text-text-strong-950 hover:bg-bg-weak-50"
          >
            Create Client
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(clients || []).map((client) => {
            const photoCount = Number(client.photo_count || 0);
            return (
              <Link
                key={client.id}
                href={`/dashboard/clients/${client.id}`}
                className="group relative flex flex-col rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-5 transition-all hover:border-primary-base hover:shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-base">
                    <RiUser3Line size={20} />
                  </div>
                  <div className="text-text-sub-600 transition-colors group-hover:text-primary-base">
                    <RiArrowRightLine size={20} />
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="font-semibold text-text-strong-950">{client.name}</h3>
                  <p className="text-sm text-text-sub-600">
                    {client.event_date ? format(new Date(client.event_date), 'PPP') : 'Date not set'}
                  </p>
                  {client.status && (
                    <p className="mt-1 text-xs uppercase tracking-wide text-text-sub-600">
                      {client.status}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-1.5 border-t border-stroke-soft-200 pt-4 text-xs font-medium text-text-sub-600">
                  <RiImageLine size={14} />
                  <span>{photoCount} Photos</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
