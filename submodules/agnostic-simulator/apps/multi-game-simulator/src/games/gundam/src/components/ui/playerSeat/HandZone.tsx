import { useDraggable } from "@dnd-kit/core";
import { AnimatedEntityCollection, AnimatedEntitySlot } from "@tcg/simulator-ui";
import { useCallback, useEffect, useRef, useState } from "react";
import type { HTMLAttributes, KeyboardEvent, ReactNode } from "react";

import { useHasHover } from "../../../lib/use-has-hover.ts";
import { m } from "../../../lib/i18n/messages.ts";
import { useLayoutMode } from "../../../lib/use-layout-mode.ts";
import {
  CARD_IMAGE_DIMENSIONS,
  CARD_SIZE_SCALES,
  type CardSize,
} from "../card/card-image-format.ts";
import { GameCard } from "../GameCard.tsx";
import type { GameCardData } from "../types.ts";
import {
  encodeGundamHandCardSource,
  type GundamHandCardDragSource,
} from "./gundam-drag-drop-context.tsx";
import { gundamAnimationEntityForCard } from "../../../animation/gundamAnimationVisual.tsx";

const BASE_W = CARD_IMAGE_DIMENSIONS.full.width;
const BASE_H = CARD_IMAGE_DIMENSIONS.full.height;

const MAX_FAN_DEG_OPP = 15;
const HOVER_LIFT_PX = 10;
const HOVER_SIBLING_OPACITY = 0.85;
const HOVER_SIBLING_BRIGHTNESS = 0.9;
const MAX_VISIBLE_HIDDEN_DESKTOP = 8;
const MAX_VISIBLE_HIDDEN_MOBILE = 6;
const DESKTOP_HAND_HORIZONTAL_PADDING_PX = 36;
const DESKTOP_HAND_PREFERRED_GAP_PX = 8;
const MOBILE_HAND_HORIZONTAL_PADDING_PX = 16;

interface HandCardDragProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  readonly source: GundamHandCardDragSource;
  readonly disabled: boolean;
  readonly children: ReactNode;
  readonly idleOpacity: number;
}

function HandCardDrag({
  source,
  disabled,
  children,
  idleOpacity,
  onKeyDown,
  style,
  ...props
}: HandCardDragProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: encodeGundamHandCardSource(source),
    disabled,
  });

  return (
    <div
      ref={setNodeRef}
      {...(!disabled ? attributes : {})}
      {...props}
      {...(!disabled ? listeners : {})}
      onKeyDown={
        !disabled && (onKeyDown || listeners?.onKeyDown)
          ? (event) => {
              if (event.key === " " && listeners?.onKeyDown) {
                listeners.onKeyDown(event);
                return;
              }
              onKeyDown?.(event);
            }
          : undefined
      }
      style={{ ...style, opacity: isDragging ? 0.35 : idleOpacity }}
    >
      {children}
    </div>
  );
}

function getFanRotation(index: number, total: number, isOpponent: boolean): number {
  if (!isOpponent) return 0;
  if (total <= 1) return 0;
  const maxSpread = total > 10 ? MAX_FAN_DEG_OPP * 0.8 : MAX_FAN_DEG_OPP;
  const step = maxSpread / (total - 1);
  return -maxSpread / 2 + step * index;
}

function getDynamicOverlap(count: number, cardW: number): number {
  if (count <= 1) return 0;
  if (count <= 7) return -(cardW * 0.42);
  if (count <= 9) return -(cardW * 0.52);
  if (count <= 11) return -(cardW * 0.62);
  return -(cardW * 0.72);
}

function getDesktopCardMarginLeft(count: number, cardW: number, containerWidth: number): number {
  if (count <= 1) return 0;

  const minimumStep = cardW + getDynamicOverlap(count, cardW);
  if (containerWidth <= 0) return minimumStep - cardW;

  const usableWidth = Math.max(cardW, containerWidth - DESKTOP_HAND_HORIZONTAL_PADDING_PX);
  const availableStep = (usableWidth - cardW) / (count - 1);
  const preferredStep = cardW + DESKTOP_HAND_PREFERRED_GAP_PX;
  const resolvedStep = Math.min(preferredStep, Math.max(minimumStep, availableStep));

  return resolvedStep - cardW;
}

