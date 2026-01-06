export function GalleryState({
  title,
  description,
  emoji,
  loading,
}: {
  title: string;
  description: string;
  emoji?: string;
  loading?: boolean;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-white-0 text-text-sub-600">
      <div className="text-center max-w-md px-6">
        {loading && (
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-base mx-auto" />
        )}
        {emoji && !loading && <div className="mb-4 text-4xl">{emoji}</div>}
        <h1 className="text-2xl font-bold text-text-strong-950">{title}</h1>
        <p className="mt-2 text-lg">{description}</p>
      </div>
    </div>
  );
}
