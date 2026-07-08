export default function NotFoundRoute() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-[1200px] items-center justify-center p-6">
      <div className="text-center">
        <p className="text-2xl font-extrabold text-[var(--text)]">Page not found</p>
        <p className="mt-2 text-[var(--muted)]">This path does not match a simulator route.</p>
        <a
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--game-accent)] px-4 py-2 text-sm font-semibold text-white"
        >
          Back to index
        </a>
      </div>
    </main>
  );
}
