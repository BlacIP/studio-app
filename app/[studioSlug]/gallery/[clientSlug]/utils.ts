export function getInitials(name: string) {
  const cleaned = name.trim();
  if (!cleaned) return 'ST';
  const words = cleaned.split(' ').filter(Boolean);
  const initials = words
    .slice(0, 2)
    .map((word) => word[0])
    .join('');
  return initials.toUpperCase();
}

export function formatEventDate(date?: string) {
  if (!date) return '';
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