function getDesktopCardSize(isOpponent: boolean): CardSize {
  // Desktop hands are contextual edge rails, not a second battlefield.
  // Keep card image dimensions fixed: player cards stay crisp and readable
  // instead of resizing with hand count or available row width.
  return isOpponent ? "micro" : "tiny";
}

function getMobileCardWidthPx(viewportWidth: number, count: number, isOpponent: boolean): number {
  if (count <= 0 || viewportWidth <= 0) return isOpponent ? 52 : 64;
  const maxW = isOpponent ? 52 : 64;
  const minW = isOpponent ? 36 : 48;
  const minStep = isOpponent ? 10 : 16;
  return Math.min(maxW, Math.max(minW, viewportWidth - (count - 1) * minStep));
}

function getMobileStepPx(
  viewportWidth: number,
  count: number,
  cardW: number,
  isOpponent: boolean,
): number {
  if (count <= 1 || viewportWidth <= 0) return cardW;
  const minStep = isOpponent ? 10 : 44;
  const maxStep = cardW + 6;
  return Math.min(maxStep, Math.max(minStep, (viewportWidth - cardW) / (count - 1)));
}

export interface HandZoneProps {
  readonly hand: readonly GameCardData[];
  readonly handCount?: number;
  readonly isOpponent: boolean;
  readonly selected?: number;
  readonly onSelect?: (index: number) => void;
  readonly canPlay?: (card: GameCardData) => boolean;
  readonly zoneId?: string;
  readonly markedSet?: ReadonlySet<number> | null;
  readonly onToggleMark?: ((index: number) => void) | null;
  readonly isTucked?: boolean;
  readonly onToggleTucked?: (() => void) | null;
}

