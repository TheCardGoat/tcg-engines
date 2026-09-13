import { useCallback, useEffect, useState, type ReactNode } from "react";

import { AnimatedZoneSlot, ResourceCardZone, useAnimationNode } from "@tcg/simulator-ui";
import type { SimulatorEntity, SimulatorZone } from "@tcg/simulator-contract";

import { m } from "../../../lib/i18n/messages.ts";
import { useLayoutMode } from "../../../lib/use-layout-mode.ts";
import { cn } from "../../../lib/utils.ts";
import { GameCard } from "../GameCard.tsx";
import { CardBack } from "../card/CardBack.tsx";
import { toSimulatorEntity, toSimulatorZone } from "../card/to-simulator-entity.ts";
import type { GameCardData, PlayerInfo } from "../types.ts";
import type { SeatSide } from "./PlayerSeat.tsx";
import { TrashCardModal } from "./TrashCardModal.tsx";
import { ZoneCardModal } from "./ZoneCardModal.tsx";

function isResourceRested(card: GameCardData, index: number, availableResources: number) {
  return card.exerted ?? index >= availableResources;
}

interface ResourceAreaRowProps {
  readonly side: SeatSide;
  readonly player: PlayerInfo;
  readonly resourceArea: readonly GameCardData[];
  readonly discard: readonly GameCardData[];
  readonly removalArea?: readonly GameCardData[];
  readonly availableResources: number;
  readonly selectedCardIds?: readonly string[];
  readonly highlightCardIds?: readonly string[];
  readonly onResourceCardClick?: (cardId: string) => void;
  readonly utilityColumn: ReactNode;
  readonly className?: string;
}

