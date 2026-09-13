import type { ReactNode } from "react";

export interface SimulatorRouteStatusProps {
  readonly title: string;
  readonly message?: string;
  readonly action?: ReactNode;
}

export function SimulatorRouteStatus({ title, message, action }: SimulatorRouteStatusProps) {
  return (
    <main
      className="flex h-svh min-h-0 w-full items-center justify-center overflow-hidden bg-[var(--board-bg,var(--surface-soft,#0b1220))] p-6 text-[var(--board-text,var(--text,#f8fbff))]"
      role="status"
    >
      <section className="w-full max-w-xl rounded-xl border border-[var(--board-border,var(--border,rgba(216,229,247,.22)))] bg-[var(--board-surface,var(--surface,#0f172a))] p-6 shadow-xl">
        <h1 className="m-0 text-2xl font-bold">{title}</h1>
        {message ? (
          <p className="mb-0 mt-3 text-[var(--board-muted,var(--muted,#a9b7c9))]">{message}</p>
        ) : null}
        {action ? <div className="mt-4">{action}</div> : null}
      </section>
    </main>
  );
}
