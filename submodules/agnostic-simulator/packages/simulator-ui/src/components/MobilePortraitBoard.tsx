import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import { cx } from "../class-names";
import classes from "./MobilePortraitBoard.module.css";

export interface FieldOverflowState {
  before: boolean;
  after: boolean;
}

export type FieldScrollAxis = "horizontal" | "vertical";

const EMPTY_OVERFLOW: FieldOverflowState = { before: false, after: false };
const SCROLL_EPSILON = 2;

function measureOffscreenChildren(
  scroller: HTMLElement,
  axis: FieldScrollAxis,
): FieldOverflowState {
  const scrollerRect = scroller.getBoundingClientRect();
  let before = false;
  let after = false;

  for (const child of Array.from(scroller.children)) {
    if (!(child instanceof HTMLElement)) {
      continue;
    }
    const childRect = child.getBoundingClientRect();
    if (axis === "horizontal") {
      if (childRect.left < scrollerRect.left - SCROLL_EPSILON) {
        before = true;
      } else if (childRect.right > scrollerRect.right + SCROLL_EPSILON) {
        after = true;
      }
    } else if (childRect.top < scrollerRect.top - SCROLL_EPSILON) {
      before = true;
    } else if (childRect.bottom > scrollerRect.bottom + SCROLL_EPSILON) {
      after = true;
    }
  }

  return { before, after };
}

function fieldOverflowMatches(left: FieldOverflowState, right: FieldOverflowState) {
  return left.before === right.before && left.after === right.after;
}

function scrollCueText({ direction, axis }: { direction: 1 | -1; axis: FieldScrollAxis }) {
  if (axis === "vertical") {
    return direction < 0 ? "Top" : "End";
  }
  return direction < 0 ? "‹" : "›";
}

function scrollCueEdgeLabel(direction: 1 | -1, axis: FieldScrollAxis) {
  if (axis === "vertical") {
    return direction < 0 ? "top" : "bottom";
  }
  return direction < 0 ? "left" : "right";
}

export interface MobilePortraitBoardProps extends HTMLAttributes<HTMLDivElement> {
  topRail: ReactNode;
  opponentHand: ReactNode;
  opponentZoneSummary?: ReactNode;
  opponentBattlefield: ReactNode;
  ledger: ReactNode;
  playerBattlefield: ReactNode;
  playerZoneSummary?: ReactNode;
  playerHand: ReactNode;
  bottomRail: ReactNode;
  overlays?: ReactNode;
  promptActive?: boolean;
}

export const MobilePortraitBoard = forwardRef<HTMLDivElement, MobilePortraitBoardProps>(
  function MobilePortraitBoard(
    {
      topRail,
      opponentHand,
      opponentZoneSummary,
      opponentBattlefield,
      ledger,
      playerBattlefield,
      playerZoneSummary,
      playerHand,
      bottomRail,
      overlays,
      promptActive,
      className,
      children,
      ...props
    },
    ref,
  ) {
    const hasZoneSummaries = Boolean(opponentZoneSummary || playerZoneSummary);

    return (
      <div
        ref={ref}
        className={cx(classes.root, className)}
        data-prompt-active={promptActive ? "true" : "false"}
        data-zone-summaries={hasZoneSummaries ? "true" : undefined}
        {...props}
      >
        {overlays}
        <div className={classes.topRail}>{topRail}</div>
        <div className={classes.opponentHand}>{opponentHand}</div>
        {hasZoneSummaries ? (
          <div className={classes.opponentZoneSummary}>{opponentZoneSummary}</div>
        ) : null}
        <div className={classes.opponentBattlefield}>{opponentBattlefield}</div>
        <div className={classes.ledger}>{ledger}</div>
        <div className={classes.playerBattlefield}>{playerBattlefield}</div>
        {hasZoneSummaries ? (
          <div className={classes.playerZoneSummary}>{playerZoneSummary}</div>
        ) : null}
        <div className={classes.playerHand}>{playerHand}</div>
        <div className={classes.bottomRail}>{bottomRail}</div>
        {children}
      </div>
    );
  },
);

