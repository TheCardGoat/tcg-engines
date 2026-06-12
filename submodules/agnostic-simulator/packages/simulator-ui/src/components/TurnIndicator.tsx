interface TurnIndicatorProps {
  turn: number;
  phase: string;
}

export function TurnIndicator({ turn, phase }: TurnIndicatorProps) {
  return (
    <div
      className="turn-indicator inline-flex items-center gap-2 rounded-full border border-[var(--board-border)] bg-[var(--board-surface)] px-3 py-1.5"
      role="status"
      aria-label={`Turn ${turn}, Phase ${phase}`}
    >
      <span className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-[var(--game-accent)]/20 px-1.5 text-xs font-black text-[var(--game-accent)]">
        {turn}
      </span>
      <span className="text-xs font-bold uppercase tracking-wide text-[var(--board-text)]">
        {phase}
      </span>
    </div>
  );
}
