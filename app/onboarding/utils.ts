export function compactRecord(record: Record<string, string>) {
  const entries = Object.entries(record)
    .map(([key, val]) => [key, val.trim()])
    .filter(([, val]) => val.length > 0);
  if (entries.length === 0) return null;
  return Object.fromEntries(entries);
}
