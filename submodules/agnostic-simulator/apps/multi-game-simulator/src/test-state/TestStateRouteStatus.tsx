export function TestStateRouteStatus({
  title,
  message,
}: {
  readonly title: string;
  readonly message: string;
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#10151d] p-6 text-white">
      <div className="max-w-lg text-center">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/50">Test state</p>
        <h1 className="mt-3 text-2xl font-bold">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-white/70">{message}</p>
      </div>
    </main>
  );
}
