import { useCallback, useEffect, useRef } from "react";
import type { CSSProperties, MouseEvent } from "react";
import { useTargeting } from "@tcg/simulator-ui";

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
  readonly draggable?: boolean;
  /**
   * Optional direct card action. Play-zone cards use this instead of
   * depending on a click to bubble through layout-only wrappers, which keeps
   * target selection reachable to both pointer and keyboard players.
   */
  readonly onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

export type GameCardVisualProps = Omit<GameCardProps, "onClick"> & {
  readonly onClick?: (event: MouseEvent<HTMLDivElement>) => void;
  readonly imageLoading?: "eager" | "lazy";
};

/**
 * The passive card visual shared by board slots and animation transfers.
 * Hover inspection and other interaction state belong to `GameCard`.
 */
export function GameCardVisual({
  imageLoading,
  size,
  scale,
  useContainerSize = false,
  imageFormat,
  style,
  hideStatBadges,
  hideSupplementalBadges,
  draggable,
  onClick,
  ...card
}: GameCardVisualProps) {
  const resolvedFormat: ImageFormat =
    imageFormat ??
    (card.zoneId ? ZONE_IMAGE_FORMATS[card.zoneId.split(":")[0]] : undefined) ??
    "full";
  const { width: baseW, height: baseH } = CARD_IMAGE_DIMENSIONS[resolvedFormat];
  const effectiveScale = size ? CARD_SIZE_SCALES[size] : (scale ?? CARD_SIZE_SCALES.small);
  const displayWidth = Math.round(baseW * effectiveScale);
  const displayHeight = Math.round(baseH * effectiveScale);

  return card.faceDown ? (
    <CardBack
      width={displayWidth}
      height={displayHeight}
      highlight={card.highlight}
      useContainerSize={useContainerSize}
    />
  ) : (
    <CardFace
      imageLoading={imageLoading}
      card={card}
      width={displayWidth}
      height={displayHeight}
      useContainerSize={useContainerSize}
      style={style}
      onClick={onClick}
      hideStatBadges={hideStatBadges}
      hideSupplementalBadges={hideSupplementalBadges}
      draggable={draggable}
    />
  );
}

export function GameCard({
  size,
  scale,
  useContainerSize = false,
  imageFormat,
  style,
  hideStatBadges,
  hideSupplementalBadges,
  draggable,
  onClick,
  ...card
}: GameCardProps) {
  const inspect = useCardInspect();
  const targeting = useTargeting();
  const inspectRef = useRef(inspect);
  inspectRef.current = inspect;
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const ownsHoverRef = useRef(false);
  const ownsInspectRef = useRef(false);
  const canInspect = !card.faceDown && Boolean(inspect) && !targeting.active;
  // Touch devices fire synthetic mouseenter/leave on tap, which would
  // pop the desktop hover preview over the same tap that's meant to
  // dispatch an action (e.g. `enterBattle`). Only wire hover on
  // hover-capable pointers.
  const hasHover = useHasHover();

  const handleMouseEnter = useCallback(() => {
    if (!canInspect) return;
    ownsHoverRef.current = true;
    inspect?.setHover(card);
  }, [canInspect, inspect, card]);

  const handleMouseLeave = useCallback(() => {
    ownsHoverRef.current = false;
    inspect?.setHover(null);
  }, [inspect]);

  const handleClickCapture = useCallback(() => {
    if (!inspect || !card.id) return;
    ownsHoverRef.current = false;
    inspect.dismissHover(card.id);
  }, [card.id, inspect]);

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
    requestAnimationFrame(() => {
      ownsInspectRef.current = true;
      inspect.openInspect(card, anchor);
    });
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
    if (!targeting.active && ownsHoverRef.current && inspect.hovered?.card.id === card.id) {
      inspect.setHover(card);
    }
    if (ownsInspectRef.current && inspect.inspected?.card.id === card.id) {
      inspect.refreshInspect(card);
    }
  }, [card, inspect, targeting.active]);

  useEffect(() => {
    if (!targeting.active || !inspect) return;
    if (ownsHoverRef.current && inspect.hovered?.card.id === card.id) {
      ownsHoverRef.current = false;
      inspect.setHover(null);
    }
  }, [card.id, inspect, targeting.active]);

  useEffect(
    () => () => {
      const currentInspect = inspectRef.current;
      if (!currentInspect || !card.id) return;
      if (ownsHoverRef.current && currentInspect.hovered?.card.id === card.id) {
        currentInspect.setHover(null);
      }
      if (ownsInspectRef.current && currentInspect.inspected?.card.id === card.id) {
        currentInspect.closeInspect();
      }
    },
    [card.id],
  );

  // `hasHover` defaults to `true` and re-syncs in an effect, so on a
  // touch device a synthetic mouseenter that landed before the flip
  // can leave this card's hover state stuck (onMouseLeave is detached
  // once `hasHover` becomes false). Clear it when capability flips off.
  useEffect(() => {
    if (hasHover || !inspect) return;
    if (ownsHoverRef.current && inspect.hovered?.card.id === card.id) {
      ownsHoverRef.current = false;
      inspect.setHover(null);
    }
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
      onClickCapture={handleClickCapture}
      onContextMenu={handleContextMenu}
      style={{ display: "inline-block" }}
    >
      <GameCardVisual
        {...card}
        size={size}
        scale={scale}
        useContainerSize={useContainerSize}
        imageFormat={imageFormat}
        style={style}
        onClick={onClick}
        hideStatBadges={hideStatBadges}
        hideSupplementalBadges={hideSupplementalBadges}
        draggable={draggable}
      />
    </div>
  );
}
