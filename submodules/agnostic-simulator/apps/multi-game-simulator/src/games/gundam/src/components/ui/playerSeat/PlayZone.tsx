import { useDroppable } from "@dnd-kit/core";
import {
  AnimatedEntityCollection,
  AnimatedEntitySlot,
  FixedSlotCardZone,
  PointerDraggable,
  PointerDroppable,
  useAnimationNode,
} from "@tcg/simulator-ui";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

import { useCompactLandscapeViewport, useLayoutMode } from "../../../lib/use-layout-mode.ts";
import { cn } from "../../../lib/utils.ts";
import { GameCard } from "../GameCard.tsx";
import { CardTagStrip } from "../card/CardTagStrip.tsx";
import { CARD_IMAGE_DIMENSIONS, CARD_SIZE_SCALES } from "../card/card-image-format.ts";
import { getCardTags } from "../card/card-tags.ts";
import type { GameCardData } from "../types.ts";
import type { SeatSide } from "./PlayerSeat.tsx";
import { AttackDropCue } from "./AttackDropCue.tsx";
import { CLIP_DIAMOND } from "./constants.ts";
import { PlayZoneCardBands } from "./PlayZoneCardBands.tsx";
import {
  encodeGundamAttackTarget,
  encodeGundamAttackUnitSource,
  encodeGundamBattleAreaTarget,
  encodeGundamPilotTarget,
  type GundamAttackUnitDragSource,
  useGundamDragCommands,
  useGundamDragState,
} from "./gundam-drag-drop-context.tsx";
import { gundamAnimationEntityForCard } from "../../../animation/gundamAnimationVisual.tsx";

const PAIRED_PILOT_PEEK_RATIO = 0.3;
const PAIRED_PILOT_UNIT_COVER_RATIO = 0.08;
const SCROLL_EPSILON = 2;

interface HorizontalOverflowState {
  readonly before: boolean;
  readonly after: boolean;
}

