import { m } from "../../../lib/i18n/messages.ts";
import { useHasHover } from "../../../lib/use-has-hover.ts";
import { DiscardPileZone } from "@tcg/simulator-ui";
import { useCallback, useEffect } from "react";
import type { MouseEvent } from "react";

import { useCardInspect } from "../card/card-inspect-context.tsx";
import { toSimulatorEntity, toSimulatorZone } from "../card/to-simulator-entity.ts";
import type { GameCardData } from "../types.ts";

interface DiscardSlotProps {
  readonly count?: number;
  readonly topCard: GameCardData | null;
  readonly isTop: boolean;
  readonly zoneId?: string;
}

export function DiscardSlot({ count = 0, topCard, isTop: _isTop, zoneId }: DiscardSlotProps) {
  const label = m["sim.seat.discard.label"]();
  const entities = topCard ? [toSimulatorEntity(topCard, { zoneId })] : [];
  const topEntity = entities[0];
  const inspect = useCardInspect();
  const hasHover = useHasHover();
  const canInspect = topCard !== null && !topCard.faceDown && Boolean(inspect);
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

  return (
    <div className="relative" data-zone-footprint="pile">
      <DiscardPileZone
        zone={zone}
        entities={entities}
        entityCount={count}
        label={label}
        emptyLabel={label}
        density="mini"
        className="gundam-zone-primitive [&_.empty-zone]:border-hud-danger/45 [&_.empty-zone]:bg-white/70 [&_.empty-zone]:text-hud-danger-deep [&_.tabletop-pile-count]:hidden [&_.tabletop-pile-label]:font-mono"
        onHoverEnter={topCard && hasHover ? handleHoverEnter : undefined}
        onHoverLeave={topCard && hasHover ? handleHoverLeave : undefined}
        onContextMenu={topCard ? handleContextMenu : undefined}
      />
      <DiscardCountBadge count={count} />
    </div>
  );
}

function DiscardCountBadge({ count }: { readonly count: number }) {
  if (count <= 0) return null;
  return (
    <div
      className="font-mono absolute -top-[7px] -right-[7px] z-10 text-hud-xs font-bold bg-[#fbfcfe] text-hud-text-dim px-[5px] py-[1px]"
      style={{ border: "1px solid rgba(255,255,255,.18)" }}
    >
      {String(count).padStart(2, "0")}
    </div>
  );
}