export function HandZone({
  hand,
  handCount,
  isOpponent,
  selected = -1,
  onSelect,
  canPlay,
  zoneId,
  markedSet = null,
  onToggleMark = null,
  isTucked = false,
  onToggleTucked = null,
}: HandZoneProps) {
  const multi = markedSet !== null;
  const interactive = !isOpponent && (multi ? onToggleMark !== null : onSelect !== undefined);
  const layoutMode = useLayoutMode();
  const isMobile = layoutMode === "mobile";

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [focusedIdx, setFocusedIdx] = useState<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  // Gate the hand-card hover-lift / sibling-dim on hover-capable
  // pointers; otherwise tapping a card on mobile fires synthetic
  // mouseenter and dims the rest of the hand mid-tap.
  const hasHover = useHasHover();
  // If interactivity flips off, matching mouseleave/blur events may no longer
  // be handled. Clear both indices so stale state cannot resurface later.
  useEffect(() => {
    if (!hasHover || !interactive) setHoveredIdx(null);
    if (!interactive) setFocusedIdx(null);
  }, [hasHover, interactive]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [hiddenCardsToLeft, setHiddenCardsToLeft] = useState(0);
  const [hiddenCardsToRight, setHiddenCardsToRight] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const viewportLeft = el.scrollLeft;
    const viewportRight = viewportLeft + el.clientWidth;
    const tolerance = 8;
    const cardEls = Array.from(el.querySelectorAll<HTMLElement>(".hand-card"));
    setHiddenCardsToLeft(cardEls.filter((c) => c.offsetLeft + tolerance < viewportLeft).length);
    setHiddenCardsToRight(
      cardEls.filter((c) => c.offsetLeft + c.offsetWidth - tolerance > viewportRight).length,
    );
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    return () => el.removeEventListener("scroll", updateScrollState);
  }, [isMobile, updateScrollState, hand.length]);

  useEffect(() => {
    if (isMobile) updateScrollState();
  }, [isMobile, containerWidth, hand.length, updateScrollState]);

  const scrollBy = useCallback(
    (dir: -1 | 1) => {
      const el = scrollRef.current;
      if (!el) return;
      const cardEls = Array.from(el.querySelectorAll<HTMLElement>(".hand-card"));
      const first = cardEls[0];
      const second = cardEls[1];
      const step = second
        ? Math.max(second.offsetLeft - first.offsetLeft, first.offsetWidth)
        : first
          ? first.offsetWidth
          : el.clientWidth * 0.8;
      el.scrollBy({ left: dir * step, behavior: reducedMotion ? "auto" : "smooth" });
    },
    [reducedMotion],
  );

  const total = hand.length;
  const effectiveTotal = Math.max(handCount ?? total, total);
  const desktopSize = getDesktopCardSize(isOpponent);
  const desktopCardW = CARD_SIZE_SCALES[desktopSize] * BASE_W;

  const mobileUsableWidth = Math.max(
    0,
    (containerWidth || 360) - MOBILE_HAND_HORIZONTAL_PADDING_PX,
  );
  const unconstrainedMobileCardW = getMobileCardWidthPx(mobileUsableWidth, total, isOpponent);
  // Keep the card inside the mobile hand rail instead of clipping it beneath
  // the action dock when the card width would imply a taller card face.
  const mobileCardW = Math.min(unconstrainedMobileCardW, Math.floor((90 * BASE_W) / BASE_H));
  const mobileCardH = Math.round(BASE_H * (mobileCardW / BASE_W));
  const mobileStep = getMobileStepPx(mobileUsableWidth, total, mobileCardW, isOpponent);

  const mobileNeedsScroll =
    isMobile &&
    total > 1 &&
    containerWidth > 0 &&
    mobileCardW + (total - 1) * mobileStep > mobileUsableWidth;

  const hiddenPlaceholderLimit = isMobile ? MAX_VISIBLE_HIDDEN_MOBILE : MAX_VISIBLE_HIDDEN_DESKTOP;
  const hiddenPlaceholderCount = total === 0 ? Math.min(effectiveTotal, hiddenPlaceholderLimit) : 0;
  const hiddenOverflowCount =
    total === 0 ? Math.max(0, effectiveTotal - hiddenPlaceholderCount) : 0;
  const opponentHandCollapsed = isOpponent && isTucked;

  const handleCardTap = (i: number) => {
    if (isOpponent) return;
    if (multi) {
      onToggleMark?.(i);
      return;
    }
    onSelect?.(i);
  };

  const handleCardKeyDown = (event: KeyboardEvent<HTMLDivElement>, i: number) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    handleCardTap(i);
  };

  const showDesktopTuck = !isMobile && isOpponent && onToggleTucked;
  const showMobileControls = isMobile && !isOpponent && total > 0 && mobileNeedsScroll;

  const transitionCls = reducedMotion
    ? ""
    : "transition-[transform,filter,opacity] duration-200 ease-out";

  const desktopCardH = Math.round(BASE_H * (desktopCardW / BASE_W));
  // Desktop hands occupy a complete, clipped band. Reserving the full card
  // footprint prevents the old fan from escaping into resources, controls,
  // or the browser edge while preserving enough room for a subtle lift.
  const desktopRowH = desktopCardH + 24;

  const cardVars = isMobile
    ? ({
        "--zone-card-width": `${mobileCardW}px`,
        "--zone-card-height": `${mobileCardH}px`,
        "--mobile-hand-step": `${mobileStep}px`,
      } as React.CSSProperties)
    : undefined;

  const renderCard = (card: GameCardData | null, i: number, count: number) => {
    const isPlaceholder = card === null;
    const playable = !isOpponent && canPlay ? canPlay(card!) : false;
    const isActionable = !isPlaceholder && (playable || (multi && interactive));
    const isInteractive = isActionable && interactive;
    const rotation = getFanRotation(i, count, isOpponent);
    const isSel = !isOpponent && !multi && selected === i;
    const isMarked = !isOpponent && multi && markedSet!.has(i);
    const isHovered = isActionable && (hoveredIdx === i || focusedIdx === i);
    const lifted = isSel || isMarked;
    const isSibDimmed = isActionable && hoveredIdx !== null && !isHovered && !lifted;

    let transform: string;
    if (isMobile) {
      transform = lifted ? "translateY(-4px) scale(1.03)" : "";
    } else if (lifted) {
      const liftDir = isOpponent ? 6 : -6;
      transform = `translateY(${liftDir}px)`;
    } else if (isHovered) {
      const liftDir = isOpponent ? HOVER_LIFT_PX : -HOVER_LIFT_PX;
      transform = `translateY(${liftDir}px)`;
    } else {
      transform = rotation === 0 ? "" : `rotate(${rotation}deg)`;
    }

    const marginLeft = isMobile
      ? i === 0
        ? 0
        : mobileStep - mobileCardW
      : i === 0
        ? 0
        : getDesktopCardMarginLeft(count, desktopCardW, containerWidth);

    // Keep every legal candidate readable during multi-select. The selected
    // card's rim and lift already communicate state; dimming all remaining
    // cards made the choices still available to the player look disabled.
    // Fine-pointer hover may still quiet siblings temporarily.
    const filterVal = isOpponent
      ? "none"
      : isSibDimmed
        ? `brightness(${HOVER_SIBLING_BRIGHTNESS})`
        : "none";

    const cardId = card?.id ?? `hidden-${i}`;
    const animationCard: GameCardData = card ?? {
      id: cardId,
      name: "Hidden card",
      faceDown: true,
    };
    const dragSource: GundamHandCardDragSource = {
      type: "hand-card",
      cardId,
      card: {
        name: card?.name ?? "Hidden card",
        img: card?.img,
        cardType: card?.cardType,
        cost: card?.cost,
      },
    };

    return (
      <AnimatedEntitySlot
        key={isPlaceholder ? `hidden-${i}` : (card!.id ?? i)}
        entity={gundamAnimationEntityForCard(animationCard, ownerIdFromZoneId(zoneId))}
        zoneRef={{
          kind: "zone",
          id: zoneId ?? "hand",
          ownerId: ownerIdFromZoneId(zoneId),
        }}
        density={isMobile || isOpponent ? "mini" : "compact"}
        role={isPlaceholder ? undefined : "listitem"}
        aria-label={
          isPlaceholder
            ? undefined
            : m["sim.hand.cardLabel"]({ name: card!.name, cost: card!.cost })
        }
        onClick={isInteractive ? () => handleCardTap(i) : undefined}
        className={[
          "hand-card relative flex-shrink-0",
          isPlaceholder
            ? "cursor-default pointer-events-none"
            : isActionable
              ? "cursor-pointer pointer-events-auto"
              : "cursor-default pointer-events-auto",
          isOpponent ? "" : "",
          transitionCls,
          isMobile && !isOpponent ? "snap-start" : "",
        ].join(" ")}
        style={{
          width: isMobile ? `var(--zone-card-width, ${mobileCardW}px)` : undefined,
          height: isMobile ? `var(--zone-card-height, ${mobileCardH}px)` : undefined,
          marginLeft,
          zIndex: lifted ? 100 : isHovered ? 90 : i,
          filter: filterVal,
          touchAction: playable ? (isMobile ? "pan-x" : "none") : undefined,
        }}
      >
        <HandCardDrag
          source={dragSource}
          disabled={isPlaceholder || !playable}
          idleOpacity={isSibDimmed ? HOVER_SIBLING_OPACITY : 1}
          role={isActionable ? "button" : undefined}
          aria-label={
            isActionable
              ? m["sim.hand.cardLabel"]({ name: card!.name, cost: card!.cost })
              : undefined
          }
          onClick={undefined}
          tabIndex={isActionable ? 0 : undefined}
          onFocus={isActionable ? () => setFocusedIdx(i) : undefined}
          onBlur={isActionable ? () => setFocusedIdx(null) : undefined}
          onKeyDown={isInteractive ? (event) => handleCardKeyDown(event, i) : undefined}
          data-draggable={!isPlaceholder ? String(playable) : undefined}
          onMouseEnter={hasHover && isActionable ? () => setHoveredIdx(i) : undefined}
          onMouseLeave={hasHover && isActionable ? () => setHoveredIdx(null) : undefined}
          className="relative h-full w-full"
          style={{
            transform: transform || undefined,
            transformOrigin: isOpponent ? "top center" : "center bottom",
            transitionTimingFunction: "cubic-bezier(.25,.46,.45,.94)",
          }}
        >
          {isPlaceholder ? (
            <GameCard
              faceDown
              name="?"
              size={isMobile ? "tiny" : desktopSize}
              useContainerSize={isMobile}
              draggable={playable}
            />
          ) : (
            <GameCard
              {...card!}
              selected={isSel || isMarked}
              highlight={!multi && playable && !isSel}
              size={isMobile ? "tiny" : desktopSize}
              useContainerSize={isMobile}
            />
          )}
          {isMarked && (
            <div
              className="gd-display absolute left-1/2 -top-2.5 whitespace-nowrap pointer-events-none bg-[linear-gradient(180deg,#d7263d,#4a0612)] text-[#fff5d6] text-hud-xs font-black border border-hud-border-hot shadow-[0_0_10px_rgba(255,45,122,.6),0_2px_6px_rgba(0,0,0,.5)] tracking-hud-label"
              style={{
                transform: "translateX(-50%) rotate(-6deg)",
                padding: "2px 8px 2px 7px",
                clipPath: "polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)",
                textShadow: "0 1px 1px rgba(0,0,0,.5)",
              }}
            >
              {m["sim.hand.alter"]()}
            </div>
          )}
        </HandCardDrag>
      </AnimatedEntitySlot>
    );
  };

  return (
    <div
      ref={containerRef}
      role={isOpponent ? undefined : "list"}
      aria-label={isOpponent ? undefined : m["sim.hand.label"]()}
      className={[
        "relative flex flex-col items-center pointer-events-none",
        // `w-full min-w-0` is the lock that lets the inner scroll container
        // actually overflow on mobile — without it the container takes its
        // content width and the parent flex chain inflates past the
        // viewport, pushing the action bar / top-hud pill off-screen.
        "w-full min-w-0",
        isMobile || isOpponent ? "overflow-hidden" : "z-[30] overflow-visible",
        !isMobile && (isOpponent ? "justify-start" : "justify-end"),
      ]
        .filter(Boolean)
        .join(" ")}
      data-zone-id="hand"
      data-sim-zone-id={zoneId}
      data-testid={`hand-zone-${isOpponent ? "opponent" : "self"}`}
      style={{ height: isMobile ? "100%" : `${desktopRowH}px` }}
    >
      {showDesktopTuck && (
        <button
          type="button"
          onClick={onToggleTucked!}
          aria-label={
            isTucked ? m["sim.hand.opponent.showAction"]() : m["sim.hand.opponent.hideAction"]()
          }
          aria-controls={`${zoneId ?? "opponent-hand"}-contents`}
          aria-expanded={!isTucked}
          title={
            isTucked ? m["sim.hand.opponent.showAction"]() : m["sim.hand.opponent.hideAction"]()
          }
          className="absolute right-2 top-1.5 z-[130] inline-flex items-center gap-1.5 rounded-sm border border-hud-border/45 bg-white/90 px-2 py-1 pointer-events-auto text-hud-accent-deep text-hud-2xs font-bold tracking-hud-label uppercase opacity-90 hover:opacity-100"
          style={{
            transform: "none",
          }}
        >
          <span>{isTucked ? "Show" : "Hide"}</span>
          <span className="text-hud-2xs">{isTucked ? "▾" : isOpponent ? "▴" : "▾"}</span>
        </button>
      )}

      <div
        ref={scrollRef}
        id={`${zoneId ?? "opponent-hand"}-contents`}
        className={[
          "hand-container flex relative z-[2] max-w-full",
          isOpponent ? "items-start" : "items-end",
          // Mobile: always allow horizontal scroll. With many cards the
          // overlap heuristic clips the right edge against the viewport;
          // letting the row scroll lets the player swipe to reveal them.
          // Scrollable rows start at the left so overflow remains reachable;
          // smaller hands center in the available rail instead of appearing
          // stranded against one edge.
          isMobile
            ? `h-full ${mobileNeedsScroll ? "justify-start" : "justify-center"} overflow-x-auto overflow-y-visible scroll-smooth px-2 py-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden touch-pan-x`
            : isOpponent
              ? // The opponent hand mirrors the bottom hand's viewport crop:
                // it tucks toward the outer edge of the board rather than
                // spilling down into the resource rail.
                "h-full -translate-y-3 justify-center overflow-hidden px-hud-md py-3"
              : "h-full justify-center overflow-visible px-hud-md py-3",
          isMobile ? (showMobileControls ? "mx-11 w-[calc(100%_-_88px)]" : "w-full") : "",
        ].join(" ")}
        style={cardVars}
        data-mobile-scrollable={isMobile && mobileNeedsScroll ? "true" : undefined}
      >
        <AnimatedEntityCollection mode="popLayout">
          {!opponentHandCollapsed &&
            (total > 0
              ? hand.map((c, i) => renderCard(c, i, total))
              : hiddenPlaceholderCount > 0 && !isTucked
                ? Array.from({ length: hiddenPlaceholderCount }).map((_, i) =>
                    renderCard(null, i, hiddenPlaceholderCount),
                  )
                : !isOpponent && (
                    <div
                      className={`${isMobile ? "h-full min-h-0" : "min-h-[60px]"} flex items-center justify-center text-hud-sm font-semibold text-hud-text-muted`}
                    >
                      {m["sim.hand.count"]({ count: effectiveTotal })}
                    </div>
                  ))}
        </AnimatedEntityCollection>
        {hiddenOverflowCount > 0 && !opponentHandCollapsed && !isTucked && (
          <div className="self-center ml-1.5 text-hud-2xs font-bold text-hud-text bg-hud-deep/85 border border-hud-border/30 rounded-full px-2 py-0.5 pointer-events-none">
            +{hiddenOverflowCount}
          </div>
        )}
      </div>

      {opponentHandCollapsed && (
        <div
          className="flex min-h-[60px] items-center justify-center text-hud-xs font-semibold tracking-hud-label text-hud-text-dim"
          role="status"
        >
          {m["sim.hand.opponent.collapsed"]()} · {m["sim.hand.count"]({ count: effectiveTotal })}
        </div>
      )}

      {!isOpponent && effectiveTotal > 0 && isTucked && (
        <div className="flex items-center justify-center min-h-[60px] text-hud-sm font-semibold text-hud-text-muted">
          {m["sim.hand.count"]({ count: effectiveTotal })}
        </div>
      )}

      {showMobileControls && (
        <>
          <button
            type="button"
            aria-label="Scroll hand left"
            disabled={hiddenCardsToLeft === 0}
            onClick={() => scrollBy(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-7 flex h-[3.5rem] w-11 flex-col items-center justify-center rounded-full border border-hud-border/25 bg-hud-deep/90 text-hud-accent pointer-events-auto disabled:[&>span:first-child]:opacity-35"
          >
            <span className="text-lg leading-none">‹</span>
            <span className="text-hud-2xs leading-none text-hud-text-muted" aria-hidden="true">
              {hiddenCardsToLeft + 1}–{total - hiddenCardsToRight}/{total}
            </span>
          </button>
          <button
            type="button"
            aria-label="Scroll hand right"
            disabled={hiddenCardsToRight === 0}
            onClick={() => scrollBy(1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-7 flex h-[3.5rem] w-11 flex-col items-center justify-center rounded-full border border-hud-border/25 bg-hud-deep/90 text-hud-accent pointer-events-auto disabled:[&>span:first-child]:opacity-35"
          >
            <span className="text-lg leading-none">›</span>
            <span className="text-hud-2xs leading-none text-hud-text-muted" aria-hidden="true">
              {hiddenCardsToLeft + 1}–{total - hiddenCardsToRight}/{total}
            </span>
          </button>
        </>
      )}
    </div>
  );
}

function ownerIdFromZoneId(zoneId: string | undefined): string {
  return zoneId?.split(":").slice(1).join(":") ?? "";
}
