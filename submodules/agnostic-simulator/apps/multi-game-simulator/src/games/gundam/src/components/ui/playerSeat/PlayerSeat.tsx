import type { CSSProperties, ReactNode } from "react";

import { useLayoutMode } from "../../../lib/use-layout-mode.ts";
import { cn } from "../../../lib/utils.ts";
import type { GameCardData, PlayerInfo } from "../types.ts";
import { PlayerSeatPlate } from "./PlayerSeatPlate.tsx";
import { PlayZone } from "./PlayZone.tsx";
import { ResourceAreaRow } from "./ResourceAreaRow.tsx";

export type SeatSide = "top" | "bottom";

export interface PlayerSeatProps {
  readonly side: SeatSide;
  readonly player: PlayerInfo;
  readonly play?: readonly GameCardData[];
  readonly resourceArea?: readonly GameCardData[];
  readonly base?: readonly GameCardData[];
  readonly shields?: readonly GameCardData[];
  readonly discard?: readonly GameCardData[];
  readonly availableResources?: number;
  /** True for the viewer's own seat — drives PILOT/HOSTILE labeling. */
  readonly isViewer?: boolean;
  /** True when this seat owns the active turn. Drives the inline
   *  turn indicator that's visible even when the sidebar is collapsed. */
  readonly isTurn?: boolean;
  /** True when this seat currently has action priority. */
  readonly isPriority?: boolean;
  readonly selectedCardIds?: readonly string[];
  readonly highlightCardIds?: readonly string[];
  /** Click handler for cards in the battle-area row. Receives the
   *  card's instance id; the container dispatches the move. */
  readonly onPlayCardClick?: (cardId: string) => void;
  readonly onHandCardDrop?: (cardId: string) => void;
  readonly timeoutOverlay?: ReactNode;
  readonly children?: ReactNode;
}

export function PlayerSeat({
  side,
  player,
  play = [],
  resourceArea = [],
  base = [],
  shields = [],
  discard = [],
  availableResources = 0,
  isViewer = false,
  isTurn = false,
  isPriority = false,
  selectedCardIds = [],
  highlightCardIds = [],
  onPlayCardClick,
  onHandCardDrop,
  timeoutOverlay,
  children,
}: PlayerSeatProps) {
  const isTop = side === "top";
  const isMobile = useLayoutMode() === "mobile";

  // Each seat owns three real rows. The top seat reads hand → utility
  // (base, shields, resources, scrap, deck) → field; the bottom seat mirrors
  // that order around the match rail. Nothing is positioned across rows.
  return (
    <div
      className={cn(
        "gd-dark-surface relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden",
        isTop ? "border-b border-hud-danger/30" : "border-t border-hud-accent/30",
      )}
      data-seat-side={side}
      data-turn={isTurn ? "true" : "false"}
      data-priority={isPriority ? "true" : "false"}
      aria-label={isTop ? "Opponent board" : "Active player board"}
      style={{
        background: isTop
          ? isMobile
            ? "linear-gradient(180deg, oklch(0.34 0.09 350 / .92), oklch(0.21 0.035 275 / .95))"
            : "linear-gradient(180deg, oklch(0.31 0.075 350 / .78), oklch(0.19 0.03 270 / .82))"
          : isMobile
            ? "linear-gradient(0deg, oklch(0.34 0.1 255 / .94), oklch(0.2 0.04 265 / .95))"
            : "linear-gradient(0deg, oklch(0.3 0.085 255 / .82), oklch(0.18 0.03 268 / .84))",
      }}
    >
      <SeatTurnIndicator isTurn={isTurn} isPriority={isPriority} isViewer={isViewer} />
      {timeoutOverlay}
      <ResourceAreaRow
        side={side}
        player={player}
        resourceArea={resourceArea}
        discard={discard}
        availableResources={availableResources}
        utilityColumn={
          <PlayerSeatPlate
            side={side}
            player={player}
            base={base}
            shields={shields}
            isViewer={isViewer}
            playerId={player.name}
          />
        }
        className={cn("order-2")}
      />
      <PlayZone
        side={side}
        playerId={player.name}
        play={play}
        selectedCardIds={selectedCardIds}
        highlightCardIds={highlightCardIds}
        onCardClick={onPlayCardClick}
        onCardDrop={onHandCardDrop}
        isTurn={isTurn}
        isPriority={isPriority}
        className={cn(isTop ? "order-3" : "order-1")}
      />
      {children && (
        <div
          className={cn(
            "flex justify-center min-w-0 w-full",
            isMobile ? "px-2 py-0" : "px-2 py-1",
            isMobile &&
              (isTop
                ? "border-b border-hud-danger/25 bg-hud-deep/35"
                : "border-t border-hud-accent/25 bg-hud-deep/35"),
            isTop ? "order-1" : "order-3",
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

interface SeatTurnIndicatorProps {
  readonly isTurn: boolean;
  readonly isPriority: boolean;
  readonly isViewer: boolean;
}

/** A quiet seat tint reinforces the explicit match-status bar. */
function SeatTurnIndicator({ isTurn, isPriority, isViewer }: SeatTurnIndicatorProps) {
  const accent = isViewer ? "#2d6bff" : "#ff2d7a";

  const ringStyle: CSSProperties = isPriority
    ? {
        boxShadow: `inset 0 0 0 2px ${accent}a8, inset 0 0 36px ${accent}26`,
      }
    : isTurn
      ? {
          boxShadow: `inset 0 0 0 1px ${accent}70, inset 0 0 28px ${accent}16`,
        }
      : {
          boxShadow: "inset 0 0 0 1px rgba(120,140,180,.16)",
        };

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[8]" style={ringStyle} />
  );
}
