import { cn } from '@/utils/cn';
import { settingsTabs, type SettingsTab } from '../types';

export function SettingsTabs({
  activeTab,
  onChange,
}: {
  activeTab: SettingsTab;
  onChange: (tab: SettingsTab) => void;
}) {
  const baseClass = 'flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-full transition-colors';
  const tabClass = (tab: SettingsTab) =>
    cn(
      baseClass,
      activeTab === tab
        ? 'bg-bg-white-0 text-text-strong-950 shadow-sm ring-1 ring-stroke-soft-200'
        : 'text-text-sub-600 hover:text-text-strong-950'
    );

  return (
    <div className="flex flex-wrap gap-2 rounded-full bg-bg-weak-50 p-1 w-full sm:w-fit">
      {settingsTabs.map((tab) => (
        <button key={tab.id} onClick={() => onChange(tab.id)} className={tabClass(tab.id)}>
          {tab.label}
        </button>
      ))}
    </div>
  );
}
