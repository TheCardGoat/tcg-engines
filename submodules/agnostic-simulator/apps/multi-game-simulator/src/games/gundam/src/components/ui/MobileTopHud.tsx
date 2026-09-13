import { phaseLabel } from "../../game/labels.ts";
import { MessageSquareText, Shield } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { MobilePlayerRail } from "@tcg/simulator-ui";
import type { GundamControlState } from "../../game/index.ts";
import { Button } from "../primitives/index.ts";
import type { MatchInfo } from "./types.ts";

export interface MobileTopHudProps {
  readonly matchInfo: MatchInfo;
  readonly controlState: GundamControlState;
  readonly onOpenLog: () => void;
  readonly connectionIndicator?: ReactNode;
  readonly opponentName: ReactNode;
  readonly opponentClock?: ReactNode;
  readonly opponentShields?: number;
}

/**
 * Compact top bar for mobile portrait. Replaces the left sidebar's header +
 * match-meta block with a single compact row. The log action opens a dedicated
 * activity sheet; bot controls and utilities live under its More tab.
 */
export function MobileTopHud({
  matchInfo,
  controlState,
  onOpenLog,
  connectionIndicator,
  opponentName,
  opponentClock,
  opponentShields,
}: MobileTopHudProps) {
  const isSetup = matchInfo.format === "setup";
  const turnLabel = isSetup
    ? "Setup"
    : controlState.turnOwner === "self"
      ? "Your turn"
      : "Rival turn";
  const priorityLabel = isSetup
    ? controlState.kind === "resolving"
      ? "Resolving"
      : controlState.priorityHolder === "self"
        ? "Your decision"
        : "Waiting for rival"
    : controlState.kind === "resolving"
      ? "Resolving"
      : controlState.priorityHolder === "self"
        ? "Your priority"
        : "Rival priority";
  const sharedTurnAndPriority =
    !isSetup &&
    controlState.kind !== "resolving" &&
    controlState.turnOwner === controlState.priorityHolder;

  return (
    <MobilePlayerRail
      side="opponent"
      data-combat-label-obstacle
      className="gd-dark-surface flex-shrink-0 min-w-0 overflow-visible border-b border-hud-border bg-hud-deep px-1.5 shadow-[0_8px_20px_rgba(5,10,24,.24)]"
      style={
        {
          height: "var(--mobile-top-hud-height)",
          gridTemplateColumns: "auto minmax(0, 1fr) auto",
          "--mobile-portrait-surface": "var(--color-hud-deep)",
          "--mobile-portrait-text": "var(--color-hud-text)",
          "--mobile-portrait-border": "var(--color-hud-border)",
        } as CSSProperties
      }
      left={
        <Button
          onClick={onOpenLog}
          variant="outline"
          size="sm"
          className="h-11 min-w-11 flex-shrink-0 gap-1 rounded-sm border-hud-accent/40 bg-hud-accent/10 px-2 text-xs font-bold tracking-[.05em] text-hud-accent-deep"
          aria-label="Open match activity"
          style={{ color: "var(--color-hud-accent-hot)" }}
        >
          <MessageSquareText aria-hidden className="h-4 w-4" />
          <span className="hidden min-[480px]:inline">ACTIVITY</span>
        </Button>
      }
      center={
        <div className="grid min-w-0 place-content-center text-center text-xs font-semibold text-hud-text">
          <span className="whitespace-nowrap">
            Turn {matchInfo.turn} · {phaseLabel(matchInfo.phase)}
          </span>
          <span className="flex flex-wrap justify-center gap-x-1 text-xs leading-tight uppercase tracking-[.04em] text-hud-text-muted">
            {sharedTurnAndPriority ? (
              <span className="whitespace-nowrap">{turnLabel} · Priority</span>
            ) : (
              <>
                <span className="whitespace-nowrap">{turnLabel}</span>
                <span>·</span>
                <span className="whitespace-nowrap">{priorityLabel}</span>
              </>
            )}
          </span>
        </div>
      }
      right={
        <div className="flex min-w-0 items-center justify-end gap-1.5 px-1 text-right">
          <div className="grid min-w-0">
            <strong className="max-w-[88px] truncate text-xs">{opponentName}</strong>
            <span className="flex items-center justify-end gap-1 text-xs tabular-nums text-hud-text-muted">
              {opponentShields === undefined ? null : (
                <span
                  className="inline-flex items-center gap-0.5 text-hud-accent-deep"
                  aria-label={`Opponent shields: ${opponentShields}`}
                  title="Opponent shields"
                >
                  <Shield aria-hidden className="size-3" />
                  <span>{opponentShields}</span>
                </span>
              )}
              <span>{opponentClock ?? "—"}</span>
            </span>
          </div>
          {connectionIndicator ? (
            <div className="relative z-20 flex h-11 w-7 flex-none items-center justify-center">
              {connectionIndicator}
            </div>
          ) : null}
        </div>
      }
    />
  );
}
