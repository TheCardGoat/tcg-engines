import type { HarnessFixture } from "@tcg/simulator-contract";

export interface StatusBarProps {
  fixture: HarnessFixture;
}

export function StatusBar({ fixture }: StatusBarProps) {
  return (
    <div className="status-bar flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center rounded-full border border-[var(--board-border)] bg-[var(--board-surface)] px-2.5 py-1 text-[11px] font-extrabold text-[var(--board-text)]">
        {fixture.gameSlug}
      </span>
      <span className="inline-flex items-center rounded-full border border-[var(--board-border)] bg-[var(--board-surface)] px-2.5 py-1 text-[11px] font-extrabold text-[var(--board-text)]">
        Turn {fixture.table.status.turn}
      </span>
      <span className="inline-flex items-center rounded-full border border-[var(--board-border)] bg-[var(--board-surface)] px-2.5 py-1 text-[11px] font-extrabold text-[var(--board-text)]">
        {fixture.table.status.phase}
      </span>
    </div>
  );
}
