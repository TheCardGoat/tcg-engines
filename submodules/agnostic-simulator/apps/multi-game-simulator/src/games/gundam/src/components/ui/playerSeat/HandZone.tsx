import { useCallback, useEffect, useRef, useState } from "react";

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

const BASE_W = CARD_IMAGE_DIMENSIONS.full.width;
const BASE_H = CARD_IMAGE_DIMENSIONS.full.height;

const MAX_FAN_DEG_SELF = 10;
const MAX_FAN_DEG_OPP = 15;
const HOVER_SCALE = 1.08;
const HOVER_LIFT_PX = 10;
const HOVER_SIBLING_OPACITY = 0.85;
const HOVER_SIBLING_BRIGHTNESS = 0.9;
const MAX_VISIBLE_HIDDEN = 10;

function getFanRotation(index: number, total: number, isOpponent: boolean): number {
  if (total <= 1) return 0;
  const baseSpread = isOpponent ? MAX_FAN_DEG_OPP : MAX_FAN_DEG_SELF;
  const maxSpread = total > 10 ? baseSpread * 0.8 : baseSpread;
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

function getDynamicCardSize(_count: number): CardSize {
  // Hand sits as an explicit row below the play field (Commit 14),
  // so it doesn't need to fit the play-field card scale anymore —
  // small gives the field room and matches what the redesign expects.
  return "tiny";
}

function getMobileCardWidthPx(viewportWidth: number, count: number, isOpponent: boolean): number {
  if (count <= 0 || viewportWidth <= 0) return isOpponent ? 56 : 76;
  const maxW = isOpponent ? 56 : 76;
  const minW = isOpponent ? 36 : 52;
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
  const minStep = isOpponent ? 10 : 16;
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
  const layoutMode = useLayoutMode();
  const isMobile = layoutMode === "mobile";

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  // Gate the hand-card hover-lift / sibling-dim on hover-capable
  // pointers; otherwise tapping a card on mobile fires synthetic
  // mouseenter and dims the rest of the hand mid-tap.
  const hasHover = useHasHover();
  // If hover capability flips off after `hoveredIdx` was already set
  // by a synthetic mouseenter, the matching mouseleave never fires
  // and the sibling-dim/lift sticks. Clear it.
  useEffect(() => {
    if (!hasHover) setHoveredIdx(null);
  }, [hasHover]);

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
  const desktopSize = getDynamicCardSize(total);
  const desktopCardW = CARD_SIZE_SCALES[desktopSize] * BASE_W;
  const desktopOverlap = getDynamicOverlap(total, desktopCardW);
  const overlapHover = isMobile ? 0 : desktopCardW * 0.15;

  const mobileCardW = getMobileCardWidthPx(containerWidth || 360, total, isOpponent);
  const mobileCardH = Math.round(BASE_H * (mobileCardW / BASE_W));
  const mobileStep = getMobileStepPx(containerWidth || 360, total, mobileCardW, isOpponent);

  const mobileNeedsScroll =
    isMobile &&
    total > 1 &&
    containerWidth > 0 &&
    mobileCardW + (total - 1) * (isOpponent ? 10 : 16) > containerWidth;

  const hiddenPlaceholderCount = total === 0 ? Math.min(effectiveTotal, MAX_VISIBLE_HIDDEN) : 0;
  const hiddenOverflowCount = Math.max(0, effectiveTotal - hiddenPlaceholderCount);

  const handleCardTap = (i: number) => {
    if (isOpponent) return;
    if (multi) {
      onToggleMark?.(i);
      return;
    }
    onSelect?.(i);
  };

  const showDesktopTuck = !isMobile && isOpponent && onToggleTucked;
  const showMobileControls = isMobile && !isOpponent && total > 0 && mobileNeedsScroll;

  const transitionCls = reducedMotion
    ? ""
    : "transition-[transform,filter,opacity,margin] duration-200 ease-out";

  const desktopCardH = Math.round(BASE_H * (desktopCardW / BASE_W));
  // Show only the top portion of cards on desktop — the rest extends below
  // the row's allocated height, intentionally overlapping the row above.
  const desktopVisibleFrac = 0.45;
  const desktopVisibleH = Math.round(desktopCardH * desktopVisibleFrac);

  const cardVars = isMobile
    ? ({
        "--zone-card-width": `${mobileCardW}px`,
        "--zone-card-height": `${mobileCardH}px`,
        "--mobile-hand-step": `${mobileStep}px`,
      } as React.CSSProperties)
    : undefined;

  const renderCard = (card: GameCardData | null, i: number, count: number) => {
    const rotation = getFanRotation(i, count, isOpponent);
    const isSel = !isOpponent && !multi && selected === i;
    const isMarked = !isOpponent && multi && markedSet!.has(i);
    const isHovered = !isOpponent && hoveredIdx === i;
    const playable = !isOpponent && canPlay ? canPlay(card!) : false;
    const lifted = isSel || isMarked;
    const isSibDimmed = hoveredIdx !== null && !isHovered && !lifted;

    const isPlaceholder = card === null;

    let transform: string;
    if (isMobile) {
      transform = lifted ? "translateY(-4px) scale(1.03)" : "";
    } else if (lifted) {
      const liftDir = isOpponent ? 8 : -8;
      transform = `translateY(${liftDir}px) rotate(0deg)`;
    } else if (isHovered) {
      const liftDir = isOpponent ? -HOVER_LIFT_PX : HOVER_LIFT_PX;
      transform = `translateY(${liftDir}px) rotate(0deg) scale(${HOVER_SCALE})`;
    } else {
      transform = `rotate(${rotation}deg)`;
    }

    const marginLeft = isMobile
      ? i === 0
        ? 0
        : mobileStep - mobileCardW
      : isHovered
        ? overlapHover
        : i === 0
          ? 0
          : desktopOverlap;

    // Non-playable cards in hand are no longer visually dimmed — the hint
    // pulse on legal cards is sufficient signal, and dimming the rest made
    // the hand look broken/disabled in the new light theme. Multi-select
    // dimming and hover-sibling dimming both stay (different UX intents).
    const filterVal = isOpponent
      ? "none"
      : multi
        ? isMarked
          ? "none"
          : "brightness(.78) saturate(.85)"
        : isSibDimmed
          ? `brightness(${HOVER_SIBLING_BRIGHTNESS})`
          : "none";

    return (
      <div
        key={isPlaceholder ? `hidden-${i}` : (card!.id ?? i)}
        role={isPlaceholder ? undefined : "listitem"}
        aria-label={
          isPlaceholder
            ? undefined
            : m["sim.hand.cardLabel"]({ name: card!.name, cost: card!.cost })
        }
        onClick={isPlaceholder ? undefined : () => handleCardTap(i)}
        onMouseEnter={hasHover ? () => !isOpponent && setHoveredIdx(i) : undefined}
        onMouseLeave={hasHover ? () => !isOpponent && setHoveredIdx(null) : undefined}
        className={[
          "hand-card relative flex-shrink-0",
          isPlaceholder
            ? "cursor-default pointer-events-none"
            : "cursor-pointer pointer-events-auto",
          isOpponent ? "" : "",
          transitionCls,
          isMobile && !isOpponent ? "snap-start" : "",
        ].join(" ")}
        style={{
          width: isMobile ? `var(--zone-card-width, ${mobileCardW}px)` : undefined,
          height: isMobile ? `var(--zone-card-height, ${mobileCardH}px)` : undefined,
          marginLeft,
          zIndex: lifted ? 100 : isHovered ? 90 : i,
          transform: transform || undefined,
          transformOrigin: isOpponent ? "top center" : "center bottom",
          transitionTimingFunction: "cubic-bezier(.25,.46,.45,.94)",
          filter: filterVal,
          opacity: isSibDimmed ? HOVER_SIBLING_OPACITY : 1,
        }}
      >
        {isPlaceholder ? (
          <GameCard
            faceDown
            name="?"
            size={isMobile ? "tiny" : "small"}
            useContainerSize={isMobile}
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
      </div>
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
        isMobile ? "w-full min-w-0" : isOpponent ? "justify-start" : "justify-end",
      ]
        .filter(Boolean)
        .join(" ")}
      data-zone-id="hand"
      data-sim-zone-id={zoneId}
      data-testid={`hand-zone-${isOpponent ? "opponent" : "self"}`}
      style={
        !isMobile
          ? {
              height: `${desktopVisibleH}px`,
              overflow: "visible",
            }
          : undefined
      }
    >
      {showDesktopTuck && (
        <button
          type="button"
          onClick={onToggleTucked!}
          aria-label={isTucked ? "Show hand" : "Hide hand"}
          className="absolute left-1/2 z-[130] inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-full pointer-events-auto bg-hud-deep/95 border-hud-border/40 text-hud-accent text-hud-2xs font-bold tracking-hud-label uppercase opacity-90 hover:opacity-100"
          style={{
            top: isOpponent ? "-14px" : undefined,
            bottom: isOpponent ? undefined : "-14px",
            transform: "translateX(-50%)",
          }}
        >
          <span>{isTucked ? "Show" : "Hide"}</span>
          <span className="text-hud-2xs">{isTucked ? "▾" : isOpponent ? "▴" : "▾"}</span>
        </button>
      )}

      <div
        ref={scrollRef}
        className={[
          "hand-container flex relative z-[2] max-w-full",
          isOpponent ? "items-start" : "items-end",
          // Mobile: always allow horizontal scroll. With many cards the
          // overlap heuristic clips the right edge against the viewport;
          // letting the row scroll lets the player swipe to reveal them.
          // `justify-start` (not `-center`) so overflow lives on the right
          // and `scrollLeft` actually has room to move.
          isMobile
            ? "w-full justify-start overflow-x-auto overflow-y-visible scroll-smooth px-2 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden touch-pan-x"
            : "justify-center px-hud-md pt-2.5",
        ].join(" ")}
        style={cardVars}
        data-mobile-scrollable={isMobile && mobileNeedsScroll ? "true" : undefined}
      >
        {total > 0
          ? hand.map((c, i) => renderCard(c, i, total))
          : hiddenPlaceholderCount > 0 && !isTucked
            ? Array.from({ length: hiddenPlaceholderCount }).map((_, i) =>
                renderCard(null, i, hiddenPlaceholderCount),
              )
            : !isOpponent && (
                <div className="flex items-center justify-center min-h-[60px] text-hud-accent/40 text-hud-sm">
                  {m["sim.hand.count"]({ count: effectiveTotal })}
                </div>
              )}
        {hiddenOverflowCount > 0 && !isTucked && (
          <div className="self-center ml-1.5 text-hud-2xs font-bold text-hud-text bg-hud-deep/85 border border-hud-border/30 rounded-full px-2 py-0.5 pointer-events-none">
            +{hiddenOverflowCount}
          </div>
        )}
      </div>

      {!isOpponent && effectiveTotal > 0 && isTucked && (
        <div className="flex items-center justify-center min-h-[60px] text-hud-accent/40 text-hud-sm">
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
            className="absolute left-0 top-1/2 -translate-y-1/2 z-7 w-[1.9rem] h-[3.5rem] grid place-items-center rounded-full border border-hud-border/25 bg-hud-deep/90 text-hud-accent pointer-events-auto disabled:opacity-35"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Scroll hand right"
            disabled={hiddenCardsToRight === 0}
            onClick={() => scrollBy(1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-7 w-[1.9rem] h-[3.5rem] grid place-items-center rounded-full border border-hud-border/25 bg-hud-deep/90 text-hud-accent pointer-events-auto disabled:opacity-35"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}
