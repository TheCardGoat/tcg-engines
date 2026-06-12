import type { CSSProperties, ReactNode } from "react";

import { m } from "../../../lib/i18n/messages.ts";
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
  /** Optional column rendered inside the play zone, flush to its left
   *  edge (shields + base for the seat). Stays scoped to the battle-area
   *  row so it doesn't span the hand/resource rows above or below. */
  readonly leftColumn?: ReactNode;
  /** Same as leftColumn but pinned to the right edge — used by the top
   *  (opponent) seat so its plate mirrors the bottom seat. */
  readonly rightColumn?: ReactNode;
  readonly className?: string;
}

export function PlayZone({
  side,
  playerId,
  play,
  selectedCardIds,
  highlightCardIds,
  onCardClick,
  leftColumn,
  rightColumn,
  className,
}: PlayZoneProps) {
  const isTop = side === "top";
  const layout = useLayoutMode();
  const selectedCardSet = new Set(selectedCardIds);
  // Band sizing cascades via CSS vars (Lorcana pattern) so the bands and
  // anything inside them scale uniformly. On mobile, collapse bands back
  // onto the card face — the smaller viewport can't afford the extra
  // vertical footprint.
  const bandsEnabled = layout !== "mobile";
  const zoneVars: CSSProperties & Record<string, string> = {
    background: isTop
      ? "linear-gradient(180deg, rgba(255,45,122,.06), transparent 70%)"
      : "linear-gradient(0deg,   rgba(30,73,199,.10), transparent 70%)",
    borderBottom: isTop ? "1px dashed rgba(45,107,255,.12)" : "none",
    "--play-pill-size": "34px",
    "--play-pill-text-size": "15px",
    "--play-pill-label-size": "8px",
    "--play-band-height-top": "22px",
    "--play-band-height-bottom": "22px",
    "--play-band-overlap": "0.5",
  };
  if (layout === "mobile") {
    // Mobile portrait: vertically stack the plate row above (own seat)
    // or below (opp seat) the play row, so the play row gets the full
    // viewport width and the plate doesn't eat horizontal space.
    // Play row uses overflow-x-auto so units overflow off-screen and
    // the player can swipe — flex-wrap would shrink the row vertically
    // on a phone where there's no spare height to spend.
    const plate = leftColumn ?? rightColumn;
    return (
      <div
        className={cn("flex-1 min-h-0 min-w-0 flex flex-col relative", className)}
        data-sim-zone-id={playerId ? `battleArea:${playerId}` : undefined}
        style={zoneVars}
      >
        {!isTop && plate}
        <div
          className={cn(
            "flex-1 flex items-center gap-2 px-2 py-2 overflow-x-auto overflow-y-visible",
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden touch-pan-x justify-start",
          )}
        >
          {play.map((c, i) => {
            const handleClick = c.id && onCardClick ? () => onCardClick(c.id!) : undefined;
            return (
              <div
                key={c.id ?? i}
                className="play-slot flex-shrink-0"
                onClick={handleClick}
                style={handleClick ? { cursor: "pointer" } : undefined}
              >
                <PairedUnitStack
                  card={c}
                  side={side}
                  size="micro"
                  selected={c.id !== undefined && selectedCardSet.has(c.id)}
                  highlight={c.id !== undefined && highlightCardIds.includes(c.id)}
                  hideStatBadges={false}
                  hideSupplementalBadges={false}
                />
              </div>
            );
          })}
        </div>
        {isTop && plate}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex-1 min-h-[160px] pt-3.5 pr-6 pb-3.5 pl-3 relative flex items-stretch gap-3",
        className,
      )}
      data-sim-zone-id={playerId ? `battleArea:${playerId}` : undefined}
      style={zoneVars}
    >
      {leftColumn}

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

        <div
          className="font-display absolute left-[14px] top-1/2 text-hud-xs font-extrabold tracking-hud-wide"
          style={{
            transform: "translateY(-50%) rotate(180deg)",
            writingMode: "vertical-rl",
            color: isTop ? "rgba(255,45,122,.7)" : "rgba(76,195,255,.7)",
            textShadow: isTop ? "0 0 6px rgba(255,45,122,.3)" : "0 0 6px rgba(76,195,255,.3)",
          }}
        >
          {isTop ? m["sim.seat.playZone.hostileLabel"]() : m["sim.seat.playZone.pilotLabel"]()}
        </div>

        <div className="flex-1 flex gap-2.5 justify-center items-center flex-wrap pl-8">
          {play.map((c, i) => {
            const handleClick = c.id && onCardClick ? () => onCardClick(c.id!) : undefined;
            const slotVars = getPlaySlotVars(c, side, "small");
            const cardNode = (
              <PairedUnitStack
                card={c}
                side={side}
                size="small"
                selected={c.id !== undefined && selectedCardSet.has(c.id)}
                highlight={c.id !== undefined && highlightCardIds.includes(c.id)}
                hideStatBadges={bandsEnabled}
                hideSupplementalBadges={bandsEnabled}
              />
            );
            if (!bandsEnabled) {
              return (
                <div
                  key={c.id ?? i}
                  onClick={handleClick}
                  style={handleClick ? { cursor: "pointer" } : undefined}
                >
                  {cardNode}
                </div>
              );
            }
            return (
              <div
                key={c.id ?? i}
                className="play-slot"
                onClick={handleClick}
                style={{
                  ...slotVars,
                  ...(handleClick ? { cursor: "pointer" } : undefined),
                }}
              >
                <PlayZoneCardBands card={c} section="top" />
                {cardNode}
                <PlayZoneCardBands card={c} section="bottom" />
              </div>
            );
          })}
        </div>
      </div>

      {rightColumn}
    </div>
  );
}

interface PairedUnitStackProps {
  readonly card: GameCardData;
  readonly side: SeatSide;
  readonly size: "small" | "micro";
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
  selected,
  highlight,
  hideStatBadges,
  hideSupplementalBadges,
}: PairedUnitStackProps) {
  const unitNode = renderUnitNode({
    card,
    size,
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
