import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

import { useCompactLandscapeViewport, useLayoutMode } from "../../../lib/use-layout-mode.ts";
import { cn } from "../../../lib/utils.ts";
import type { GameCardData, PlayerInfo } from "../types.ts";
import type { GundamAttackUnitDragSource } from "./gundam-drag-drop-context.tsx";
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
  /** Public cards removed from the game. Rendered only when non-empty. */
  readonly removalArea?: readonly GameCardData[];
  readonly availableResources?: number;
  readonly handCount?: number;
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
  /** Click handler for a facedown Shield. */
  readonly onShieldCardClick?: (cardId: string) => void;
  /** Click handler for cards in the resource-area row. Pending effects
   *  use the same card-action dispatcher as hand and battle-area cards. */
  readonly onResourceCardClick?: (cardId: string) => void;
  readonly onHandCardDrop?: (cardId: string) => void;
  readonly pilotDropTargetIds?: ReadonlyMap<string, readonly string[]>;
  readonly pilotLinkTargetIds?: ReadonlyMap<string, readonly string[]>;
  readonly attackDragSources?: ReadonlyMap<string, GundamAttackUnitDragSource>;
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
  removalArea = [],
  availableResources = 0,
  handCount,
  isViewer = false,
  isTurn = false,
  isPriority = false,
  selectedCardIds = [],
  highlightCardIds = [],
  onPlayCardClick,
  onShieldCardClick,
  onResourceCardClick,
  onHandCardDrop,
  pilotDropTargetIds,
  pilotLinkTargetIds,
  attackDragSources,
  timeoutOverlay,
  children,
}: PlayerSeatProps) {
  const isTop = side === "top";
  const isMobile = useLayoutMode() === "mobile";
  const compactLandscape = useCompactLandscapeViewport();
  const hasPairedUnit = play.some((card) => card.pairedPilot !== undefined);
  const [hasWideCombatViewport, setHasWideCombatViewport] = useState(true);
  useEffect(() => {
    const update = () => setHasWideCombatViewport(window.innerWidth >= 1280);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  // Keep the seat's row budget in lockstep with ResourceAreaRow. Before the
  // board has enough width for the desktop combat core, the core becomes the
  // two-row compact composition and needs a real 100px footprint — never a
  // 68px desktop row that clips its Base or shield state.
  const compactCombatCore = isMobile || !hasWideCombatViewport;

  // Each seat owns three real rows. The top seat reads hand → utility
  // (base, shields, resources, scrap, deck) → field; the bottom seat mirrors
  // that order around the match rail. Nothing is positioned across rows.
  return (
    <div
      className={cn(
        "gd-dark-surface relative flex min-h-0 min-w-0 flex-1 flex-col overflow-clip",
        !isMobile && (isTop ? "basis-[86px]" : "basis-[160px]"),
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
      <SeatTurnIndicator side={side} isTurn={isTurn} isPriority={isPriority} isViewer={isViewer} />
      {timeoutOverlay}
      <ResourceAreaRow
        side={side}
        player={player}
        resourceArea={resourceArea}
        discard={discard}
        removalArea={removalArea}
        availableResources={availableResources}
        selectedCardIds={selectedCardIds}
        highlightCardIds={highlightCardIds}
        onResourceCardClick={onResourceCardClick}
        utilityColumn={
          <PlayerSeatPlate
            side={side}
            player={player}
            base={base}
            shields={shields}
            isViewer={isViewer}
            playerId={player.name}
            selectedCardIds={selectedCardIds}
            highlightCardIds={highlightCardIds}
            onBaseCardClick={onPlayCardClick}
            onShieldCardClick={onShieldCardClick ?? onPlayCardClick}
            dense
            compactLayout={compactCombatCore}
          />
        }
        className={cn(
          "order-2",
          compactCombatCore
            ? "h-[100px] min-h-[100px] flex-none"
            : "h-[68px] min-h-[68px] flex-none",
        )}
      />
      <PlayZone
        side={side}
        playerId={player.name}
        play={play}
        selectedCardIds={selectedCardIds}
        highlightCardIds={highlightCardIds}
        onCardClick={onPlayCardClick}
        onCardDrop={onHandCardDrop}
        pilotDropTargetIds={pilotDropTargetIds}
        pilotLinkTargetIds={pilotLinkTargetIds}
        attackDragSources={attackDragSources}
        isTurn={isTurn}
        isPriority={isPriority}
        className={cn(
          isTop ? "order-3" : "order-1",
          !isMobile && "min-h-0",
          compactLandscape &&
            (hasPairedUnit ? "h-40 min-h-40 flex-none" : "h-28 min-h-28 flex-none"),
        )}
      />
      {children && (
        <div
          data-seat-row="hand"
          className={cn(
            "flex justify-center min-w-0 w-full",
            isMobile ? "px-2 py-0" : "px-2 py-1",
            isMobile
              ? handCount === 0
                ? isTop
                  ? "h-0 min-h-0 flex-none border-0"
                  : "h-8 min-h-8 flex-none"
                : "h-[90px] min-h-[90px] flex-none"
              : isTop
                ? "h-[86px] min-h-[86px] flex-none"
                : "h-[160px] min-h-[160px] flex-none border-t border-hud-border bg-hud-deep/60",
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
  readonly side: SeatSide;
  readonly isTurn: boolean;
  readonly isPriority: boolean;
  readonly isViewer: boolean;
}

/** The priority edge faces the centerline; turn ownership remains a quiet perimeter. */
function SeatTurnIndicator({ side, isTurn, isPriority, isViewer }: SeatTurnIndicatorProps) {
  const accent = isViewer ? "#2d6bff" : "#ff2d7a";

  const ringStyle: CSSProperties = isPriority
    ? side === "top"
      ? {
          boxShadow: `inset 0 -3px 0 ${accent}d8, inset 0 -28px 38px -30px ${accent}`,
        }
      : {
          boxShadow: `inset 0 3px 0 ${accent}d8, inset 0 28px 38px -30px ${accent}`,
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
