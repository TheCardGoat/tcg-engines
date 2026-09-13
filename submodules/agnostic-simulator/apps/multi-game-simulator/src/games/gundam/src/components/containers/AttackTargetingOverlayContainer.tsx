import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { useBoardProjection } from "../../game/index.ts";
import { useGundamInteractionDraft } from "../../game/interaction-draft.tsx";
import {
  isDedicatedUnitAttackTargeting,
  useGundamAttackInteraction,
} from "../attack-interactions.ts";
import type { DOMRectLike } from "../ui/types.ts";
import { findCardByInstanceId } from "./mappers.ts";

function toRectLike(r: DOMRect): DOMRectLike {
  return {
    left: r.left,
    top: r.top,
    right: r.right,
    bottom: r.bottom,
    width: r.width,
    height: r.height,
  };
}

const EMPTY_CANDIDATE_IDS: readonly string[] = [];

export function measureRect(id: string): DOMRectLike | null {
  // `data-sim-entity-id`/`data-card-id` are rendered on the battle-area
  // CardFace, the CardHoverPreview (aria-hidden), and Comms-log CardLinks.
  // Select the actual board visual rather than whichever duplicate renders
  // first in DOM order.
  const escaped =
    typeof CSS !== "undefined" && typeof CSS.escape === "function"
      ? CSS.escape(id)
      : id.replace(/["\\\n\r\f]/g, (ch) => `\\${ch}`);
  const nodes = document.querySelectorAll<HTMLElement>(
    `[data-sim-entity-id="${escaped}"], [data-card-id="${escaped}"]`,
  );
  for (const el of nodes) {
    if (el.closest("[aria-hidden='true']")) continue;
    if (el.closest("[role='log']")) continue;
    if (el.tagName === "BUTTON") continue;
    return toRectLike(el.getBoundingClientRect());
  }
  return null;
}

export function AttackTargetingOverlayContainer() {
  const draft = useGundamInteractionDraft();
  const view = useBoardProjection();
  const attackInteraction = useGundamAttackInteraction();
  const [hoveredTargetId, setHoveredTargetId] = useState<string | null>(null);
  const [rects, setRects] = useState<Record<string, DOMRectLike>>({});
  const scrollRestoreRef = useRef<{
    readonly board: HTMLElement;
    readonly scrollTop: number;
  } | null>(null);

  const attackerId = draft.sourceId;
  const isUnitTargeting = isDedicatedUnitAttackTargeting(
    draft,
    attackInteraction.unitTargetingAttackerId,
  );
  const candidateIds: readonly string[] = isUnitTargeting
    ? [...draft.candidateIds].filter((candidateId) => candidateId !== "direct")
    : EMPTY_CANDIDATE_IDS;
  const candidateKey = candidateIds.join(",");

  useEffect(() => {
    setHoveredTargetId(null);
  }, [attackerId]);

  function buildRects(): Record<string, DOMRectLike> {
    if (!attackerId) return {};
    const next: Record<string, DOMRectLike> = {};
    const attackerRect = measureRect(attackerId);
    if (attackerRect) next[attackerId] = attackerRect;
    for (const id of candidateIds) {
      const rect = measureRect(id);
      if (rect) next[id] = rect;
    }
    return next;
  }

  function revealFirstTarget() {
    const board = document.querySelector<HTMLElement>(".gundam-simulator-root [data-sim-board]");
    const firstTarget = candidateIds[0];
    const targetRect = firstTarget ? measureRect(firstTarget) : null;
    if (board && targetRect && board.scrollHeight > board.clientHeight) {
      const boardRect = board.getBoundingClientRect();
      // Leave room for the fixed instruction and the target's name above it.
      const visibleTop = boardRect.top + 100;
      if (targetRect.top < visibleTop || targetRect.bottom > boardRect.bottom) {
        board.scrollTop += targetRect.top - visibleTop;
      }
    }
  }

  useLayoutEffect(() => {
    if (!isUnitTargeting || !attackerId) {
      setRects({});
      const restore = scrollRestoreRef.current;
      if (restore) {
        scrollRestoreRef.current = null;
        restore.board.scrollTop = restore.scrollTop;
      }
      return;
    }
    const board = document.querySelector<HTMLElement>(".gundam-simulator-root [data-sim-board]");
    if (board) scrollRestoreRef.current ??= { board, scrollTop: board.scrollTop };
    revealFirstTarget();
    setRects(buildRects());
  }, [isUnitTargeting, attackerId, candidateKey]);

  useEffect(() => {
    if (!isUnitTargeting) return;
    let resizeFrame = 0;
    function updateRects() {
      setRects(buildRects());
    }
    function onResize() {
      cancelAnimationFrame(resizeFrame);
      // The responsive board restores its seat scroll in the first frame.
      // Reveal the target afterward using the final card geometry.
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = requestAnimationFrame(() => {
          revealFirstTarget();
          updateRects();
        });
      });
    }
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", updateRects, true);
    const board = document.querySelector(".gundam-simulator-root [data-sim-board]");
    const observer = new ResizeObserver(onResize);
    if (board) observer.observe(board);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", updateRects, true);
      cancelAnimationFrame(resizeFrame);
    };
  }, [attackerId, candidateKey, isUnitTargeting]);

  useEffect(() => {
    if (!isUnitTargeting) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") attackInteraction.cancelUnitTargeting();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [attackInteraction, isUnitTargeting]);

  if (!isUnitTargeting || !attackerId || candidateIds.length === 0) return null;
  if (!rects[attackerId]) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[400] cursor-default bg-transparent"
        data-testid="attack-targeting-dismiss-layer"
        onClick={attackInteraction.cancelUnitTargeting}
      />
      <div
        className="fixed left-1/2 top-4 z-[404] flex items-center gap-3 -translate-x-1/2 border border-amber-200/80 bg-hud-deep/95 px-3 py-1 font-display text-xs font-black uppercase tracking-hud-label text-amber-50 shadow-[0_0_28px_rgba(255,190,35,.45)]"
        data-testid="attack-unit-targeting-instruction"
      >
        <span role="status">Select enemy Unit</span>
        <button
          type="button"
          className="min-h-11 shrink-0 rounded border border-hud-border bg-hud-surface-raised px-3 font-body text-sm font-semibold normal-case tracking-normal text-hud-text hover:bg-hud-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-hud-accent"
          onClick={attackInteraction.cancelUnitTargeting}
        >
          Cancel
        </button>
      </div>
      {candidateIds.map((id, index) => {
        const rect = rects[id];
        if (!rect) return null;
        const pad = 7;
        const targetCard = findCardByInstanceId(view, id);
        const targetDefinition = targetCard?.definition as { name?: string } | null | undefined;
        const targetName = targetDefinition?.name ?? "enemy Unit";
        const isHovered = hoveredTargetId === id;
        const viewportWidth =
          typeof window === "undefined" ? Number.POSITIVE_INFINITY : window.innerWidth;
        const labelPositionClass =
          rect.left < 128
            ? "left-2"
            : viewportWidth - rect.right < 128
              ? "right-2"
              : "left-1/2 -translate-x-1/2";
        return (
          <button
            type="button"
            key={id}
            autoFocus={index === 0}
            data-testid={`attack-target-${id}`}
            aria-label={`Attack ${targetName}`}
            onMouseEnter={() => setHoveredTargetId(id)}
            onMouseLeave={() => setHoveredTargetId(null)}
            onClick={(event) => {
              event.stopPropagation();
              draft.toggleEntity(draft.input!.id, id);
            }}
            onKeyDown={(event) => {
              if (event.key !== "Enter" && event.key !== " ") return;
              event.preventDefault();
              event.stopPropagation();
              draft.toggleEntity(draft.input!.id, id);
            }}
            className="fixed z-[404] cursor-crosshair border-2 border-amber-200/80 bg-amber-300/5 p-0 shadow-[0_0_28px_rgba(255,190,35,.32)]"
            style={{
              left: rect.left - pad,
              top: rect.top - pad,
              width: rect.width + pad * 2,
              height: rect.height + pad * 2,
              outline: isHovered ? "3px solid rgba(255,255,255,.9)" : undefined,
              outlineOffset: 3,
            }}
          >
            <span
              className={`pointer-events-none absolute top-0 max-w-[calc(100vw-16px)] -translate-y-[calc(100%+6px)] overflow-hidden text-ellipsis whitespace-nowrap border border-amber-100/80 bg-hud-deep/95 px-2 py-1 font-display text-[10px] font-black uppercase tracking-[0.12em] text-amber-50 shadow-lg ${labelPositionClass}`}
            >
              Attack {targetName}
            </span>
          </button>
        );
      })}
    </>
  );
}