export interface MobilePlayerRailProps extends HTMLAttributes<HTMLDivElement> {
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
  side?: "opponent" | "player";
}

export function MobilePlayerRail({
  left,
  center,
  right,
  side,
  className,
  ...props
}: MobilePlayerRailProps) {
  return (
    <div className={cx(classes.rail, className)} data-side={side} {...props}>
      <div className={classes.railLeft}>{left}</div>
      <div className={classes.railCenter}>{center}</div>
      <div className={classes.railRight}>{right}</div>
    </div>
  );
}

export interface MobileBattlefieldLaneProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  side?: "opponent" | "player";
  priority?: boolean;
  scrollAxis?: FieldScrollAxis;
  scrollTargetSelector?: string;
  scrollCueLabel?: string;
  scrollCues?: FieldOverflowState;
}

export function MobileBattlefieldLane({
  children,
  side,
  priority,
  scrollAxis = "horizontal",
  scrollTargetSelector,
  scrollCueLabel = "field cards",
  scrollCues,
  className,
  ...props
}: MobileBattlefieldLaneProps) {
  const laneRef = useRef<HTMLDivElement | null>(null);
  const [measuredOverflow, setMeasuredOverflow] = useState<FieldOverflowState>(EMPTY_OVERFLOW);
  const overflow = scrollCues ?? measuredOverflow;

  useEffect(() => {
    if (scrollCues) {
      return;
    }
    const lane = laneRef.current;
    const scroller = scrollTargetSelector
      ? lane?.querySelector<HTMLElement>(scrollTargetSelector)
      : lane;
    if (!scroller) {
      setMeasuredOverflow(EMPTY_OVERFLOW);
      return;
    }

    let frame: number | null = null;
    const readOverflow = (): FieldOverflowState => {
      const overflowSize =
        scrollAxis === "horizontal"
          ? scroller.scrollWidth - scroller.clientWidth
          : scroller.scrollHeight - scroller.clientHeight;
      const overflows = overflowSize > SCROLL_EPSILON;
      if (!overflows) {
        return EMPTY_OVERFLOW;
      }
      const measuredChildren = measureOffscreenChildren(scroller, scrollAxis);
      if (!measuredChildren.before && !measuredChildren.after) {
        return EMPTY_OVERFLOW;
      }
      return measuredChildren;
    };
    const update = () => {
      frame = null;
      const next = readOverflow();
      setMeasuredOverflow((current) => (fieldOverflowMatches(current, next) ? current : next));
    };
    const scheduleUpdate = () => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
      frame = window.requestAnimationFrame(update);
    };

    update();
    scroller.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(scheduleUpdate);
    observer?.observe(scroller);
    for (const child of Array.from(scroller.children)) {
      if (child instanceof HTMLElement) {
        observer?.observe(child);
      }
    }

    return () => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
      scroller.removeEventListener("scroll", update);
      window.removeEventListener("resize", scheduleUpdate);
      observer?.disconnect();
    };
  }, [scrollAxis, scrollCueLabel, scrollCues, scrollTargetSelector]);

  const scrollLaneToEdge = (direction: 1 | -1) => {
    const lane = laneRef.current;
    const scroller = scrollTargetSelector
      ? lane?.querySelector<HTMLElement>(scrollTargetSelector)
      : lane;
    if (!scroller) {
      return;
    }
    const target =
      direction < 0
        ? 0
        : scrollAxis === "horizontal"
          ? scroller.scrollWidth - scroller.clientWidth
          : scroller.scrollHeight - scroller.clientHeight;
    scroller.scrollTo(
      scrollAxis === "horizontal"
        ? { left: target, behavior: "smooth" }
        : { top: target, behavior: "smooth" },
    );
  };

  return (
    <div
      ref={laneRef}
      className={cx(classes.lane, className)}
      data-side={side}
      data-priority={priority ? "true" : "false"}
      data-scroll-axis={scrollAxis}
      {...props}
    >
      {children}
      {overflow.before ? (
        <button
          type="button"
          className={cx(
            classes.laneScrollCue,
            scrollAxis === "horizontal" ? classes.laneScrollCueStart : classes.laneScrollCueTop,
          )}
          onClick={() => scrollLaneToEdge(-1)}
          aria-label={`Jump to ${scrollCueEdgeLabel(-1, scrollAxis)} edge of ${scrollCueLabel}`}
        >
          {scrollCueText({ direction: -1, axis: scrollAxis })}
        </button>
      ) : null}
      {overflow.after ? (
        <button
          type="button"
          className={cx(
            classes.laneScrollCue,
            scrollAxis === "horizontal" ? classes.laneScrollCueEnd : classes.laneScrollCueBottom,
          )}
          onClick={() => scrollLaneToEdge(1)}
          aria-label={`Jump to ${scrollCueEdgeLabel(1, scrollAxis)} edge of ${scrollCueLabel}`}
        >
          {scrollCueText({ direction: 1, axis: scrollAxis })}
        </button>
      ) : null}
    </div>
  );
}

