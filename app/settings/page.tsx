'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProfilePage from '@/components/profile-page';
import { buildStudioBaseUrl } from '@/lib/studio-url';
import { useSession } from '@/lib/hooks/use-session';
import { useStudio } from '@/lib/hooks/use-studio';
import { LifecyclePanel } from './components/lifecycle-panel';
import { SettingsHero } from './components/settings-hero';
import { SettingsTabs } from './components/settings-tabs';
import { StudioProfileCard } from './components/studio-profile-card';
import { useLifecycleClients } from './hooks/use-lifecycle-clients';
import { useStudioSettingsForm } from './hooks/use-studio-settings';
import type { SettingsTab } from './types';
import { getLifecycleConfig } from './utils';

export default function StudioSettingsPage() {
  const router = useRouter();
  const { data: session, error: sessionError, mutate: mutateSession } = useSession();
  const { data: studio, error: studioError, isValidating } = useStudio();
  const [activeTab, setActiveTab] = useState<SettingsTab>('studio');

  const {
    loading,
    logoUploading,
    logoRemoving,
    message,
    error,
    formState,
    setters,
    handleSave,
    handleRemoveLogo,
    handleLogoUpload,
  } = useStudioSettingsForm({
    studio,
    studioError,
    session,
    sessionError,
    mutateSession,
    router,
  });

  const lifecycleConfig = getLifecycleConfig(activeTab);
  const isLifecycleTab = Boolean(lifecycleConfig);
  const { clients, loadingClients, runCleanup, updateClientStatus } = useLifecycleClients(
    isLifecycleTab
  );
  const filteredClients = lifecycleConfig
    ? clients.filter((client) => client.status === lifecycleConfig.status)
    : [];
  const publicProfileUrl = formState.slug ? buildStudioBaseUrl(formState.slug) : '';

  if (!studio && isValidating) {
    return (
      <div className="px-6 py-10 text-sm text-text-sub-600">Loading studio settings...</div>
    );
  }
  if (!studio) {
    return <div className="px-6 py-10 text-sm text-text-sub-600">Studio not found.</div>;
  }

  return (
    <div className="w-full text-text-strong-950">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <div className="space-y-4">
          <SettingsHero />
          <SettingsTabs activeTab={activeTab} onChange={setActiveTab} />
        </div>

        {activeTab === 'profile' && (
          <div className="animate-in fade-in slide-in-from-left-4 duration-300">
            <ProfilePage />
          </div>
        )}

        {activeTab === 'studio' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <StudioProfileCard
              publicProfileUrl={publicProfileUrl}
              form={formState}
              setters={setters}
              status={{ loading, logoUploading, logoRemoving }}
              message={message}
              error={error}
              onSave={handleSave}
              onLogoUpload={handleLogoUpload}
              onRemoveLogo={handleRemoveLogo}
            />
          </div>
        )}

        {lifecycleConfig && (
          <LifecyclePanel
            config={lifecycleConfig}
            clients={filteredClients}
            loading={loadingClients}
            onRunCleanup={runCleanup}
            onUpdateStatus={updateClientStatus}
          />
        )}
      </div>
    </div>
  );
}
