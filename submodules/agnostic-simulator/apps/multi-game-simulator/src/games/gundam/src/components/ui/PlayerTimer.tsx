import { deriveClockView, type ClockSnapshot } from "@tcg/gundam-engine";

import { cn } from "../../lib/utils.ts";
import { useClockNow } from "../../game/use-clock-now.ts";

export interface PlayerTimerProps {
  readonly snapshot: ClockSnapshot;
  readonly isOwnClock?: boolean;
  readonly compact?: boolean;
}

export function PlayerTimer({ snapshot, isOwnClock = false, compact = false }: PlayerTimerProps) {
  const now = useClockNow();
  const view = deriveClockView(snapshot, now, { isOwnClock });

  return (
    <span
      role="timer"
      aria-label={`Player time remaining: ${view.formattedTime}`}
      className={cn(
        "inline-flex items-center justify-center font-mono tabular-nums font-extrabold tracking-hud-body",
        "rounded-[3px] border px-1.5 py-[1px]",
        view.isRunning
          ? "border-hud-info/50 bg-hud-info/15 text-hud-info"
          : "border-hud-border bg-white/55 text-hud-text-dim",
        view.urgencyClass === "timer--warning" &&
          "border-amber-400/60 text-amber-500 bg-amber-400/10",
        view.urgencyClass === "timer--danger" && "border-red-500/60 text-red-500 bg-red-500/10",
        view.urgencyClass === "timer--critical" &&
          "border-red-500/80 text-red-600 bg-red-500/15 animate-pulse",
        compact ? "text-hud-2xs" : "text-hud-xs",
      )}
    >
      {view.formattedTime}
    </span>
  );
}
