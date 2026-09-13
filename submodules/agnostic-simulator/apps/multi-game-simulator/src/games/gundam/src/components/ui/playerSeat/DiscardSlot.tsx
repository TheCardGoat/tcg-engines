import { m } from "../../../lib/i18n/messages.ts";
import { useHasHover } from "../../../lib/use-has-hover.ts";
import { AnimatedZoneSlot, DiscardPileZone, TabletopCounterBadge } from "@tcg/simulator-ui";
import { useCallback, useEffect, useState } from "react";
import type { MouseEvent } from "react";

import { useCardInspect } from "../card/card-inspect-context.tsx";
import { toSimulatorEntity, toSimulatorZone } from "../card/to-simulator-entity.ts";
import type { GameCardData } from "../types.ts";
import {
  RESOURCE_ROW_EMPTY_PILE_CLASS,
  RESOURCE_ROW_PILE_CLASS,
  RESOURCE_ROW_ZONE_FOOTPRINT_CLASS,
} from "./resource-row-geometry.ts";
import { TrashCardModal } from "./TrashCardModal.tsx";

interface DiscardSlotProps {
  readonly count?: number;
  readonly topCard: GameCardData | null;
  readonly cards?: readonly GameCardData[];
  readonly isTop: boolean;
  readonly zoneId?: string;
}

export function DiscardSlot({
  count = 0,
  topCard,
  cards,
  isTop: _isTop,
  zoneId,
}: DiscardSlotProps) {
  const label = m["sim.seat.discard.label"]();
  const entities = topCard ? [toSimulatorEntity(topCard, { zoneId })] : [];
  const topEntity = entities[0];
  const inspect = useCardInspect();
  const hasHover = useHasHover();
  const canInspect = topCard !== null && !topCard.faceDown && Boolean(inspect);
  const [trashOpen, setTrashOpen] = useState(false);
  const visibleCards = cards ?? (topCard ? [topCard] : []);
  const zone = toSimulatorZone(
    zoneId,
    label,
    entities.map((entity) => entity.id),
    {
      role: "discard",
      count,
      layoutHint: "stack",
    },
  );
  const handleHoverEnter = useCallback(() => {
    if (!canInspect || !topCard) return;
    inspect?.setHover(topCard);
  }, [canInspect, inspect, topCard]);

  const handleHoverLeave = useCallback(() => {
    inspect?.setHover(null);
  }, [inspect]);

  const handleContextMenu = useCallback(
    (_entity: typeof topEntity, event: MouseEvent) => {
      if (!canInspect || !topCard || !inspect) return;
      event.preventDefault();
      const rect = event.currentTarget.getBoundingClientRect();
      requestAnimationFrame(() =>
        inspect.openInspect(topCard, {
          left: rect.left,
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          width: rect.width,
          height: rect.height,
        }),
      );
    },
    [canInspect, inspect, topCard],
  );

  useEffect(() => {
    if (!inspect || !topCard?.id) return;
    if (inspect.hovered?.card.id === topCard.id) inspect.setHover(topCard);
    if (inspect.inspected?.card.id === topCard.id) inspect.refreshInspect(topCard);
  }, [inspect, topCard]);

  useEffect(() => {
    if (hasHover || !inspect || !topCard?.id) return;
    if (inspect.hovered?.card.id === topCard.id) inspect.setHover(null);
  }, [hasHover, inspect, topCard?.id]);

  const content = (
    <>
      <DiscardPileZone
        zone={zone}
        entities={entities}
        entityCount={count}
        label={label}
        emptyLabel={label}
        showEmptyState={count === 0}
        density="mini"
        className={`gundam-zone-primitive ${RESOURCE_ROW_PILE_CLASS} ${count === 0 ? RESOURCE_ROW_EMPTY_PILE_CLASS : ""} [&_.tabletop-pile-count]:hidden [&_.tabletop-pile-label]:font-mono`}
        onHoverEnter={topCard && hasHover ? handleHoverEnter : undefined}
        onHoverLeave={topCard && hasHover ? handleHoverLeave : undefined}
        onContextMenu={topCard ? handleContextMenu : undefined}
        onSelect={visibleCards.length > 0 ? () => setTrashOpen(true) : undefined}
      />
      {count > 0 ? (
        <TabletopCounterBadge
          label={label}
          value={String(count).padStart(2, "0")}
          variant="compact"
          mono
          className="absolute right-1 top-1 z-10 h-auto min-w-[0] rounded-none !bg-[#fbfcfe] px-[5px] py-[1px] leading-normal text-hud-xs font-bold !text-hud-text-dim"
          style={{ border: "1px solid rgba(255,255,255,.18)" }}
        />
      ) : null}
      <TrashCardModal open={trashOpen} onOpenChange={setTrashOpen} cards={visibleCards} />
    </>
  );
  const className = `relative ${RESOURCE_ROW_ZONE_FOOTPRINT_CLASS}`;

  return zoneId ? (
    <AnimatedZoneSlot
      animationRef={{ kind: "zone", id: zoneId, ownerId: zoneId.split(":").at(1) }}
      className={className}
    >
      <div className="contents" data-zone-footprint="pile">
        {content}
      </div>
    </AnimatedZoneSlot>
  ) : (
    <div className={className} data-zone-footprint="pile">
      {content}
    </div>
  );
}
