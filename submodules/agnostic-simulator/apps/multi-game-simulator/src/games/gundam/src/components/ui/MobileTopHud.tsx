import { phaseLabel } from "../../game/labels.ts";
import { MessageSquareText } from "lucide-react";
import type { ReactNode } from "react";
import { m } from "../../lib/i18n/messages.ts";
import { Button } from "../primitives/index.ts";
import type { MatchInfo } from "./types.ts";

export interface MobileTopHudProps {
  readonly matchInfo: MatchInfo;
  readonly isSelfTurn: boolean;
  readonly isSelfPriority: boolean;
  readonly onOpenLog: () => void;
  readonly connectionIndicator?: ReactNode;
}

/**
 * Compact top bar for mobile portrait. Replaces the left sidebar's header +
 * match-meta block with a single compact row. The log action opens a dedicated
 * log sheet; player and AI controls remain desktop-only.
 */
export function MobileTopHud({
  matchInfo,
  isSelfTurn,
  isSelfPriority,
  onOpenLog,
  connectionIndicator,
}: MobileTopHudProps) {
  return (
    <header
      className="gd-dark-surface flex items-center gap-2 border-b border-hud-border bg-hud-deep px-1.5 flex-shrink-0 min-w-0 overflow-visible shadow-[0_8px_20px_rgba(5,10,24,.24)]"
      style={{
        // Real rendered height must include the notch inset so content
        // isn't squeezed into `topHudHeight - safeTop`. PendingEffects and
        // the bottom-sheet both assume this same sum when positioning.
        height: "calc(var(--mobile-top-hud-height) + var(--safe-top))",
        paddingTop: "var(--safe-top)",
      }}
    >
      <Button
        onClick={onOpenLog}
        variant="outline"
        size="sm"
        className="h-11 min-w-11 flex-shrink-0 gap-1 rounded-sm border-hud-accent/40 bg-hud-accent/10 px-2 text-[10px] font-bold tracking-[.08em] text-hud-accent-deep"
        aria-label={m["sim.sidebar.log.regionLabel"]()}
        style={{ color: "var(--color-hud-accent-hot)" }}
      >
        <MessageSquareText aria-hidden className="h-4 w-4" />
        LOG
      </Button>

      <div className="flex min-w-0 flex-1 items-center justify-center gap-1 text-[10px] font-semibold text-hud-text">
        <span className="whitespace-nowrap">Turn {matchInfo.turn}</span>
        <span className="text-hud-text-faint">·</span>
        <span className="truncate text-hud-accent-deep">{phaseLabel(matchInfo.phase)}</span>
      </div>

      <div className="grid w-[118px] flex-none grid-cols-[auto_1fr] overflow-hidden rounded-sm border border-hud-border/50 bg-hud-surface-raised text-[8px] font-bold uppercase leading-none tracking-[.08em]">
        <StatusCell label="Turn" isSelf={isSelfTurn} />
        <StatusCell label="Priority" isSelf={isSelfPriority} />
      </div>

      {connectionIndicator ? (
        <div className="relative z-20 flex h-11 w-7 flex-none items-center justify-center">
          {connectionIndicator}
        </div>
      ) : null}
    </header>
  );
}

function StatusCell({ label, isSelf }: { readonly label: string; readonly isSelf: boolean }) {
  return (
    <>
      <span className="border-b border-hud-line px-1.5 py-1 text-hud-text-faint last:border-0">
        {label}
      </span>
      <span
        aria-label={`${label}: ${isSelf ? "You" : "Opponent"}`}
        className="border-b border-hud-line px-1.5 py-1 text-right last:border-0"
        style={{
          color: isSelf ? "var(--color-hud-accent-deep)" : "var(--color-hud-danger-deep)",
          background: isSelf ? "rgba(45,107,255,.10)" : "rgba(255,45,122,.10)",
        }}
      >
        {isSelf ? "You" : "Opp"}
      </span>
    </>
  );
}