const EMPTY_HORIZONTAL_OVERFLOW: HorizontalOverflowState = { before: false, after: false };

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
  /** Legal Unit ids keyed by the Pilot currently being dragged from hand. */
  readonly pilotDropTargetIds?: ReadonlyMap<string, readonly string[]>;
  /** Legal Unit ids that also satisfy the dragged Pilot's Link Condition. */
  readonly pilotLinkTargetIds?: ReadonlyMap<string, readonly string[]>;
  readonly attackDragSources?: ReadonlyMap<string, GundamAttackUnitDragSource>;
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
  pilotDropTargetIds,
  pilotLinkTargetIds,
  attackDragSources,
  isTurn = false,
  isPriority = false,
  className,
}: PlayZoneProps) {
  const isTop = side === "top";
  const layout = useLayoutMode();
  const compactLandscape = useCompactLandscapeViewport();
  const mobileLaneRef = useRef<HTMLDivElement>(null);
  const desktopLaneRef = useRef<HTMLDivElement>(null);
  const [mobileOverflow, setMobileOverflow] =
    useState<HorizontalOverflowState>(EMPTY_HORIZONTAL_OVERFLOW);
  const [desktopOverflow, setDesktopOverflow] =
    useState<HorizontalOverflowState>(EMPTY_HORIZONTAL_OVERFLOW);
  const selectedCardSet = new Set(selectedCardIds);
  const canAcceptDrop = Boolean(onCardDrop);
  const activeSource = useGundamDragState();
  const { registerCardDropHandler } = useGundamDragCommands();
  const animationZoneId = `battleArea:${playerId ?? side}`;
  const setAnimationZoneRef = useAnimationNode(
    { kind: "zone", id: animationZoneId, ownerId: playerId ?? side },
    {
      zoneId: animationZoneId,
      density: layout === "mobile" ? "mini" : "normal",
      presence: "present",
    },
  );
  const dropTargetId = encodeGundamBattleAreaTarget({
    type: "battle-area",
    playerId: playerId ?? side,
  });
  const { isOver, setNodeRef } = useDroppable({ id: dropTargetId, disabled: !canAcceptDrop });
  const setPlayZoneRef = useCallback(
    (node: HTMLDivElement | null) => {
      setNodeRef(node);
      setAnimationZoneRef(node);
    },
    [setAnimationZoneRef, setNodeRef],
  );
  const isDragOver = canAcceptDrop && activeSource?.type === "hand-card" && isOver;
  const readOverflow = useCallback((scroller: HTMLDivElement | null): HorizontalOverflowState => {
    if (!scroller) return EMPTY_HORIZONTAL_OVERFLOW;
    const maxScrollLeft = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
    if (maxScrollLeft <= SCROLL_EPSILON) return EMPTY_HORIZONTAL_OVERFLOW;
    return {
      before: scroller.scrollLeft > SCROLL_EPSILON,
      after: scroller.scrollLeft < maxScrollLeft - SCROLL_EPSILON,
    };
  }, []);
  const updateMobileOverflow = useCallback(() => {
    const next = readOverflow(mobileLaneRef.current);
    setMobileOverflow((current) =>
      current.before === next.before && current.after === next.after ? current : next,
    );
  }, [readOverflow]);
  const updateDesktopOverflow = useCallback(() => {
    const next = readOverflow(desktopLaneRef.current);
    setDesktopOverflow((current) =>
      current.before === next.before && current.after === next.after ? current : next,
    );
  }, [readOverflow]);
  const scrollLane = useCallback((lane: "mobile" | "desktop", direction: "start" | "end") => {
    const scroller = lane === "mobile" ? mobileLaneRef.current : desktopLaneRef.current;
    if (!scroller) return;
    scroller.scrollTo({
      left: direction === "start" ? 0 : scroller.scrollWidth,
      behavior: "smooth",
    });
  }, []);
  useEffect(() => {
    if (!onCardDrop) return;
    return registerCardDropHandler(onCardDrop);
  }, [onCardDrop, registerCardDropHandler]);
  useEffect(() => {
    const scroller = layout === "mobile" ? mobileLaneRef.current : desktopLaneRef.current;
    const update = layout === "mobile" ? updateMobileOverflow : updateDesktopOverflow;
    if (!scroller) return;

    let frame: number | null = null;
    const scheduleUpdate = () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        frame = null;
        update();
      });
    };

    update();
    scroller.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(scheduleUpdate);
    observer?.observe(scroller);
    const lane = scroller.firstElementChild;
    if (lane instanceof HTMLElement) observer?.observe(lane);

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      scroller.removeEventListener("scroll", update);
      window.removeEventListener("resize", scheduleUpdate);
      observer?.disconnect();
    };
  }, [layout, play.length, updateDesktopOverflow, updateMobileOverflow]);
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
    // full-width six-slot lane. Players can swipe when the known Unit capacity
    // exceeds the viewport rather than shrinking card faces into thumbnails.
    return (
      <div
        ref={setPlayZoneRef}
        className={cn(
          "flex-1 min-h-0 min-w-0 flex flex-col relative border-y border-hud-border/20",
          className,
        )}
        data-sim-zone-id={playerId ? `battleArea:${playerId}` : undefined}
        data-seat-row="field"
        data-turn={isTurn ? "true" : "false"}
        data-priority={isPriority ? "true" : "false"}
        style={zoneVars}
        {...dropProps}
      >
        <div
          ref={mobileLaneRef}
          className={cn(
            "relative flex-1 px-3 py-2 overflow-x-auto overflow-y-visible",
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden touch-pan-x justify-start",
          )}
        >
          <AnimatedEntityCollection>
            <FixedSlotCardZone
              capacity={6}
              items={play}
              layout="row"
              showEmptySlots={false}
              ariaLabel="Battle area. Six Unit slots. Swipe to view all slots."
              className={cn(
                "h-full w-max min-w-0 gap-2",
                compactLandscape ? "items-start" : "items-center",
              )}
              slotClassName={cn(
                "flex flex-none justify-center",
                compactLandscape ? "h-auto w-[68px] items-start" : "h-full w-[92px] items-center",
              )}
              emptySlotClassName="border border-dashed border-hud-border/35 bg-hud-deep/15"
              renderEmptySlot={(index) => (
                <span
                  className="font-mono text-hud-2xs font-bold tracking-hud-label text-hud-text-faint"
                  aria-hidden
                >
                  {index + 1}
                </span>
              )}
              renderItem={(c, i) => {
                const handleClick = c.id && onCardClick ? () => onCardClick(c.id!) : undefined;
                const attackSource = c.id ? attackDragSources?.get(c.id) : undefined;
                return (
                  <AnimatedEntitySlot
                    key={c.id ?? i}
                    entity={gundamAnimationEntityForCard(c, playerId ?? side)}
                    zoneRef={{
                      kind: "zone",
                      id: `battleArea:${playerId ?? side}`,
                      ownerId: playerId ?? side,
                    }}
                    density="normal"
                    className="play-slot flex-none"
                  >
                    <AttackDragDropCard
                      card={c}
                      source={attackSource}
                      onActivate={handleClick}
                      pilotDropTargetIds={pilotDropTargetIds}
                      pilotLinkTargetIds={pilotLinkTargetIds}
                    >
                      <PairedUnitStack
                        card={c}
                        side={side}
                        ownerId={playerId ?? side}
                        size={compactLandscape ? "micro" : "tiny"}
                        onCardClick={attackSource ? undefined : handleClick}
                        selected={c.id !== undefined && selectedCardSet.has(c.id)}
                        highlight={c.id !== undefined && highlightCardIds.includes(c.id)}
                        hideStatBadges={false}
                        hideSupplementalBadges={false}
                      />
                    </AttackDragDropCard>
                  </AnimatedEntitySlot>
                );
              }}
            />
          </AnimatedEntityCollection>
        </div>
        {mobileOverflow.before ? (
          <button
            type="button"
            onClick={() => scrollLane("mobile", "start")}
            className="absolute left-0 top-1/2 z-[3] grid h-14 w-[1.9rem] -translate-y-1/2 place-items-center rounded-full border border-hud-border/25 bg-hud-deep/90 font-display text-hud-lg text-hud-accent transition-colors hover:border-hud-info focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hud-info"
            aria-label="Scroll battle area to first slot"
          >
            ‹
          </button>
        ) : null}
        {mobileOverflow.after ? (
          <button
            type="button"
            onClick={() => scrollLane("mobile", "end")}
            className="absolute right-0 top-1/2 z-[3] grid h-14 w-[1.9rem] -translate-y-1/2 place-items-center rounded-full border border-hud-border/25 bg-hud-deep/90 font-display text-hud-lg text-hud-accent transition-colors hover:border-hud-info focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hud-info"
            aria-label="Scroll battle area to last slot"
          >
            ›
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div
      ref={setPlayZoneRef}
      className={cn(
        "z-[1] flex-1 min-h-[232px] px-3 py-1 relative flex items-stretch gap-3",
        className,
      )}
      data-sim-zone-id={playerId ? `battleArea:${playerId}` : undefined}
      data-seat-row="field"
      style={zoneVars}
      {...dropProps}
    >
      <div className="relative flex-1 min-w-0 flex items-center">
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

        {desktopOverflow.before ? (
          <button
            type="button"
            onClick={() => scrollLane("desktop", "start")}
            className="absolute left-0 top-1/2 z-[3] grid h-14 w-[1.9rem] -translate-y-1/2 place-items-center rounded-full border border-hud-border/25 bg-hud-deep/90 font-display text-hud-lg text-hud-accent transition-colors hover:border-hud-info focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hud-info"
            aria-label="Scroll battle area to first slot"
          >
            ‹
          </button>
        ) : null}
        {desktopOverflow.after ? (
          <button
            type="button"
            onClick={() => scrollLane("desktop", "end")}
            className="absolute right-0 top-1/2 z-[3] grid h-14 w-[1.9rem] -translate-y-1/2 place-items-center rounded-full border border-hud-border/25 bg-hud-deep/90 font-display text-hud-lg text-hud-accent transition-colors hover:border-hud-info focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hud-info"
            aria-label="Scroll battle area to last slot"
          >
            ›
          </button>
        ) : null}

        <div
          ref={desktopLaneRef}
          onScroll={updateDesktopOverflow}
          aria-label="Scroll horizontally through battle area slots"
          className="min-w-0 flex-1 flex-nowrap overflow-x-auto overflow-y-hidden px-3 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          data-play-zone-card-lane
          tabIndex={0}
        >
          <AnimatedEntityCollection>
            <FixedSlotCardZone
              capacity={6}
              items={play}
              showEmptySlots={false}
              ariaLabel="Battle area. Six Unit slots. Scroll horizontally to view all slots."
              className="h-full w-max min-w-0 items-center"
              slotClassName="flex h-full w-[176px] min-w-[176px] items-center justify-center"
              emptySlotClassName="border border-dashed border-hud-border/35 bg-hud-deep/15"
              renderEmptySlot={(index) => (
                <span
                  className="font-mono text-[8px] font-bold tracking-hud-label text-hud-text-faint"
                  aria-hidden
                >
                  {index + 1}
                </span>
              )}
              renderItem={(c, i) => {
                const handleClick = c.id && onCardClick ? () => onCardClick(c.id!) : undefined;
                const attackSource = c.id ? attackDragSources?.get(c.id) : undefined;
                // The full field owns every pixel of its cards. `small-plus`
                // is taller than the available field once a rested Unit and
                // its status band are considered, which made cards cross into
                // the combat core. A uniform small face keeps all six slots
                // readable and safely contained; overflow is handled by the
                // edge controls rather than by stacking cards.
                const desktopCardSize = "small";
                const slotVars = getPlaySlotVars(c, desktopCardSize);
                if (!bandsEnabled) {
                  return (
                    <AnimatedEntitySlot
                      key={c.id ?? i}
                      entity={gundamAnimationEntityForCard(c, playerId ?? side)}
                      zoneRef={{
                        kind: "zone",
                        id: `battleArea:${playerId ?? side}`,
                        ownerId: playerId ?? side,
                      }}
                      density="normal"
                    >
                      <AttackDragDropCard
                        card={c}
                        source={attackSource}
                        onActivate={handleClick}
                        pilotDropTargetIds={pilotDropTargetIds}
                        pilotLinkTargetIds={pilotLinkTargetIds}
                      >
                        {renderUnitNode({
                          card: c,
                          size: "small",
                          selected: c.id !== undefined && selectedCardSet.has(c.id),
                          highlight: c.id !== undefined && highlightCardIds.includes(c.id),
                          hideStatBadges: bandsEnabled,
                          hideSupplementalBadges: bandsEnabled,
                          onCardClick: attackSource ? undefined : handleClick,
                        })}
                      </AttackDragDropCard>
                    </AnimatedEntitySlot>
                  );
                }
                return (
                  <AnimatedEntitySlot
                    key={c.id ?? i}
                    entity={gundamAnimationEntityForCard(c, playerId ?? side)}
                    zoneRef={{
                      kind: "zone",
                      id: `battleArea:${playerId ?? side}`,
                      ownerId: playerId ?? side,
                    }}
                    density="normal"
                    className="play-slot flex-none"
                    style={slotVars}
                  >
                    <PlayZoneCardBands card={c} section="top" />
                    <AttackDragDropCard
                      card={c}
                      source={attackSource}
                      onActivate={handleClick}
                      pilotDropTargetIds={pilotDropTargetIds}
                      pilotLinkTargetIds={pilotLinkTargetIds}
                    >
                      <PairedUnitStack
                        card={c}
                        side={side}
                        ownerId={playerId ?? side}
                        size={desktopCardSize}
                        onCardClick={attackSource ? undefined : handleClick}
                        selected={c.id !== undefined && selectedCardSet.has(c.id)}
                        highlight={c.id !== undefined && highlightCardIds.includes(c.id)}
                        hideStatBadges={bandsEnabled}
                        hideSupplementalBadges={bandsEnabled}
                      />
                    </AttackDragDropCard>
                    <PlayZoneCardBands card={c} section="bottom" />
                  </AnimatedEntitySlot>
                );
              }}
            />
          </AnimatedEntityCollection>
        </div>
      </div>
    </div>
  );
}

function AttackDragDropCard({
  card,
  source,
  onActivate,
  pilotDropTargetIds,
  pilotLinkTargetIds,
  children,
}: {
  readonly card: GameCardData;
  readonly source?: GundamAttackUnitDragSource;
  readonly onActivate?: () => void;
  readonly pilotDropTargetIds?: ReadonlyMap<string, readonly string[]>;
  readonly pilotLinkTargetIds?: ReadonlyMap<string, readonly string[]>;
  readonly children: ReactNode;
}) {
  const activeSource = useGundamDragState();
  const isLegalPilotTarget =
    activeSource?.type === "hand-card" &&
    (activeSource.card.cardType === "pilot" || activeSource.card.cardType === "command") &&
    card.id !== undefined &&
    pilotDropTargetIds?.get(activeSource.cardId)?.includes(card.id) === true;
  const isLegalAttackTarget =
    activeSource?.type === "attack-unit" &&
    card.id !== undefined &&
    activeSource.legalTargetIds.includes(card.id);
  const isLinkPilotTarget =
    isLegalPilotTarget &&
    card.id !== undefined &&
    pilotLinkTargetIds
      ?.get(activeSource?.type === "hand-card" ? activeSource.cardId : "")
      ?.includes(card.id) === true;
  const targetId = encodeGundamAttackTarget({
    type: "attack-target",
    targetId: card.id ?? "unavailable",
  });
  const pilotTargetId = encodeGundamPilotTarget({
    type: "pilot-target",
    unitId: card.id ?? "unavailable",
  });
  const targetNode = (
    <PointerDroppable
      id={pilotTargetId}
      disabled={!isLegalPilotTarget}
      className="relative"
      data-pilot-drop-candidate={isLegalPilotTarget ? "true" : undefined}
      data-pilot-link-candidate={isLinkPilotTarget ? "true" : undefined}
    >
      {({ isOver: isPilotOver }) => (
        <PointerDroppable
          id={targetId}
          disabled={!isLegalAttackTarget}
          className="relative"
          data-attack-drop-candidate={isLegalAttackTarget ? "true" : undefined}
        >
          {({ isOver: isAttackOver }) => (
            <>
              {children}
              {isLegalAttackTarget ? (
                <AttackDropCue
                  variant="unit"
                  isOver={isAttackOver}
                  label={`Attack ${card.name}`}
                  testId={`attack-drop-label-${card.id}`}
                />
              ) : null}
              {isLegalPilotTarget ? (
                <AttackDropCue
                  variant="pilot"
                  isOver={isPilotOver}
                  linkEligible={isLinkPilotTarget}
                  label={isPilotOver ? "Release to pair" : `Pair with ${card.name}`}
                  testId={`pilot-drop-label-${card.id}`}
                />
              ) : null}
            </>
          )}
        </PointerDroppable>
      )}
    </PointerDroppable>
  );

  if (!source) return targetNode;

  return (
    <PointerDraggable
      id={encodeGundamAttackUnitSource(source)}
      transformBehavior="overlay-only"
      className="relative touch-none data-[dragging=true]:opacity-40"
      aria-label={`${card.name} actions; drag to attack`}
      onClick={(event) => {
        if (event.target !== event.currentTarget || !onActivate) return;
        event.currentTarget.querySelector<HTMLElement>("[data-sim-entity-id]")?.click();
      }}
      onKeyDownCapture={(event) => {
        if (event.key !== "Enter" || !onActivate) return;
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.querySelector<HTMLElement>("[data-sim-entity-id]")?.click();
      }}
      data-testid={`attack-drag-source-${source.cardId}`}
    >
      {targetNode}
    </PointerDraggable>
  );
}

interface PairedUnitStackProps {
  readonly card: GameCardData;
  readonly side: SeatSide;
  readonly ownerId: string;
  readonly size: "small" | "small-plus" | "tiny" | "micro";
  readonly onCardClick?: () => void;
  readonly selected: boolean;
  readonly highlight: boolean;
  readonly hideStatBadges: boolean;
  readonly hideSupplementalBadges: boolean;
}

function getPairedPilotMetrics(size: "small" | "small-plus" | "tiny" | "micro"): {
  readonly peekPx: number;
  readonly unitCoverPx: number;
} {
  const cardHeightPx = CARD_IMAGE_DIMENSIONS.full.height * CARD_SIZE_SCALES[size];
  const unitCoverPx = Math.round(cardHeightPx * PAIRED_PILOT_UNIT_COVER_RATIO);
  const peekPx = Math.max(Math.round(cardHeightPx * PAIRED_PILOT_PEEK_RATIO), unitCoverPx + 44);
  return {
    peekPx,
    unitCoverPx,
  };
}

function getPlaySlotVars(
  card: GameCardData,
  size: "small" | "small-plus" | "tiny" | "micro",
): CSSProperties & Record<string, string> {
  if (!card.pairedPilot) return {};

  const { peekPx, unitCoverPx } = getPairedPilotMetrics(size);
  const statBottomOffsetPx = Math.max(0, peekPx - unitCoverPx);
  return {
    "--play-slot-stat-bottom-offset": `${statBottomOffsetPx}px`,
  };
}

/**
 * Renders a unit card over its paired pilot, matching the physical Gundam
 * pairing convention. The pilot's lower strip remains visible beneath the
 * unit for both seats so its name, portrait, and bonus stats stay readable.
 * Cards without a paired pilot render as a plain GameCard.
 *
 * The exposed pilot strip is clickable + hoverable as a distinct card so
 * the player can inspect the pilot independently — `data-card-id` lets
 * the global hover preview and right-click inspect resolve to the pilot
 * rather than the unit.
 */
function PairedUnitStack({
  card,
  ownerId,
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

  // Scale the lower strip with the card, keeping at least 44px exposed after
  // the unit overlap so the Pilot remains a usable touch target.
  const { peekPx, unitCoverPx } = getPairedPilotMetrics(size);

  return (
    <div
      className="relative"
      data-paired-pilot-stack
      style={{
        // Reserve the exposed lower strip so adjacent rows do not collide
        // with the pilot's name, portrait, and bonus-stat area.
        marginBottom: peekPx,
      }}
    >
      {/* Pilot card sits behind (z-index 0) the unit, vertically shifted
       * into the reserved lower strip. */}
      <AnimatedEntitySlot
        className="absolute left-1/2 -translate-x-1/2 pointer-events-auto"
        data-paired-pilot-card
        entity={gundamAnimationEntityForCard(card.pairedPilot, ownerId)}
        zoneRef={{ kind: "zone", id: `battleArea:${ownerId}`, ownerId }}
        density={size === "micro" ? "mini" : "normal"}
        style={{
          zIndex: 0,
          top: `${peekPx}px`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <GameCard {...card.pairedPilot} size={size} hideSupplementalBadges />
      </AnimatedEntitySlot>
      <div className="relative" style={{ zIndex: 1 }}>
        <div data-paired-unit-card style={{ transform: `translateY(${unitCoverPx}px)` }}>
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
}: Omit<PairedUnitStackProps, "side" | "ownerId">) {
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
