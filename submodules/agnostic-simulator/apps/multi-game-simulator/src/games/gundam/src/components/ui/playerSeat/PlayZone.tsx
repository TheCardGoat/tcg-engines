import { useDroppable } from "@dnd-kit/core";
import { useEffect } from "react";
import type { CSSProperties } from "react";

import { useLayoutMode } from "../../../lib/use-layout-mode.ts";
import { cn } from "../../../lib/utils.ts";
import { GameCard } from "../GameCard.tsx";
import { CardTagStrip } from "../card/CardTagStrip.tsx";
import { CARD_IMAGE_DIMENSIONS, CARD_SIZE_SCALES } from "../card/card-image-format.ts";
import { getCardTags } from "../card/card-tags.ts";
import type { GameCardData } from "../types.ts";
import type { SeatSide } from "./PlayerSeat.tsx";
import { CLIP_DIAMOND } from "./constants.ts";
import { PlayZoneCardBands } from "./PlayZoneCardBands.tsx";
import { encodeGundamBattleAreaTarget, useGundamDragDrop } from "./gundam-drag-drop-context.tsx";

const PAIRED_PILOT_PEEK_RATIO = 0.3;
const PAIRED_PILOT_UNIT_COVER_RATIO = 0.08;

interface PlayZoneProps {
  readonly side: SeatSide;
  readonly playerId?: string;
  readonly play: readonly GameCardData[];
  readonly selectedCardIds: readonly string[];
  readonly highlightCardIds: readonly string[];
  /** Click handler. Wraps each card so the click reaches the container's
   *  dispatcher even though `GameCard` itself no longer captures clicks
   *  for inspect (right-click is the inspect path now). */
  readonly onCardClick?: (cardId: string) => void;
  /** Dropping a playable hand card dispatches the same source-card action
   * as tapping it. Targeted moves continue through the normal prompt flow. */
  readonly onCardDrop?: (cardId: string) => void;
  readonly isTurn?: boolean;
  readonly isPriority?: boolean;
  readonly className?: string;
}