export function ResourceAreaRow({
  side,
  player,
  resourceArea,
  discard,
  removalArea = [],
  availableResources,
  selectedCardIds = [],
  highlightCardIds = [],
  onResourceCardClick,
  utilityColumn,
  className,
}: ResourceAreaRowProps) {
  const isTop = side === "top";
  const layoutMode = useLayoutMode();
  // `useLayoutMode` intentionally treats a very short viewport as mobile so
  // the battlefield can preserve its vertical interaction budget. The utility
  // row is horizontal, though: a wide, short desktop viewport still has room
  // for its desktop compact columns. Using the height-derived mode here made
  // those windows use the phone grid and let the deck layers collide.
  const [isNarrowViewport, setIsNarrowViewport] = useState(false);
  useEffect(() => {
    const update = () => setIsNarrowViewport(window.innerWidth <= 767);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  // Match the server's first render, then measure after hydration. A stable
  // initial tree avoids regenerating the entire resource row on narrow clients.
  const [hasWideCombatViewport, setHasWideCombatViewport] = useState(true);
  useEffect(() => {
    const update = () => setHasWideCombatViewport(window.innerWidth >= 1280);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  // The match sidebar can leave substantially less horizontal room than the
  // viewport breakpoint suggests. Keep this core in its scrollable compact
  // form until all three priority panels can sit side by side without clipping.
  const isCompactLayout = layoutMode !== "desktop" || !hasWideCombatViewport;
  const isMobileLayout = isNarrowViewport;
  const playerId = player.name;
  const resourceZoneId = `resourceArea:${playerId}`;
  const setResourceAnchorRef = useAnimationNode(
    { kind: "anchor", id: resourceZoneId },
    {
      zoneId: resourceZoneId,
      density: "compact",
      presence: "present",
    },
  );
  const setCompactResourceZoneRef = useAnimationNode(
    { kind: "zone", id: resourceZoneId, ownerId: playerId },
    {
      zoneId: resourceZoneId,
      density: "compact",
      presence: "present",
    },
  );
  const setCompactResourceAreaRef = useCallback(
    (node: HTMLElement | null) => {
      setResourceAnchorRef(node);
      setCompactResourceZoneRef(node);
    },
    [setCompactResourceZoneRef, setResourceAnchorRef],
  );
  const selectedCardSet = new Set(selectedCardIds);
  const highlightedCardSet = new Set(highlightCardIds);
  const resourceEntities = resourceArea.map((card, index) =>
    toSimulatorEntity(
      isResourceRested(card, index, availableResources) && !card.exerted
        ? { ...card, exerted: true }
        : card,
      {
        zoneId: resourceZoneId,
        entityIdSuffix: index,
      },
    ),
  );
  const resourceZone = toSimulatorZone(
    resourceZoneId,
    m["sim.seat.resources.readyLevel"](),
    resourceEntities.map((entity) => entity.id),
    {
      role: "resource",
      count: resourceArea.length,
      layoutHint: "row",
    },
  );
  const mobileTargetResources = resourceArea.flatMap((card, index) => {
    if (!card.id || (!selectedCardSet.has(card.id) && !highlightedCardSet.has(card.id))) {
      return [];
    }
    return [{ card, cardId: card.id, index }];
  });
  const resourceTargeting = mobileTargetResources.length > 0;

  if (isCompactLayout) {
    const baseAndShieldsPanel = (
      <div
        key="base-and-shields"
        className={cn(
          "min-h-[90px] min-w-0 overflow-hidden border border-hud-accent/55 bg-hud-deep/75 shadow-[0_4px_14px_rgba(0,0,0,.24)]",
          isTop && "col-start-3",
        )}
        data-zone-group="base-and-shields"
      >
        {utilityColumn}
      </div>
    );
    const resourcePanel =
      mobileTargetResources.length > 0 && onResourceCardClick ? (
        <MobileResourceTargetStrip
          key="resources"
          side={side}
          playerId={playerId}
          resources={mobileTargetResources}
          availableResources={availableResources}
          totalResources={resourceArea.length}
          selectedCardIds={selectedCardSet}
          onResourceCardClick={onResourceCardClick}
          className="col-start-2 row-start-1 h-full min-h-[90px] min-w-0 border border-hud-accent/55 bg-hud-deep/75"
        />
      ) : (
        <CombatResourceCore
          key="resources"
          playerId={playerId}
          resourceArea={resourceArea}
          availableResources={availableResources}
          resourceDeckCount={player.resourceDeck ?? 0}
          compact
          narrow={isMobileLayout}
        />
      );
    const pilesPanel = (
      <CombatPilesCore
        key="piles"
        playerId={playerId}
        deckCount={player.deck ?? 0}
        trashCount={player.discard ?? 0}
        discard={discard}
        removalArea={removalArea}
        compact
        narrow={isMobileLayout}
        className={isTop ? "col-start-1" : undefined}
      />
    );

    return (
      <div
        ref={setCompactResourceAreaRef}
        data-seat-row="resources"
        className={cn(
          "grid min-h-[100px] min-w-0 flex-shrink-0 items-stretch gap-1 overflow-hidden border-y border-hud-border/25 bg-hud-deep/45 px-1 py-1",
          isMobileLayout
            ? isTop
              ? "grid-cols-[minmax(76px,.8fr)_minmax(80px,.9fr)_minmax(148px,1.4fr)]"
              : "grid-cols-[minmax(148px,1.4fr)_minmax(80px,.9fr)_minmax(76px,.8fr)]"
            : isTop
              ? "grid-cols-[220px_minmax(0,1fr)_228px]"
              : "grid-cols-[228px_minmax(0,1fr)_220px]",
          className,
        )}
      >
        {isTop
          ? [pilesPanel, resourcePanel, baseAndShieldsPanel]
          : [baseAndShieldsPanel, resourcePanel, pilesPanel]}
      </div>
    );
  }

  const factionTint = isTop
    ? "linear-gradient(180deg, oklch(0.28 0.075 350 / .9), oklch(0.2 0.035 268 / .94))"
    : "linear-gradient(0deg, oklch(0.28 0.09 255 / .9), oklch(0.2 0.035 268 / .94))";
  const baseAndShieldsPanel = (
    <div
      key="base-and-shields"
      className={cn(
        "row-start-1 h-full min-h-[60px] w-full overflow-hidden border border-hud-accent/55 bg-hud-deep/75 shadow-[0_4px_14px_rgba(0,0,0,.24)]",
        isTop ? "col-start-3" : "col-start-1",
      )}
      data-zone-group="base-and-shields"
    >
      {utilityColumn}
    </div>
  );
  const resourcePanel = (
    <CombatResourceCore
      key="resources"
      playerId={playerId}
      resourceArea={resourceArea}
      availableResources={availableResources}
      resourceDeckCount={player.resourceDeck ?? 0}
      resourceZone={resourceZone}
      resourceEntities={resourceEntities}
      selectedCardSet={selectedCardSet}
      highlightedCardSet={highlightedCardSet}
      onResourceCardClick={onResourceCardClick}
      setResourceAnchorRef={setResourceAnchorRef}
    />
  );
  const pilesPanel = (
    <CombatPilesCore
      key="piles"
      playerId={playerId}
      deckCount={player.deck ?? 0}
      trashCount={player.discard ?? 0}
      discard={discard}
      removalArea={removalArea}
      className={isTop ? "col-start-1" : undefined}
    />
  );

  return (
    <div
      data-seat-row="resources"
      className={cn(
        "relative grid items-stretch gap-1 overflow-hidden px-1 py-1",
        isTop
          ? "grid-cols-[220px_minmax(320px,1fr)_228px]"
          : "grid-cols-[228px_minmax(320px,1fr)_220px]",
        resourceTargeting ? "min-h-[96px]" : "min-h-[68px]",
        className,
      )}
      style={{
        background: factionTint,
        borderBottom: isTop ? "1px solid rgba(45,107,255,.25)" : "none",
        borderTop: isTop ? "none" : "1px solid rgba(45,107,255,.25)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(90deg, transparent 0 40px, oklch(0.74 .1 255 / .06) 40px 41px)",
        }}
      />
      {isTop
        ? [pilesPanel, resourcePanel, baseAndShieldsPanel]
        : [baseAndShieldsPanel, resourcePanel, pilesPanel]}
    </div>
  );
}

interface CombatResourceCoreProps {
  readonly playerId: string;
  readonly resourceArea: readonly GameCardData[];
  readonly availableResources: number;
  readonly resourceDeckCount: number;
  readonly compact?: boolean;
  /** Phone-width compact rows reserve space for the resource-deck stack. */
  readonly narrow?: boolean;
  readonly resourceZone?: SimulatorZone;
  readonly resourceEntities?: readonly SimulatorEntity[];
  readonly selectedCardSet?: ReadonlySet<string>;
  readonly highlightedCardSet?: ReadonlySet<string>;
  readonly onResourceCardClick?: (cardId: string) => void;
  readonly setResourceAnchorRef?: (node: HTMLDivElement | null) => void;
}

function CombatResourceCore({
  playerId,
  resourceArea,
  availableResources,
  resourceDeckCount,
  compact = false,
  narrow = false,
  resourceZone,
  resourceEntities = [],
  selectedCardSet = new Set(),
  highlightedCardSet = new Set(),
  onResourceCardClick,
  setResourceAnchorRef,
}: CombatResourceCoreProps) {
  const [open, setOpen] = useState(false);
  const targeting = resourceArea.some(
    (card) => card.id && (selectedCardSet.has(card.id) || highlightedCardSet.has(card.id)),
  );

  if (targeting && resourceZone) {
    return (
      <>
        <ResourceCardZone
          zone={resourceZone}
          entities={[...resourceEntities]}
          entityCount={resourceArea.length}
          availableCount={availableResources}
          label={m["sim.seat.resources.readyLevel"]()}
          emptyLabel={m["sim.seat.resources.empty"]()}
          showEmptyState={false}
          anchorId={`resourceArea:${playerId}`}
          resourceAnchorId={playerId}
          elementRef={setResourceAnchorRef}
          selectedIds={selectedCardSet}
          highlightedIds={highlightedCardSet}
          zoneSlotClassName="col-start-2 row-start-1 min-w-0"
          className="h-full min-h-[96px] w-full !border-hud-accent/55 !bg-hud-deep/75 !p-1 text-hud-text"
          rowClassName="flex h-full w-max !min-w-full items-center !justify-start gap-1 pl-3 pr-12 leading-none"
          counterClassName="!left-auto !right-1.5 !top-1 !border-hud-accent/45 !bg-hud-deep/90 !px-1.5 !py-0.5 leading-normal text-hud-2xs tracking-hud-label !text-hud-accent-hot [&>span]:hidden [&_strong]:font-bold"
          entityClassName={(_entity, state) => cn("leading-none", state.rested && "opacity-45")}
          renderEntity={(_entity, state) => {
            const card = resourceArea[state.index]!;
            const cardId = card.id;
            return (
              <GameCard
                {...card}
                selected={state.selected}
                highlight={state.highlighted}
                size="micro"
                onClick={
                  cardId && onResourceCardClick ? () => onResourceCardClick(cardId) : undefined
                }
              />
            );
          }}
        />
        <ResourceDeckSemantics playerId={playerId} count={resourceDeckCount} />
      </>
    );
  }

  if (compact) {
    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(true)}
          data-sim-primary-click-owner="zone"
          data-sim-zone-id={`resourceArea:${playerId}`}
          data-sim-resource-anchor-id={playerId}
          className="gd-compact-resource-panel group relative col-start-2 row-start-1 h-full min-h-[90px] min-w-0 overflow-hidden border border-hud-border bg-hud-deep/75 text-left text-hud-text shadow-[0_4px_14px_rgba(0,0,0,.24)] transition-colors hover:border-hud-info focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hud-info"
          aria-haspopup="dialog"
          aria-label={`${m["sim.seat.resources.readyLevel"]()}: level ${resourceArea.length}, ${availableResources} ready`}
        >
          <span
            className={cn(
              "gd-resource-level absolute left-1.5 top-1 z-[1] rounded-sm border border-hud-border/60 bg-hud-deep/95 px-1.5 py-0.5 font-mono text-[length:var(--text-hud-xs)] font-bold uppercase tracking-normal text-hud-text",
              narrow && "hidden",
            )}
          >
            {m["sim.seat.resources.level"]()} {resourceArea.length}
          </span>
          <span
            className={cn(
              "absolute top-1 z-[1] rounded-sm border border-hud-info/50 bg-hud-deep/95 px-1.5 py-0.5 font-mono font-bold uppercase tracking-normal text-hud-info",
              narrow
                ? "left-1 text-[length:var(--text-hud-xl)]"
                : "right-1.5 text-[length:var(--text-hud-xs)]",
            )}
          >
            {narrow ? "" : `${m["sim.seat.resources.ready"]()} `}
            {availableResources}/{resourceArea.length}
          </span>
          <span
            className={cn(
              "absolute overflow-x-auto overflow-y-hidden [scrollbar-width:thin] [scrollbar-color:var(--color-hud-info)_transparent]",
              narrow ? "bottom-1 left-1 right-11 top-7" : "inset-1",
            )}
            role="list"
            aria-label={m["sim.seat.resources.readyLevel"]()}
          >
            <span className="flex h-full min-w-full w-max items-center justify-center gap-1 px-1">
              {resourceArea.map((card, index) => (
                <span
                  key={card.id ?? index}
                  role="listitem"
                  aria-label={`${isResourceRested(card, index, availableResources) ? m["sim.seat.resources.rested"]() : m["sim.seat.resources.ready"]()} Resource ${index + 1}`}
                  className="block h-[59px] w-[43px] flex-none"
                >
                  <ZoneAnimationCard
                    card={card}
                    zoneId={`resourceArea:${playerId}`}
                    scale={0.058}
                  />
                </span>
              ))}
            </span>
          </span>
        </button>
        <ZoneCardModal
          open={open}
          onOpenChange={setOpen}
          label={m["sim.seat.resources.label"]()}
          emptyLabel={m["sim.seat.resources.empty"]()}
          cards={resourceArea}
        />
        <ResourceDeckSemantics playerId={playerId} count={resourceDeckCount} />
      </>
    );
  }

  return (
    <>
      <AnimatedZoneSlot
        animationRef={{ kind: "zone", id: `resourceArea:${playerId}`, ownerId: playerId }}
        className="col-start-2 row-start-1 h-full min-h-[60px] min-w-0"
      >
        <div
          role="button"
          tabIndex={0}
          onClick={() => setOpen(true)}
          data-sim-primary-click-owner="zone"
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setOpen(true);
            }
          }}
          data-sim-zone-id={`resourceArea:${playerId}`}
          data-sim-resource-anchor-id={playerId}
          className={cn(
            "group relative col-start-2 row-start-1 min-w-0 border border-hud-border bg-hud-deep/75 text-left text-hud-text shadow-[0_4px_14px_rgba(0,0,0,.24)] transition-colors hover:border-hud-info focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hud-info",
            "flex h-full min-h-[60px] items-center justify-between gap-2 px-2",
          )}
        >
          <div className="flex min-w-0 flex-col gap-1">
            <span className="font-mono text-hud-2xs font-bold uppercase tracking-hud-label text-hud-text-dim">
              {m["sim.seat.resources.level"]()}
            </span>
            <strong
              className={cn(
                "font-display font-extrabold leading-none text-hud-text",
                "text-hud-xl",
              )}
            >
              {resourceArea.length}
            </strong>
          </div>
          <span className="h-7 w-px bg-hud-border/70" aria-hidden />
          <div className="flex min-w-0 flex-none flex-col gap-1">
            <div className="flex min-w-0 flex-col">
              <span className="font-mono text-hud-2xs font-bold uppercase tracking-hud-label text-hud-info">
                {m["sim.seat.resources.ready"]()}
              </span>
              <strong
                className={cn(
                  "font-display font-extrabold leading-none text-hud-accent-hot",
                  "text-hud-xl",
                )}
              >
                {availableResources}/{resourceArea.length}
              </strong>
            </div>
            <span
              className="flex gap-1"
              role="list"
              aria-label={m["sim.seat.resources.readyLevel"]()}
            >
              {resourceArea.slice(0, 6).map((card, index) => (
                <span
                  key={card.id ?? index}
                  role="listitem"
                  aria-label={`${isResourceRested(card, index, availableResources) ? m["sim.seat.resources.rested"]() : m["sim.seat.resources.ready"]()} Resource ${index + 1}`}
                  className={cn(
                    "size-2 rotate-45 border",
                    isResourceRested(card, index, availableResources)
                      ? "border-hud-border bg-hud-bg"
                      : "border-hud-info bg-hud-info shadow-[0_0_7px_rgba(45,107,255,.55)]",
                  )}
                />
              ))}
            </span>
          </div>
          {!compact ? (
            <span
              className={cn(
                "flex min-w-0 flex-1 items-center justify-start gap-1 overflow-hidden",
                "h-9 pl-3",
              )}
              aria-hidden
            >
              {resourceArea.slice(-3).map((card) => (
                <span key={card.id} className="block h-9 w-[26px] overflow-visible">
                  <ZoneAnimationCard
                    card={card}
                    zoneId={`resourceArea:${playerId}`}
                    scale={0.035}
                  />
                </span>
              ))}
            </span>
          ) : null}
          <span className="sr-only">{m["sim.seat.resources.readyLevel"]()}</span>
        </div>
      </AnimatedZoneSlot>
      <ZoneCardModal
        open={open}
        onOpenChange={setOpen}
        label={m["sim.seat.resources.label"]()}
        emptyLabel={m["sim.seat.resources.empty"]()}
        cards={resourceArea}
      />
      <ResourceDeckSemantics playerId={playerId} count={resourceDeckCount} />
    </>
  );
}

