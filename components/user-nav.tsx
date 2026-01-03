'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RiLogoutBoxLine, RiSettings4Line } from '@remixicon/react';

import { api } from '@/lib/api-client';
import { useSession, clearSessionCache } from '@/lib/hooks/use-session';
import { clearStudioCache } from '@/lib/hooks/use-studio';
import { clearClientsCache } from '@/lib/hooks/use-clients';
import { UserNav as SharedUserNav } from 'photostudio-shared/components/admin/user-nav';

export function UserNav() {
  const router = useRouter();
  const { data: user } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('auth/logout');
      clearSessionCache();
      clearStudioCache();
      clearClientsCache();
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  if (!mounted || !user) return null; // Avoid hydration mismatch

  const displayName = user.displayName || user.name || user.email;
  const initialsSource = displayName || user.email;
  const initials = initialsSource
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <SharedUserNav
      displayName={displayName}
      email={user.email}
      initials={initials}
      items={[
        {
          type: 'link',
          label: 'Studio settings',
          href: '/settings',
          icon: RiSettings4Line,
        },
        { type: 'separator' },
        {
          type: 'action',
          label: 'Sign Out',
          onSelect: handleLogout,
          icon: RiLogoutBoxLine,
          variant: 'danger',
        },
      ]}
    />
  );
}
