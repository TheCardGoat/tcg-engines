import { useEffect, useMemo, useState } from "react";

import { cx } from "../class-names";

interface ChessClockProps {
  timerMs: number;
  timerState?: "running" | "paused" | "expired";
}

export function ChessClock({ timerMs, timerState = "running" }: ChessClockProps) {
  const [displayMs, setDisplayMs] = useState(timerMs);

  useEffect(() => {
    if (timerState !== "running") {
      setDisplayMs(timerMs);
      return;
    }
    const interval = setInterval(() => {
      setDisplayMs((prev) => Math.max(0, prev - 100));
    }, 100);
    return () => clearInterval(interval);
  }, [timerState, timerMs]);

  const formatted = useMemo(() => {
    const minutes = Math.floor(displayMs / 60000);
    const seconds = Math.floor((displayMs % 60000) / 1000);
    const tenths = Math.floor((displayMs % 1000) / 100);
    return `${minutes}:${seconds.toString().padStart(2, "0")}.${tenths}`;
  }, [displayMs]);

  const colorClass =
    displayMs > 30000
      ? "text-green-400"
      : displayMs > 10000
        ? "text-yellow-400"
        : displayMs > 5000
          ? "text-orange-400"
          : "text-red-400";

  return (
    <div
      className={cx(
        "chess-clock inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-black tabular-nums",
        timerState === "running" && "border-[var(--board-border)] bg-[var(--board-surface)]",
        timerState === "paused" && "border-yellow-500/30 bg-yellow-500/10",
        timerState === "expired" && "border-red-500/30 bg-red-500/10",
      )}
      role="timer"
      aria-label={`Chess clock: ${formatted}`}
    >
      {timerState === "running" ? (
        <span className="relative flex h-2 w-2">
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75 ${colorClass}`}
          />
          <span className={`relative inline-flex h-2 w-2 rounded-full bg-current ${colorClass}`} />
        </span>
      ) : timerState === "paused" ? (
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-yellow-400"
        >
          <rect x="6" y="4" width="4" height="16" rx="1" />
          <rect x="14" y="4" width="4" height="16" rx="1" />
        </svg>
      ) : (
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-red-400"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      )}
      <span className={cx(colorClass, timerState === "expired" && "text-red-400")}>
        {formatted}
      </span>
    </div>
  );
}
