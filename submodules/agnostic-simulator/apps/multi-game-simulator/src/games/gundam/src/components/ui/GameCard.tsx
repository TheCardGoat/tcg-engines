import { useCallback, useEffect, useRef } from "react";
import type { CSSProperties, MouseEvent } from "react";

import { useHasHover } from "../../lib/use-has-hover.ts";
import { CardBack } from "./card/CardBack.tsx";
import { CardFace } from "./card/CardFace.tsx";
import { useCardInspect } from "./card/card-inspect-context.tsx";
import {
  CARD_IMAGE_DIMENSIONS,
  type CardSize,
  CARD_SIZE_SCALES,
  type ImageFormat,
  ZONE_IMAGE_FORMATS,
} from "./card/card-image-format.ts";
import type { GameCardData } from "./types.ts";

export interface GameCardProps extends GameCardData {
  readonly size?: CardSize;
  readonly scale?: number;
  readonly useContainerSize?: boolean;
  readonly imageFormat?: ImageFormat;
  readonly style?: CSSProperties;
  readonly hideStatBadges?: boolean;
  readonly hideSupplementalBadges?: boolean;
}

export function GameCard({
  size,
  scale,
  useContainerSize = false,
  imageFormat,
  style,
  hideStatBadges,
  hideSupplementalBadges,
  ...card
}: GameCardProps) {
  const resolvedFormat: ImageFormat =
    imageFormat ??
    (card.zoneId ? ZONE_IMAGE_FORMATS[card.zoneId.split(":")[0]] : undefined) ??
    "full";
  const { width: baseW, height: baseH } = CARD_IMAGE_DIMENSIONS[resolvedFormat];
  const effectiveScale = size ? CARD_SIZE_SCALES[size] : (scale ?? CARD_SIZE_SCALES.small);
  const displayWidth = Math.round(baseW * effectiveScale);
  const displayHeight = Math.round(baseH * effectiveScale);

  const inspect = useCardInspect();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canInspect = !card.faceDown && Boolean(inspect);
  // Touch devices fire synthetic mouseenter/leave on tap, which would
  // pop the desktop hover preview over the same tap that's meant to
  // dispatch an action (e.g. `enterBattle`). Only wire hover on
  // hover-capable pointers.
  const hasHover = useHasHover();

  const handleMouseEnter = useCallback(() => {
    if (!canInspect) return;
    inspect?.setHover(card);
  }, [canInspect, inspect, card]);

  const handleMouseLeave = useCallback(() => {
    inspect?.setHover(null);
  }, [inspect]);

  const openInspectAtCard = useCallback(() => {
    if (!canInspect || !inspect) return;
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    const anchor = {
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height,
    };
    requestAnimationFrame(() => inspect.openInspect(card, anchor));
  }, [canInspect, inspect, card]);

  const handleContextMenu = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (!canInspect) return;
      event.preventDefault();
      openInspectAtCard();
    },
    [canInspect, openInspectAtCard],
  );

  useEffect(() => {
    if (!inspect || !card.id) return;
    if (inspect.hovered?.card.id === card.id) inspect.setHover(card);
    if (inspect.inspected?.card.id === card.id) inspect.refreshInspect(card);
  }, [card, inspect]);

  // `hasHover` defaults to `true` and re-syncs in an effect, so on a
  // touch device a synthetic mouseenter that landed before the flip
  // can leave this card's hover state stuck (onMouseLeave is detached
  // once `hasHover` becomes false). Clear it when capability flips off.
  useEffect(() => {
    if (hasHover || !inspect) return;
    if (inspect.hovered?.card.id === card.id) inspect.setHover(null);
  }, [hasHover, inspect, card.id]);

  return (
    // Default click is intentionally NOT bound here. Clicks bubble up
    // to the parent (HandZone listitem, PlayZone slot wrapper) so the
    // container's action dispatcher fires — defaulting to the action,
    // not the dossier. The full inspect dialog now opens only via
    // right-click (handleContextMenu); hover surfaces the smaller
    // CardHoverPreview tier-0 chip via inspect.setHover() above.
    <div
      ref={wrapperRef}
      onMouseEnter={hasHover ? handleMouseEnter : undefined}
      onMouseLeave={hasHover ? handleMouseLeave : undefined}
      onContextMenu={handleContextMenu}
      style={{ display: "inline-block" }}
    >
      {card.faceDown ? (
        <CardBack
          width={displayWidth}
          height={displayHeight}
          highlight={card.highlight}
          useContainerSize={useContainerSize}
        />
      ) : (
        <CardFace
          card={card}
          width={displayWidth}
          height={displayHeight}
          useContainerSize={useContainerSize}
          style={style}
          hideStatBadges={hideStatBadges}
          hideSupplementalBadges={hideSupplementalBadges}
        />
      )}
    </div>
  );
}