function ResourceDeckSemantics({
  playerId,
  count,
}: {
  readonly playerId: string;
  readonly count: number;
}) {
  const zoneId = `resourceDeck:${playerId}`;
  return (
    <button
      type="button"
      disabled
      data-sim-zone-id={zoneId}
      aria-label={m["sim.seat.resourceDeck.aria"]({ count })}
      className="relative col-start-2 row-start-1 z-10 mb-1 mr-1 h-[50px] w-[38px] self-end justify-self-end disabled:cursor-default"
    >
      <span aria-hidden className="relative block h-[48px] w-[35px]">
        {count > 0 ? (
          <>
            <span className="absolute left-0 top-1 opacity-45">
              <CardBack width={32} height={45} />
            </span>
            <span data-resource-deck-next-card className="absolute left-0.5 top-0.5">
              <CardBack width={32} height={45} />
            </span>
          </>
        ) : null}
        <AnimatedZoneSlot
          animationRef={{ kind: "zone", id: zoneId, ownerId: playerId }}
          className="absolute left-1 top-0 h-[45px] w-[32px]"
        >
          {count > 0 ? (
            <span data-resource-deck-animation-source className="block h-full w-full">
              <CardBack width={32} height={45} />
            </span>
          ) : (
            <span className="block h-full w-full border border-dashed border-hud-border/55 bg-hud-deep/30" />
          )}
        </AnimatedZoneSlot>
        <strong className="absolute bottom-0 right-0 z-10 min-w-4 rounded-sm border border-hud-border/70 bg-hud-deep/95 px-0.5 text-center font-mono text-[8px] font-bold leading-[13px] tabular-nums text-hud-text shadow-[0_1px_3px_rgba(0,0,0,.45)]">
          {count}
        </strong>
      </span>
    </button>
  );
}

