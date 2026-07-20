import { phaseLabel } from "../../game/labels.ts";
import { cn } from "../../lib/utils.ts";
import type { MatchInfo } from "./types.ts";

export interface MatchStatusBarProps {
  readonly matchInfo: MatchInfo;
  readonly isSelfTurn: boolean;
  readonly isSelfPriority: boolean;
  readonly embedded?: boolean;
}

/**
 * Stable desktop status spine between both battle areas. This keeps the three
 * values players check most often in one place instead of encoding turn state
 * with a glow around an entire half of the board.
 */
export function MatchStatusBar({
  matchInfo,
  isSelfTurn,
  isSelfPriority,
  embedded = false,
}: MatchStatusBarProps) {
  return (
    <section
      aria-label="Match status"
      className={cn(
        "relative z-10 flex min-w-0 flex-1 items-center justify-center gap-3 bg-white/90 px-3",
        embedded
          ? "h-full"
          : "mx-3 h-9 flex-shrink-0 border-y border-hud-border/60 shadow-[0_1px_8px_rgba(30,73,199,.08)]",
      )}
    >
      <span
        className="rounded-sm border px-2 py-1 text-[10px] font-bold uppercase tracking-[.12em]"
        style={{
          color: isSelfTurn ? "var(--color-hud-accent-deep)" : "var(--color-hud-danger-deep)",
          borderColor: isSelfTurn ? "rgba(45,107,255,.3)" : "rgba(255,45,122,.3)",
          background: isSelfTurn ? "rgba(45,107,255,.08)" : "rgba(255,45,122,.08)",
        }}
      >
        {isSelfTurn ? "Your turn" : "Opponent turn"}
      </span>

      <span className="h-4 w-px bg-hud-line" aria-hidden />

      <span className="text-xs font-semibold text-hud-text">
        Turn <strong className="text-hud-accent-deep">{matchInfo.turn}</strong>
      </span>
      <span className="rounded-sm bg-hud-deep/70 px-2 py-1 text-[10px] font-bold uppercase tracking-[.1em] text-hud-text-muted">
        {phaseLabel(matchInfo.phase)}
      </span>

      <span className="h-4 w-px bg-hud-line" aria-hidden />

      <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[.1em] text-hud-text-dim">
        <span
          className="h-2 w-2 rotate-45"
          style={{
            background: isSelfPriority ? "var(--color-hud-accent)" : "var(--color-hud-danger)",
          }}
          aria-hidden
        />
        {isSelfPriority ? "You have priority" : "Opponent has priority"}
      </span>
    </section>
  );
}
