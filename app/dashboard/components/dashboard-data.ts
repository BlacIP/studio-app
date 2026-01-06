export const projectSamples = [
  {
    id: 'p-1',
    title: 'Modern Love Session',
    location: 'Brooklyn, NY',
    status: 'In progress',
    progress: 72,
    accent: 'from-[#d1c5b3] via-[#e6dfd4] to-[#f3f1ec]',
  },
  {
    id: 'p-2',
    title: 'City Editorial',
    location: 'SoHo Loft',
    status: 'Review',
    progress: 48,
    accent: 'from-[#cfd6df] via-[#e1e6ec] to-[#f3f6f9]',
  },
  {
    id: 'p-3',
    title: 'Golden Hour Portraits',
    location: 'Santa Monica',
    status: 'Uploading',
    progress: 86,
    accent: 'from-[#e4c9b4] via-[#f2ddd0] to-[#fbf6f1]',
  },
] as const;

export const taskSamples = [
  {
    id: 't-1',
    title: 'Select hero images for City Editorial',
    due: 'Today',
  },
  {
    id: 't-2',
    title: 'Send contract to Harper + Luca',
    due: 'Tomorrow',
  },
  {
    id: 't-3',
    title: 'Finalize edits for Golden Hour set',
    due: 'Fri',
  },
] as const;

export const inquirySamples = [
  {
    id: 'c-1',
    name: 'Arianna Summers',
    type: 'Couples session',
    status: 'New',
    received: '2h ago',
  },
  {
    id: 'c-2',
    name: 'Mason Ward',
    type: 'Brand shoot',
    status: 'Waiting',
    received: 'Yesterday',
  },
  {
    id: 'c-3',
    name: 'Hana + Jae',
    type: 'Engagement',
    status: 'Follow up',
    received: '2d ago',
  },
] as const;
