import type { LifecycleConfig, SettingsTab } from './types';

export function compactRecord(record: Record<string, string>) {
  const entries = Object.entries(record)
    .map(([key, val]) => [key, val.trim()])
    .filter(([, val]) => val.length > 0);
  if (entries.length === 0) return null;
  return Object.fromEntries(entries);
}

const lifecycleConfigMap: Record<'archive' | 'recycle', LifecycleConfig> = {
  archive: {
    title: 'Archive',
    description: 'Clients in Archive are kept for 30 days before moving to Recycle Bin.',
    status: 'ARCHIVED',
    days: 30,
  },
  recycle: {
    title: 'Recycle Bin',
    description: 'Clients in Recycle Bin are kept for 7 days before permanent deletion.',
    status: 'DELETED',
    days: 7,
  },
};

export function getLifecycleConfig(tab: SettingsTab): LifecycleConfig | null {
  if (tab === 'archive') return lifecycleConfigMap.archive;
  if (tab === 'recycle') return lifecycleConfigMap.recycle;
  return null;
}

export function calculateDaysLeft(dateString: string, maxDays: number) {
  const updated = new Date(dateString).getTime();
  const now = new Date().getTime();
  const diffDays = (now - updated) / (1000 * 3600 * 24);
  return Math.max(0, Math.ceil(maxDays - diffDays));
}