function CombatPilesCore({
  playerId,
  deckCount,
  trashCount,
  discard,
  removalArea,
  compact = false,
  narrow = false,
  className,
}: {
  readonly playerId: string;
  readonly deckCount: number;
  readonly trashCount: number;
  readonly discard: readonly GameCardData[];
  readonly removalArea: readonly GameCardData[];
  readonly compact?: boolean;
  readonly narrow?: boolean;
  readonly className?: string;
}) {
  const [trashOpen, setTrashOpen] = useState(false);
  const [removalOpen, setRemovalOpen] = useState(false);
  const hasRemovalCards = removalArea.length > 0;
  return (
    <div
      className={cn(
        className ?? "col-start-3",
        "row-start-1 grid min-w-0 items-center border border-hud-border bg-hud-deep/75 p-1 text-hud-text shadow-[0_4px_14px_rgba(0,0,0,.24)]",
        hasRemovalCards ? (compact ? "grid-cols-2 grid-rows-2" : "grid-cols-3") : "grid-cols-2",
        compact ? "h-full min-h-[90px]" : "h-full min-h-[60px]",
      )}
      data-zone-group="piles"
    >
      <AnimatedZoneSlot
        animationRef={{ kind: "zone", id: `deck:${playerId}`, ownerId: playerId }}
        className="h-full w-full min-w-0 overflow-hidden"
      >
        <div
          data-sim-zone-id={`deck:${playerId}`}
          className={cn(
            "flex h-full w-full min-w-0 items-center justify-center gap-1",
            compact ? "relative flex-col" : "flex-row",
          )}
        >
          <span
            className={cn(
              "font-mono text-hud-2xs font-bold uppercase tracking-hud-label text-hud-text-dim",
              compact &&
                !narrow &&
                "pointer-events-none absolute left-1 top-1 z-[1] rounded-sm bg-hud-deep/90 px-1 text-[8px]",
              narrow && "text-hud-2xs tracking-normal",
            )}
          >
            {narrow ? "DECK" : m["sim.seat.deck.label"]()}
          </span>
          <strong
            className={cn(
              "font-display font-extrabold leading-none",
              narrow
                ? "text-hud-lg"
                : compact
                  ? "pointer-events-none absolute right-1 top-1 z-[1] text-hud-sm"
                  : "text-hud-xl",
            )}
          >
            {deckCount}
          </strong>
          {!compact ? <CardBack width={18} height={25} /> : null}
          {compact && !narrow && !hasRemovalCards ? (
            <span
              className="absolute inset-y-1 left-1/2 block h-[80px] w-[57px] -translate-x-1/2 overflow-visible"
              aria-hidden
            >
              <span className="absolute left-1 top-1 opacity-65">
                <CardBack width={57} height={80} />
              </span>
              <CardBack width={57} height={80} />
            </span>
          ) : null}
        </div>
      </AnimatedZoneSlot>
      <AnimatedZoneSlot
        animationRef={{ kind: "zone", id: `trash:${playerId}`, ownerId: playerId }}
        className="h-full w-full min-w-0 overflow-hidden"
      >
        <button
          type="button"
          data-sim-primary-click-owner="zone"
          onClick={() => discard.length > 0 && setTrashOpen(true)}
          disabled={discard.length === 0}
          data-sim-zone-id={`trash:${playerId}`}
          className={cn(
            "w-full min-w-0 border-l border-hud-border/70 disabled:cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hud-info",
            compact
              ? "relative flex h-full w-full flex-col items-center justify-center gap-1"
              : "flex h-full items-center justify-center gap-1",
          )}
        >
          <span
            className={cn(
              "font-mono text-hud-2xs font-bold uppercase tracking-hud-label text-hud-text-dim",
              compact &&
                !narrow &&
                "pointer-events-none absolute left-1 top-1 z-[1] rounded-sm bg-hud-deep/90 px-1 text-[8px]",
              narrow && "text-hud-2xs tracking-normal",
            )}
          >
            {m["sim.seat.discard.label"]()}
          </span>
          <strong
            className={cn(
              "font-display font-extrabold leading-none",
              narrow
                ? "text-hud-lg"
                : compact
                  ? "pointer-events-none absolute right-1 top-1 z-[1] text-hud-sm"
                  : "text-hud-xl",
            )}
            data-sim-animation-geometry={
              narrow || (compact && hasRemovalCards) || discard.length === 0 ? "" : undefined
            }
          >
            {trashCount}
          </strong>
          {!compact && discard.at(-1) ? (
            <span data-sim-animation-geometry className="block h-[25px] w-[18px]">
              <ZoneAnimationCard
                card={discard.at(-1)!}
                zoneId={`trash:${playerId}`}
                scale={0.024}
              />
            </span>
          ) : null}
          {compact && !narrow && !hasRemovalCards && discard.at(-1) ? (
            <span
              data-sim-animation-geometry
              className="absolute inset-y-1 left-1/2 block h-[80px] w-[57px] -translate-x-1/2 overflow-visible"
              aria-hidden
            >
              <span className="absolute left-1 top-1 opacity-65">
                <CardBack width={57} height={80} />
              </span>
              <ZoneAnimationCard
                card={discard.at(-1)!}
                zoneId={`trash:${playerId}`}
                scale={0.078}
              />
            </span>
          ) : null}
        </button>
      </AnimatedZoneSlot>
      {hasRemovalCards ? (
        <AnimatedZoneSlot
          animationRef={{ kind: "zone", id: `removalArea:${playerId}`, ownerId: playerId }}
          className={cn("min-w-0", compact && "col-span-2 border-t border-hud-border/70")}
        >
          <button
            type="button"
            onClick={() => setRemovalOpen(true)}
            data-sim-zone-id={`removalArea:${playerId}`}
            className="flex h-full w-full min-w-0 items-center justify-center gap-1 px-1 font-mono text-hud-2xs font-bold uppercase tracking-hud-label text-hud-accent-hot focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hud-info"
            aria-label={`${m["sim.seat.removal.label"]()}, ${removalArea.length} cards`}
          >
            <span className="truncate">{m["sim.seat.removal.label"]()}</span>
            <strong className="font-display text-hud-sm leading-none tabular-nums">
              {removalArea.length}
            </strong>
          </button>
        </AnimatedZoneSlot>
      ) : null}
      <TrashCardModal open={trashOpen} onOpenChange={setTrashOpen} cards={discard} />
      <ZoneCardModal
        open={removalOpen}
        onOpenChange={setRemovalOpen}
        label={m["sim.seat.removal.label"]()}
        emptyLabel={m["sim.seat.removal.empty"]()}
        cards={removalArea}
      />
    </div>
  );
}

