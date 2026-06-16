export default function PlatformLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 animate-pulse">
      {/* page title bar */}
      <div className="mb-6 flex items-end justify-between">
        <div className="space-y-2">
          <div className="h-7 w-48 rounded-lg bg-muted" />
          <div className="h-4 w-64 rounded bg-muted/60" />
        </div>
        <div className="h-8 w-24 rounded-lg bg-muted" />
      </div>

      {/* top stats row */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-muted" />
        ))}
      </div>

      {/* main content cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-64 rounded-xl bg-muted" />
        <div className="h-64 rounded-xl bg-muted" />
      </div>

      <div className="mt-4 h-48 rounded-xl bg-muted" />
    </div>
  );
}
