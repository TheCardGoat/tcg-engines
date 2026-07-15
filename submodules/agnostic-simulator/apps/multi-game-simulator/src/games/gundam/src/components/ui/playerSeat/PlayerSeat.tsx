import type { CSSProperties, ReactNode } from "react";

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
  readonly selectedCardIds?: readonly string[];
  readonly highlightCardIds?: readonly string[];
  /** Click handler for cards in the battle-area row. Receives the
   *  card's instance id; the container dispatches the move. */
  readonly onPlayCardClick?: (cardId: string) => void;
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
  selectedCardIds = [],
  highlightCardIds = [],
  onPlayCardClick,
  timeoutOverlay,
  children,
}: PlayerSeatProps) {
  const isTop = side === "top";

  // Layout columns: seat plate on the left, then a flex column with
  // explicit `order` so the same JSX renders both seats. Hand sits as
  // a real row instead of an absolute overlay — top seat reads
  // hand → resource → play; bottom seat reads play → resource → hand.
  return (
    <div className="flex flex-col flex-1 min-h-0 min-w-0 relative">
      <SeatTurnIndicator isTurn={isTurn} isViewer={isViewer} />
      {timeoutOverlay}
      <ResourceAreaRow
        side={side}
        player={player}
        resourceArea={resourceArea}
        discard={discard}
        availableResources={availableResources}
        className={cn("order-2")}
      />
      <PlayZone
        side={side}
        playerId={player.name}
        play={play}
        selectedCardIds={selectedCardIds}
        highlightCardIds={highlightCardIds}
        onCardClick={onPlayCardClick}
        leftColumn={
          isTop ? undefined : (
            <PlayerSeatPlate
              side={side}
              player={player}
              base={base}
              shields={shields}
              isViewer={isViewer}
              playerId={player.name}
            />
          )
        }
        rightColumn={
          isTop ? (
            <PlayerSeatPlate
              side={side}
              player={player}
              base={base}
              shields={shields}
              isViewer={isViewer}
              playerId={player.name}
            />
          ) : undefined
        }
        className={cn(isTop ? "order-3" : "order-1")}
      />
      {children && (
        <div
          className={cn(
            "flex justify-center px-2 py-1 min-w-0 w-full",
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
  readonly isViewer: boolean;
}

/**
 * Turn ring around the entire seat. When the seat owns the turn the ring
 * lights up a thick gradient border with an outer glow that's hard to miss
 * regardless of sidebar state; idle seats get a faint neutral outline so
 * the layout stays stable.
 */
function SeatTurnIndicator({ isTurn, isViewer }: SeatTurnIndicatorProps) {
  const accent = isViewer ? "#2d6bff" : "#ff2d7a";

  const ringStyle: CSSProperties = isTurn
    ? {
        boxShadow: `inset 0 0 0 3px ${accent}, inset 0 0 24px ${accent}40, 0 0 24px ${accent}55`,
      }
    : {
        boxShadow: "inset 0 0 0 1px rgba(120,140,180,.25)",
      };

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[8]" style={ringStyle} />
  );
}
