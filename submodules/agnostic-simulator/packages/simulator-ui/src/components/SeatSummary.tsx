import type { SimulatorSeat, SimulatorTable } from "@tcg/simulator-contract";

import { cx } from "../class-names";

export interface SeatSummaryProps {
  table: SimulatorTable;
  seat: SimulatorSeat;
  compact?: boolean;
}

export function SeatSummary({ table, seat, compact = false }: SeatSummaryProps) {
  const isActive = table.status.activeSeatId === seat.id;

  return (
    <div
      className={cx(
        "seat-summary grid gap-2 rounded-lg border p-3",
        isActive
          ? "border-[var(--game-accent)] bg-[var(--game-accent)]/10"
          : "border-[var(--board-border)] bg-[var(--board-surface-soft)]",
      )}
      data-seat-id={seat.id}
      data-seat-role={seat.role}
    >
      <div className="flex items-center gap-2">
        {seat.avatarUrl && (
          <img
            src={seat.avatarUrl}
            alt={seat.label}
            className="h-8 w-8 rounded-full object-cover"
            loading="lazy"
          />
        )}
        <div className="min-w-0">
          <p className="text-xs font-black text-[var(--board-text)]">{seat.label}</p>
          <p className="text-[10px] font-bold uppercase text-[var(--board-muted)]">
            {seat.role} • {seat.perspective}
          </p>
        </div>
        {isActive && (
          <span
            className="ml-auto inline-flex h-2 w-2 rounded-full bg-[var(--game-accent)]"
            aria-hidden="true"
          />
        )}
      </div>

      {!compact && (
        <div className="flex flex-wrap gap-1">
          {seat.counters.map((counter) => (
            <span
              key={counter.label}
              className="inline-flex items-center rounded-md border border-[var(--board-border)] bg-[var(--board-surface)] px-2 py-1 text-[10px] font-extrabold text-[var(--board-text)]"
            >
              {counter.label}: {counter.value}
            </span>
          ))}
        </div>
      )}

      {seat.connectionStatus && (
        <div className="flex items-center gap-1">
          <span
            className={cx(
              "inline-block h-1.5 w-1.5 rounded-full",
              seat.connectionStatus === "online" && "bg-green-400",
              seat.connectionStatus === "thinking" && "bg-yellow-400",
              seat.connectionStatus === "offline" && "bg-gray-400",
            )}
          />
          <span className="text-[10px] font-bold uppercase text-[var(--board-muted)]">
            {seat.connectionStatus}
          </span>
        </div>
      )}
    </div>
  );
}