export interface MobileHandDockProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function MobileHandDock({ children, className, ...props }: MobileHandDockProps) {
  return (
    <div className={cx(classes.handDock, className)} {...props}>
      {children}
    </div>
  );
}

export interface MobileMirrorLedgerProps extends HTMLAttributes<HTMLElement> {
  left: ReactNode;
  center?: ReactNode;
  right: ReactNode;
}

export function MobileMirrorLedger({
  left,
  center,
  right,
  className,
  ...props
}: MobileMirrorLedgerProps) {
  const hasCenter = center !== null && center !== undefined && center !== false;

  return (
    <section
      className={cx(classes.mirrorLedger, className)}
      data-has-center={hasCenter ? "true" : "false"}
      {...props}
    >
      <div className={classes.mirrorLedgerSide} data-ledger-side="left">
        {left}
      </div>
      {hasCenter ? <div className={classes.mirrorLedgerCenter}>{center}</div> : null}
      <div className={classes.mirrorLedgerSide} data-ledger-side="right">
        {right}
      </div>
    </section>
  );
}

export interface MobileZoneInventoryPopoverProps extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode;
  children: ReactNode;
  panelLabel?: string;
  placement?: "bottom-end" | "bottom-start" | "top-end" | "top-start";
  scrollTarget?: string | null;
}

export function MobileZoneInventoryPopover({
  label = "Zones",
  children,
  panelLabel = "Zone inventory",
  placement = "bottom-end",
  scrollTarget,
  className,
  ...props
}: MobileZoneInventoryPopoverProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open || !scrollTarget) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      const target = panelRef.current?.querySelector<HTMLElement>(
        `[data-zone-inventory-section="${scrollTarget}"]`,
      );
      if (target?.scrollIntoView) {
        target.scrollIntoView({ block: "start", behavior: "auto" });
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [open, scrollTarget]);

  useEffect(() => {
    if (!open) return;

    const handleOutsidePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (popoverRef.current?.contains(target)) {
        return;
      }

      setOpen(false);
    };

    document.addEventListener("pointerdown", handleOutsidePointerDown, true);

    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointerDown, true);
    };
  }, [open]);

  return (
    <div ref={popoverRef} className={cx(classes.zonePopover, className)} {...props}>
      <button
        type="button"
        className={classes.zonePopoverButton}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((current) => !current)}
      >
        {label}
      </button>
      {open ? (
        <div
          ref={panelRef}
          id={panelId}
          className={classes.zonePopoverPanel}
          data-placement={placement}
          role="dialog"
          aria-label={panelLabel}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