interface MobileResourceTargetStripProps {
  readonly side: SeatSide;
  readonly playerId: string;
  readonly resources: readonly {
    readonly card: GameCardData;
    readonly cardId: string;
    readonly index: number;
  }[];
  readonly availableResources: number;
  readonly totalResources: number;
  readonly selectedCardIds: ReadonlySet<string>;
  readonly onResourceCardClick: (cardId: string) => void;
  readonly className?: string;
}

/**
 * During a mobile resource-targeting choice, temporarily replaces the
 * informational zone counters with direct, touch-sized target buttons. The
 * normal compact strip returns as soon as the pending choice resolves.
 */
function MobileResourceTargetStrip({
  side,
  playerId,
  resources,
  availableResources,
  totalResources,
  selectedCardIds,
  onResourceCardClick,
  className,
}: MobileResourceTargetStripProps) {
  const isTop = side === "top";

  return (
    <section
      role="region"
      aria-label={
        isTop
          ? m["sim.seat.resources.listLabelOpponent"]()
          : m["sim.seat.resources.listLabelSelf"]()
      }
      className={cn(
        "relative flex min-h-[48px] flex-shrink-0 items-stretch gap-1 overflow-hidden px-2 py-0.5 text-hud-text",
        className,
      )}
      style={{
        background: isTop
          ? "linear-gradient(180deg, oklch(0.34 0.08 350 / .56), oklch(0.21 0.03 268 / .9))"
          : "linear-gradient(0deg, oklch(0.34 0.09 255 / .62), oklch(0.21 0.03 268 / .9))",
        borderBottom: isTop ? "1px solid rgba(45,107,255,.18)" : "none",
        borderTop: isTop ? "none" : "1px solid rgba(45,107,255,.18)",
      }}
      data-sim-zone-id={`resourceArea:${playerId}`}
      data-sim-resource-anchor-id={playerId}
    >
      <div className="flex flex-none flex-col items-center justify-center px-1.5 font-mono uppercase tracking-hud-label">
        <span className="text-hud-2xs font-bold leading-none text-hud-text-dim">
          {m["sim.seat.resources.label"]()}
        </span>
        <span className="font-display text-hud-sm font-extrabold leading-none text-hud-accent-hot">
          {availableResources}/{totalResources}
        </span>
      </div>
      <div className="flex min-w-0 flex-1 items-stretch gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {resources.map(({ card, cardId, index }) => {
          const selected = selectedCardIds.has(cardId);
          const resourceLabel = card.name || m["sim.seat.resources.label"]();
          return (
            <button
              key={cardId}
              type="button"
              aria-label={`${resourceLabel} ${index + 1}, ${card.exerted ? "rested" : "active"}`}
              aria-pressed={selected}
              data-card-id={cardId}
              data-targeting-state={selected ? "selected" : "candidate"}
              onClick={() => onResourceCardClick(cardId)}
              className={cn(
                "flex min-h-[44px] min-w-12 flex-col items-center justify-center rounded-sm border px-1 font-mono text-hud-2xs font-bold uppercase leading-none tracking-hud-label transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1",
                selected
                  ? "border-hud-info bg-hud-info/25 text-hud-info focus-visible:outline-hud-info"
                  : "border-hud-accent-hot bg-white/85 text-hud-accent-hot shadow-[0_0_12px_rgba(255,190,35,.45)] focus-visible:outline-hud-accent-hot",
              )}
            >
              <span>{card.name === "EX Resource" ? "EX" : `R${index + 1}`}</span>
              <span className="mt-0.5 text-[6px] text-hud-text-faint">
                {card.exerted ? "REST" : "READY"}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

/** Register the visible card, rather than the surrounding counters and labels. */
function ZoneAnimationCard({
  card,
  zoneId,
  scale,
}: {
  readonly card: GameCardData;
  readonly zoneId: string;
  readonly scale: number;
}) {
  const entity = toSimulatorEntity(card, { zoneId });
  const ref = useAnimationNode(
    { kind: "entity", id: entity.id },
    { entity, zoneId, density: "mini", presence: "present" },
  );
  return (
    <span ref={ref} className="block h-full w-full">
      <GameCard {...card} scale={scale} />
    </span>
  );
}
