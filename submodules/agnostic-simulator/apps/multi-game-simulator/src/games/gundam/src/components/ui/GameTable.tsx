import { useEffect, useRef, useState } from "react";

import { useLayoutMode } from "../../lib/use-layout-mode.ts";
import { CardHoverPreview } from "./card/CardHoverPreview.tsx";

interface VerticalOverflow {
  readonly before: "field" | "board" | null;
  readonly after: "field" | "board" | "hand" | null;
}

export function GameTable({ children }: { children: React.ReactNode }) {
  const tableRef = useRef<HTMLElement>(null);
  const layoutMode = useLayoutMode();
  const [verticalOverflow, setVerticalOverflow] = useState<VerticalOverflow>({
    before: null,
    after: null,
  });

  useEffect(() => {
    const table = tableRef.current;
    if (!table || layoutMode !== "mobile") {
      setVerticalOverflow({ before: null, after: null });
      return;
    }

    // Mobile seats preserve enough space for paired cards. Portrait starts at
    // the viewer's hand and resources. Short landscape starts at the actionable
    // battlefield because a full seat cannot fit; the hand remains one swipe
    // below and the opponent remains above. Seat heights can settle when a fixture
    // or route finishes loading, so observe them until real overflow exists.
    // Keep following later seat-height changes while the player remains at the
    // viewer edge. Drawing cards and adding Resources can make the bottom seat
    // taller after a turn transition; a one-shot alignment leaves that new
    // content hidden beneath the fixed action rail.
    let frame = 0;
    let observer: ResizeObserver | null = null;
    let modalObserver: MutationObserver | null = null;
    const elementIsMateriallyVisible = (element: HTMLElement, visibleRatio: number) => {
      const tableRect = table.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const elementHeight = elementRect.height || elementRect.bottom - elementRect.top;
      if (elementHeight <= 0 || table.clientHeight <= 0) return false;

      const viewportTop = tableRect.top;
      const viewportBottom = viewportTop + table.clientHeight;
      const visibleHeight = Math.max(
        0,
        Math.min(elementRect.bottom, viewportBottom) - Math.max(elementRect.top, viewportTop),
      );

      return visibleHeight >= Math.min(120, elementHeight * visibleRatio);
    };
    const fieldIsMateriallyVisible = (side: "top" | "bottom") => {
      const field = table.querySelector<HTMLElement>(
        `[data-seat-side="${side}"] [data-seat-row="field"]`,
      );
      if (!field) return false;

      // A field cue is useful while its battlefield is genuinely offscreen.
      // Once a recognizable slice of the row is visible, the cards themselves
      // communicate that the board continues in that direction. Keeping the
      // cue past that point only covers dense three-card mobile fields.
      return elementIsMateriallyVisible(field, 0.35);
    };
    const fieldHasContent = (side: "top" | "bottom") =>
      table.querySelector(
        `[data-seat-side="${side}"] [data-seat-row="field"] :is([data-sim-entity-id], [data-actionable="true"], [data-fixed-slot-card-zone][data-slot-count]:not([data-slot-count="0"]))`,
      ) !== null;
    const boardDestinationIsMateriallyVisible = (side: "top" | "bottom") => {
      if (fieldHasContent(side)) return fieldIsMateriallyVisible(side);
      const resources = table.querySelector<HTMLElement>(
        `[data-seat-side="${side}"] [data-seat-row="resources"]`,
      );
      return resources ? elementIsMateriallyVisible(resources, 0.6) : false;
    };
    const updateOverflow = () => {
      const maximumScroll = Math.max(0, table.scrollHeight - table.clientHeight);
      const modalOpen = table.querySelector('[role="dialog"][aria-modal="true"]') !== null;
      const canScrollAfter = table.scrollTop < maximumScroll - 2;
      const viewerDestinationVisible = boardDestinationIsMateriallyVisible("bottom");
      const actionableHandCard = table.querySelector<HTMLElement>(
        '[data-seat-side="bottom"] [data-seat-row="hand"] [data-draggable="true"]',
      );
      const visibleActionableHand = actionableHandCard
        ? elementIsMateriallyVisible(actionableHandCard, 0.7)
        : false;
      const actionableHandVisible = actionableHandCard ? visibleActionableHand : true;
      const after =
        modalOpen || !canScrollAfter
          ? null
          : !viewerDestinationVisible
            ? fieldHasContent("bottom")
              ? "field"
              : "board"
            : !actionableHandVisible
              ? "hand"
              : null;
      const next: VerticalOverflow = {
        before:
          !modalOpen &&
          !visibleActionableHand &&
          table.scrollTop > 2 &&
          !boardDestinationIsMateriallyVisible("top")
            ? fieldHasContent("top")
              ? "field"
              : "board"
            : null,
        after,
      };
      setVerticalOverflow((current) =>
        current.before === next.before && current.after === next.after ? current : next,
      );
    };
    const viewerScrollTarget = () => {
      const maximumScroll = Math.max(0, table.scrollHeight - table.clientHeight);
      if (window.innerHeight > 520) return maximumScroll;

      const viewerField = table.querySelector<HTMLElement>(
        '[data-seat-side="bottom"] [data-seat-row="field"]',
      );
      const fieldScrollTarget = () => {
        if (!viewerField) return maximumScroll;
        const tableTop = table.getBoundingClientRect().top;
        const fieldTop = viewerField.getBoundingClientRect().top - tableTop + table.scrollTop;
        return Math.max(0, Math.min(maximumScroll, fieldTop));
      };
      const actionableFieldCard = viewerField?.querySelector<HTMLElement>(
        '[data-actionable="true"], [data-draggable="true"]',
      );
      if (actionableFieldCard) return fieldScrollTarget();

      const actionableHandCard = table.querySelector<HTMLElement>(
        '[data-seat-side="bottom"] [data-seat-row="hand"] [data-draggable="true"]',
      );
      if (actionableHandCard) return maximumScroll;

      const occupiedSlots = viewerField?.querySelector<HTMLElement>(
        '[data-fixed-slot-card-zone][data-slot-count]:not([data-slot-count="0"])',
      );
      if (!viewerField || !occupiedSlots) return maximumScroll;

      return fieldScrollTarget();
    };
    let stickToViewerEdge = true;
    const updateStickiness = () => {
      stickToViewerEdge = Math.abs(viewerScrollTarget() - table.scrollTop) <= 12;
      updateOverflow();
    };
    const scheduleAlignment = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        if (!stickToViewerEdge) return;
        table.scrollTop = viewerScrollTarget();
        updateOverflow();
      });
    };
    observer = new ResizeObserver(scheduleAlignment);
    modalObserver = new MutationObserver(updateOverflow);
    table.addEventListener("scroll", updateStickiness, { passive: true });
    window.addEventListener("resize", scheduleAlignment);
    modalObserver.observe(table, { childList: true, subtree: true });

    const seats = table.querySelectorAll<HTMLElement>("[data-seat-side]");
    if (seats.length > 0) {
      seats.forEach((seat) => observer.observe(seat));
    } else {
      observer.observe(table);
    }
    scheduleAlignment();

    return () => {
      window.cancelAnimationFrame(frame);
      table.removeEventListener("scroll", updateStickiness);
      window.removeEventListener("resize", scheduleAlignment);
      observer?.disconnect();
      modalObserver?.disconnect();
    };
  }, [layoutMode]);

  const scrollToEdge = (edge: "rival" | "player") => {
    const table = tableRef.current;
    if (!table) return;
    table.scrollTo({
      top: edge === "rival" ? 0 : Math.max(0, table.scrollHeight - table.clientHeight),
      behavior: "smooth",
    });
  };

  return (
    <section
      ref={tableRef}
      className="board-bg flex h-full min-h-0 min-w-0 flex-1 flex-col relative overflow-hidden"
      data-sim-board
    >
      {layoutMode === "mobile" && verticalOverflow.before ? (
        <button
          type="button"
          className="sticky top-[var(--board-scroll-cue-inset)] z-[35] ml-auto mr-2 -mb-11 flex min-h-11 items-center gap-1 rounded-full border border-hud-border-hot bg-hud-deep/95 px-3 text-hud-xs font-bold text-hud-accent shadow-lg"
          data-board-scroll-cue
          aria-label={verticalOverflow.before === "field" ? "View rival field" : "View rival board"}
          onClick={() => scrollToEdge("rival")}
        >
          <span aria-hidden="true">↑</span>
          {verticalOverflow.before === "field" ? "Rival field" : "Rival board"}
        </button>
      ) : null}
      {children}
      {layoutMode === "mobile" && verticalOverflow.after ? (
        <button
          type="button"
          className="sticky bottom-[var(--board-scroll-cue-inset)] z-[35] ml-auto mr-2 -mt-11 flex min-h-11 items-center gap-1 rounded-full border border-hud-border-hot bg-hud-deep/95 px-3 text-hud-xs font-bold text-hud-accent shadow-lg"
          data-board-scroll-cue
          aria-label={
            verticalOverflow.after === "hand"
              ? "View your hand"
              : verticalOverflow.after === "field"
                ? "Return to your field"
                : "View your board"
          }
          onClick={() => scrollToEdge("player")}
        >
          {verticalOverflow.after === "hand"
            ? "Hand"
            : verticalOverflow.after === "field"
              ? "Your field"
              : "Your board"}
          <span aria-hidden="true">↓</span>
        </button>
      ) : null}
      <CardHoverPreview />
    </section>
  );
}