export function PlayZone({
  side,
  playerId,
  play,
  selectedCardIds,
  highlightCardIds,
  onCardClick,
  onCardDrop,
  isTurn = false,
  isPriority = false,
  className,
}: PlayZoneProps) {
  const isTop = side === "top";
  const layout = useLayoutMode();
  const selectedCardSet = new Set(selectedCardIds);
  const canAcceptDrop = Boolean(onCardDrop);
  const { activeSource, registerCardDropHandler } = useGundamDragDrop();
  const dropTargetId = encodeGundamBattleAreaTarget({
    type: "battle-area",
    playerId: playerId ?? side,
  });
  const { isOver, setNodeRef } = useDroppable({ id: dropTargetId, disabled: !canAcceptDrop });
  const isDragOver = canAcceptDrop && Boolean(activeSource) && isOver;
  useEffect(() => {
    if (!onCardDrop) return;
    registerCardDropHandler(onCardDrop);
    return () => registerCardDropHandler(null);
  }, [onCardDrop, registerCardDropHandler]);
  const dropProps = canAcceptDrop
    ? {
        "aria-label": "Your battle area drop zone",
        "data-drop-active": isDragOver ? "true" : "false",
      }
    : {};
  // Band sizing cascades via CSS vars (Lorcana pattern) so the bands and
  // anything inside them scale uniformly. On mobile, collapse bands back
  // onto the card face — the smaller viewport can't afford the extra
  // vertical footprint.
  const bandsEnabled = layout !== "mobile";
  const zoneVars: CSSProperties & Record<string, string> = {
    background: isTop
      ? layout === "mobile"
        ? "linear-gradient(180deg, oklch(0.42 0.12 350 / .35), transparent 82%)"
        : "linear-gradient(180deg, oklch(0.42 0.1 350 / .22), transparent 72%)"
      : layout === "mobile"
        ? "linear-gradient(0deg, oklch(0.46 0.14 255 / .36), transparent 82%)"
        : "linear-gradient(0deg, oklch(0.42 0.12 255 / .24), transparent 72%)",
    borderBottom: isTop ? "1px dashed rgba(45,107,255,.12)" : "none",
    "--play-pill-size": "34px",
    "--play-pill-text-size": "15px",
    "--play-pill-label-size": "8px",
    "--play-band-height-top": "22px",
    "--play-band-height-bottom": "22px",
    "--play-band-overlap": "0.5",
    ...(isDragOver
      ? {
          boxShadow: "inset 0 0 0 3px rgba(86,220,120,.9), inset 0 0 32px rgba(86,220,120,.22)",
        }
      : {}),
  };
  if (layout === "mobile") {
    // The utility plate lives in ResourceAreaRow, leaving the field as a
    // full-width horizontal lane. Players can swipe when deployed units
    // exceed the viewport rather than shrinking the card faces.
    return (
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 min-h-0 min-w-0 flex flex-col relative border-y border-hud-border/20",
          className,
        )}
        data-sim-zone-id={playerId ? `battleArea:${playerId}` : undefined}
        data-turn={isTurn ? "true" : "false"}
        data-priority={isPriority ? "true" : "false"}
        style={zoneVars}
        {...dropProps}
      >
        <div
          className={cn(
            "relative flex-1 flex items-center gap-2 px-2 py-2 overflow-x-auto overflow-y-visible",
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden touch-pan-x justify-start",
          )}
        >
          <FieldLabel
            side={side}
            count={play.length}
            mobile
            isTurn={isTurn}
            isPriority={isPriority}
          />
          {play.map((c, i) => {
            const handleClick = c.id && onCardClick ? () => onCardClick(c.id!) : undefined;
            return (
              <div key={c.id ?? i} className="play-slot flex-shrink-0">
                <PairedUnitStack
                  card={c}
                  side={side}
                  size="micro"
                  onCardClick={handleClick}
                  selected={c.id !== undefined && selectedCardSet.has(c.id)}
                  highlight={c.id !== undefined && highlightCardIds.includes(c.id)}
                  hideStatBadges={false}
                  hideSupplementalBadges={false}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex-1 min-h-[160px] pt-3.5 pr-6 pb-3.5 pl-3 relative flex items-stretch gap-3",
        className,
      )}
      data-sim-zone-id={playerId ? `battleArea:${playerId}` : undefined}
      style={zoneVars}
      {...dropProps}
    >
      <FieldLabel side={side} count={play.length} />
      <div className="relative flex-1 flex items-center">
        <div className="absolute left-[2px] top-0 bottom-0 flex flex-col items-center justify-between py-3 pointer-events-none">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-1 h-1"
              style={{
                background: isTop ? "rgba(255,45,122,.45)" : "rgba(76,195,255,.5)",
                clipPath: CLIP_DIAMOND,
              }}
            />
          ))}
        </div>

        <div className="flex flex-1 flex-wrap items-center justify-center gap-2.5 pl-8">
          {play.length === 0 ? (
            <div className="mx-auto flex flex-col items-center gap-1 text-center text-hud-text-faint">
              <span className="h-5 w-5 rounded-full border border-dashed border-current" />
              <span className="text-[9px] font-semibold uppercase tracking-[.14em]">
                {isTop ? "Opponent field clear" : "Deploy units here"}
              </span>
            </div>
          ) : null}
          {play.map((c, i) => {
            const handleClick = c.id && onCardClick ? () => onCardClick(c.id!) : undefined;
            const slotVars = getPlaySlotVars(c, side, "small");
            if (!bandsEnabled) {
              return (
                <div key={c.id ?? i}>
                  {renderUnitNode({
                    card: c,
                    size: "small",
                    selected: c.id !== undefined && selectedCardSet.has(c.id),
                    highlight: c.id !== undefined && highlightCardIds.includes(c.id),
                    hideStatBadges: bandsEnabled,
                    hideSupplementalBadges: bandsEnabled,
                    onCardClick: handleClick,
                  })}
                </div>
              );
            }
            return (
              <div key={c.id ?? i} className="play-slot" style={slotVars}>
                <PlayZoneCardBands card={c} section="top" />
                <PairedUnitStack
                  card={c}
                  side={side}
                  size="small"
                  onCardClick={handleClick}
                  selected={c.id !== undefined && selectedCardSet.has(c.id)}
                  highlight={c.id !== undefined && highlightCardIds.includes(c.id)}
                  hideStatBadges={bandsEnabled}
                  hideSupplementalBadges={bandsEnabled}
                />
                <PlayZoneCardBands card={c} section="bottom" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FieldLabel({
  side,
  count,
  mobile = false,
  isTurn = false,
  isPriority = false,
}: {
  readonly side: SeatSide;
  readonly count: number;
  readonly mobile?: boolean;
  readonly isTurn?: boolean;
  readonly isPriority?: boolean;
}) {
  const isTop = side === "top";
  return (
    <div
      className={cn(
        "pointer-events-none absolute z-[2] flex items-center gap-1.5 rounded-sm border bg-white/80 px-2 py-1 text-[8px] font-bold uppercase tracking-[.16em] text-hud-text-dim",
        mobile
          ? "left-2 right-2 top-1 min-h-[26px] shadow-sm"
          : isTop
            ? "left-4 top-2"
            : "bottom-2 right-4",
      )}
      style={{
        borderColor: isTop ? "rgba(255,45,122,.22)" : "rgba(45,107,255,.22)",
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: isTop ? "var(--color-hud-danger)" : "var(--color-hud-accent)" }}
      />
      {isTop ? "Opponent field" : "Your field"}
      <span className="text-hud-text-faint">{count}</span>
      {mobile && (isTurn || isPriority) ? (
        <span className="ml-auto flex items-center gap-1">
          {isTurn ? (
            <span className="rounded-sm border border-current/20 bg-white/70 px-1 py-0.5 text-[7px]">
              Turn
            </span>
          ) : null}
          {isPriority ? (
            <span
              className="rounded-sm px-1 py-0.5 text-[7px] text-white"
              style={{ background: isTop ? "#c8155a" : "#1e49c7" }}
            >
              Priority
            </span>
          ) : null}
        </span>
      ) : null}
    </div>
  );
}

interface PairedUnitStackProps {
  readonly card: GameCardData;
  readonly side: SeatSide;
  readonly size: "small" | "micro";
  readonly onCardClick?: () => void;
  readonly selected: boolean;
  readonly highlight: boolean;
  readonly hideStatBadges: boolean;
  readonly hideSupplementalBadges: boolean;
}

function getPairedPilotMetrics(size: "small" | "micro"): {
  readonly peekPx: number;
  readonly unitCoverPx: number;
} {
  const cardHeightPx = CARD_IMAGE_DIMENSIONS.full.height * CARD_SIZE_SCALES[size];
  const peekPx = Math.round(cardHeightPx * PAIRED_PILOT_PEEK_RATIO);
  return {
    peekPx,
    unitCoverPx: Math.round(cardHeightPx * PAIRED_PILOT_UNIT_COVER_RATIO),
  };
}

function getPlaySlotVars(
  card: GameCardData,
  side: SeatSide,
  size: "small" | "micro",
): CSSProperties & Record<string, string> {
  if (!card.pairedPilot) return {};

  const { peekPx, unitCoverPx } = getPairedPilotMetrics(size);
  const statBottomOffsetPx = side === "top" ? unitCoverPx : Math.max(0, peekPx - unitCoverPx);
  return {
    "--play-slot-stat-bottom-offset": `${statBottomOffsetPx}px`,
  };
}

/**
 * Renders a unit card with its paired pilot peeking out from the seat's
 * back edge, matching the official Gundam digital UI. The pilot card
 * sits behind the unit in reserved peek space, then the unit shifts
 * toward that strip to cover the pilot title/name. For the bottom
 * (own) seat the pilot peeks below the unit; for the top (opponent)
 * seat it mirrors above. Cards without a paired pilot render as a plain
 * GameCard.
 *
 * The exposed pilot strip is clickable + hoverable as a distinct card so
 * the player can inspect the pilot independently — `data-card-id` lets
 * the global hover preview and right-click inspect resolve to the pilot
 * rather than the unit.
 */
function PairedUnitStack({
  card,
  side,
  size,
  onCardClick,
  selected,
  highlight,
  hideStatBadges,
  hideSupplementalBadges,
}: PairedUnitStackProps) {
  const unitNode = renderUnitNode({
    card,
    size,
    onCardClick,
    selected,
    highlight,
    hideStatBadges,
    hideSupplementalBadges,
  });

  if (!card.pairedPilot) return unitNode;

  // Reserve a 30%-of-card-height pilot strip at the seat's back edge,
  // then cover part of that strip with the shifted unit so the pilot's
  // printed name stays hidden. Compute both values from the same
  // dimensions table the GameCard uses so the stack scales uniformly.
  const isTop = side === "top";
  const { peekPx, unitCoverPx } = getPairedPilotMetrics(size);

  return (
    <div
      className="relative"
      style={{
        // Reserve the full pilot strip footprint so the seat's adjacent
        // rows (resource band / shields plate) don't collide with it.
        [isTop ? "marginTop" : "marginBottom"]: peekPx,
      }}
    >
      {/* Pilot card sits behind (z-index 0) the unit, vertically shifted
       * into the reserved strip. The unit then moves toward that strip to
       * hide the pilot name while leaving a smaller inspectable peek. */}
      <div
        className="absolute left-1/2 -translate-x-1/2 pointer-events-auto"
        style={{
          zIndex: 0,
          // Shift the pilot away from the centerline into the reserved
          // strip. The unit translation below intentionally covers part
          // of this strip so the pilot's printed name stays hidden.
          top: isTop ? `-${peekPx}px` : `${peekPx}px`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <GameCard {...card.pairedPilot} size={size} hideSupplementalBadges />
      </div>
      <div className="relative" style={{ zIndex: 1 }}>
        <div
          style={{
            transform: `translateY(${isTop ? -unitCoverPx : unitCoverPx}px)`,
          }}
        >
          {unitNode}
        </div>
      </div>
    </div>
  );
}

function renderUnitNode({
  card,
  size,
  onCardClick,
  selected,
  highlight,
  hideStatBadges,
  hideSupplementalBadges,
}: Omit<PairedUnitStackProps, "side">) {
  return (
    <div className="relative inline-block">
      <GameCard
        {...card}
        size={size}
        onClick={onCardClick}
        selected={selected}
        highlight={highlight}
        hideStatBadges={hideStatBadges}
        hideSupplementalBadges={hideSupplementalBadges}
      />
      {!hideSupplementalBadges && <MobilePlayStatusBadges card={card} />}
      {!hideStatBadges && <MobilePlayStatBadges card={card} />}
    </div>
  );
}

function MobilePlayStatusBadges({ card }: { readonly card: GameCardData }) {
  const tags = getCardTags(card).filter((tag) => tag.id !== "damage");
  if (tags.length === 0) return null;

  return (
    <div
      className="absolute left-1 top-1 z-[5] pointer-events-auto"
      data-testid="mobile-play-status-badges"
    >
      <CardTagStrip tags={tags} maxVisible={3} compact collapseMode="hover-stack" />
    </div>
  );
}

function MobilePlayStatBadges({ card }: { readonly card: GameCardData }) {
  const showStats =
    (card.cardType === "unit" && (card.ap != null || card.hp != null)) ||
    (card.cardType === "base" && card.hp != null);
  if (!showStats) return null;

  return (
    <div
      className="absolute right-1 bottom-1 z-[5] flex gap-1 pointer-events-none"
      data-testid="mobile-play-stat-badges"
    >
      {card.cardType === "unit" && card.ap != null && (
        <MobileStatCircle label="AP" value={card.ap} delta={card.ap - (card.baseAp ?? card.ap)} />
      )}
      {card.hp != null && (
        <MobileStatCircle label="HP" value={card.hp} delta={card.hp - (card.baseHp ?? card.hp)} />
      )}
    </div>
  );
}

function MobileStatCircle({
  label,
  value,
  delta,
}: {
  readonly label: "AP" | "HP";
  readonly value: number;
  readonly delta: number;
}) {
  const tone =
    delta > 0
      ? "play-pill--buffed"
      : delta < 0
        ? "play-pill--debuffed"
        : label === "AP"
          ? "play-pill--ap"
          : "play-pill--hp";
  const signed = delta > 0 ? `+${delta}` : delta < 0 ? `${delta}` : "";
  const title = `${label} ${value}${signed ? ` (${signed})` : ""}`;

  return (
    <div
      data-testid={`mobile-play-stat-${label.toLowerCase()}`}
      className={`play-pill ${tone}`}
      aria-label={title}
      title={title}
    >
      <span className="play-pill__label" aria-hidden>
        {label}
      </span>
      <span className="play-pill__value">{value}</span>
    </div>
  );
}
