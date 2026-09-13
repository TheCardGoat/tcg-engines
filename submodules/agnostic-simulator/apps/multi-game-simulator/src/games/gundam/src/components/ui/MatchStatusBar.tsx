import type { GundamControlState } from "../../game/index.ts";
import { phaseLabel } from "../../game/labels.ts";
import { cn } from "../../lib/utils.ts";
import { PriorityCommandBeacon } from "./PriorityCommandBeacon.tsx";
import type { MatchInfo } from "./types.ts";

export interface MatchStatusBarProps {
  readonly matchInfo: MatchInfo;
  readonly controlState: GundamControlState;
  readonly embedded?: boolean;
  readonly compact?: boolean;
}

/**
 * Stable desktop status spine between both battle areas. This keeps the three
 * values players check most often in one place instead of encoding turn state
 * with a glow around an entire half of the board.
 */
export function MatchStatusBar({
  matchInfo,
  controlState,
  embedded = false,
  compact = false,
}: MatchStatusBarProps) {
  const isSelfTurn = controlState.turnOwner === "self";
  const turnLabel = isSelfTurn ? "Your turn" : "Opponent turn";

  return (
    <section
      aria-label="Match status"
      className={cn(
        "relative z-10 flex min-w-0 flex-1 items-center justify-center bg-white/90",
        compact ? "gap-1 px-1" : "gap-2 px-2",
        embedded
          ? "h-full"
          : "mx-3 h-9 flex-shrink-0 border-y border-hud-border/60 shadow-[0_1px_8px_rgba(30,73,199,.08)]",
      )}
    >
      <span
        aria-label={compact ? turnLabel : undefined}
        className={cn(
          "whitespace-nowrap rounded-sm border py-1 text-hud-sm font-bold uppercase tracking-[.12em]",
          compact ? "px-1.5" : "px-2",
        )}
        style={{
          color: isSelfTurn ? "var(--color-hud-accent-deep)" : "var(--color-hud-danger-deep)",
          borderColor: isSelfTurn ? "rgba(45,107,255,.3)" : "rgba(255,45,122,.3)",
          background: isSelfTurn ? "rgba(45,107,255,.08)" : "rgba(255,45,122,.08)",
        }}
      >
        {compact ? (isSelfTurn ? "YOU" : "OPP") : turnLabel}
      </span>

      {!compact && <span className="h-4 w-px bg-hud-line" aria-hidden />}

      <span
        aria-label={compact ? `Turn ${matchInfo.turn}` : undefined}
        className="whitespace-nowrap text-xs font-semibold text-hud-text"
      >
        {compact ? "T" : "Turn "}
        <strong className="text-hud-accent-deep">{matchInfo.turn}</strong>
      </span>
      <span
        className={cn(
          "whitespace-nowrap rounded-sm bg-hud-deep/70 py-1 text-hud-sm font-bold uppercase tracking-[.1em] text-hud-text-muted",
          compact ? "px-1.5" : "px-2",
        )}
      >
        {phaseLabel(matchInfo.phase)}
      </span>

      {!compact && <span className="h-4 w-px bg-hud-line" aria-hidden />}

      <PriorityCommandBeacon controlState={controlState} compact={compact} />
    </section>
  );
}
