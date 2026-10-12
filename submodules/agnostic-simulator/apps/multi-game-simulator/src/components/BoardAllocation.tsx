import { useEffect, useRef, useState } from "react";
import { pointerWithin, rectIntersection } from "@dnd-kit/core";
import { EntityAllocationValue, type EntityAllocationInput } from "@tcg/protocol";
import { resolutionFocusPose } from "@tcg/simulator-presentation/targeted-resolution";
import {
  PointerDragDropSurface,
  PointerDraggable,
  PointerDroppable,
  useInteractionDraft,
  useInteractionSurface,
} from "@tcg/simulator-ui";
import "./board-allocation.css";

type Anchor = { id: string; left: number; top: number; width: number; height: number };
/** Uses the production draft. Board positions and labels are viewer-safe inputs. */
export function BoardAllocation({
  input,
  surface,
  anchors,
  labels,
  sourceArt,
  reducedMotion,
  onAdjust,
}: {
  input: EntityAllocationInput | undefined;
  surface: ReturnType<typeof useInteractionSurface>;
  anchors: readonly Anchor[];
  labels: ReadonlyMap<string, string>;
  sourceArt?: string;
  reducedMotion: boolean;
  onAdjust: () => void;
}) {
  const draft = useInteractionDraft();
  const [notice, setNotice] = useState("");
  const [hovered, setHovered] = useState<string | null>(null);
  const decline = useRef(false);
  const autoSent = useRef("");
  const focusRef = useRef<HTMLDivElement | null>(null);
  const activeInput = input;
  const activeSourceId = surface.action?.source?.instanceId;
  const parsed = activeInput
    ? EntityAllocationValue.safeParse(surface.values[activeInput.id])
    : ({ success: false } as const);
  const value = parsed.success ? parsed.data : {};
  const total = Object.values(value).reduce((sum, n) => sum + n, 0);
  const remaining = (activeInput?.totalMax ?? total) - total;
  const recipients = Object.values(value).filter((n) => n > 0).length;
  const activeSourceArt = sourceArt;
  const sourceId = activeSourceId;
  const sourceAnchor = anchors.find((a) => a.id === sourceId);
  const sourceName = sourceId ? (labels.get(sourceId) ?? "This card") : "This card";
  const focus = resolutionFocusPose(window.innerWidth, window.innerHeight);
  const ready = surface.canConfirm && total > 0;
  useEffect(() => {
    if (decline.current && surface.canConfirm) {
      decline.current = false;
      surface.confirm();
    }
  }, [surface]);
  // The division submits itself once every point is placed; a short grace shows the completed state.
  const autoKey = `${surface.requestId}:${total}`;
  useEffect(() => {
    if (!ready || surface.rejected || surface.locked) return;
    if (autoSent.current === autoKey) return;
    const t = setTimeout(
      () => {
        autoSent.current = autoKey;
        // Submit intent only. Confirmed board changes own audiovisual feedback.
        surface.confirm();
      },
      reducedMotion ? 150 : 450,
    );
    return () => clearTimeout(t);
  }, [autoKey, ready, reducedMotion, surface]);
  if (!activeInput) return null;
  const change = (id: string, delta: number) => {
    const candidate = activeInput.candidates.find((c) => c.entity.instanceId === id);
    const amount = (value[id] ?? 0) + delta;
    const count = Object.values(value).filter((n) => n > 0).length;
    if (
      surface.locked ||
      !candidate ||
      candidate.enabled === false ||
      amount < 0 ||
      amount > candidate.max ||
      (amount > 0 && amount < candidate.min) ||
      total + delta > activeInput.totalMax ||
      (delta > 0 &&
        !value[id] &&
        activeInput.maxRecipients !== undefined &&
        count >= activeInput.maxRecipients)
    )
      return false;
    autoSent.current = "";
    const next = { ...value };
    if (amount === 0) delete next[id];
    else next[id] = amount;
    draft.change(activeInput.id, next);
    setNotice("");
    onAdjust();
    return true;
  };

  const statusText = `${remaining} of ${activeInput.totalMax} points remaining. ${total} assigned.${
    activeInput.maxRecipients !== undefined ? ` Up to ${activeInput.maxRecipients} targets.` : ""
  }`;
  const message = surface.rejected
    ? "Allocation was not accepted. Review the amounts and retry."
    : notice
      ? `${notice} ${statusText}`
      : statusText;
  const anchorById = new Map(anchors.map((a) => [a.id, a]));
  const center = (a: Anchor) => ({ x: a.left + a.width / 2, y: a.top + a.height / 2 });
  const rayExit = (a: Anchor, ux: number, uy: number) => {
    const c = center(a);
    const ts = [];
    if (ux !== 0) ts.push(((ux > 0 ? a.left + a.width : a.left) - c.x) / ux);
    if (uy !== 0) ts.push(((uy > 0 ? a.top + a.height : a.top) - c.y) / uy);
    return Math.min(...ts.filter((t) => Number.isFinite(t) && t >= 0));
  };
  const focusAnchor: Anchor = { id: "resolution-focus", ...focus };
  const tether = (from: Anchor, to: Anchor) => {
    const a = center(from);
    const b = center(to);
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const length = Math.hypot(dx, dy) || 1;
    const ux = dx / length;
    const uy = dy / length;
    const pad = 3;
    const tOut = rayExit(from, ux, uy) + pad;
    const tIn = Math.max(length - rayExit(to, -ux, -uy) - pad, tOut);
    return { x1: a.x + ux * tOut, y1: a.y + uy * tOut, x2: a.x + ux * tIn, y2: a.y + uy * tIn };
  };
  const assigned = activeInput.candidates
    .map((c) => c.entity.instanceId)
    .filter((id) => (value[id] ?? 0) > 0 && anchorById.has(id) && id !== sourceId);
  const previewId =
    hovered && hovered !== sourceId && (value[hovered] === undefined || remaining > 0)
      ? hovered
      : null;
  return (
    <PointerDragDropSurface
      id="board-allocation"
      cancelKey={`${surface.requestId}:${surface.locked}`}
      decodeSource={(id) => (id === "allocation-unit" ? id : null)}
      renderOverlay={() => <span className="tcg-allocation-marker">+1</span>}
      dropAnimation={reducedMotion ? null : { duration: 140, easing: "ease-out" }}
      collisionDetection={(args) =>
        args.pointerCoordinates ? pointerWithin(args) : rectIntersection(args)
      }
      onDragCancel={() => setNotice("Drag cancelled. Allocation unchanged.")}
      onDragEnd={(source, destination) => {
        if (source && destination && change(destination, 1)) return { kind: "accepted" };
        setNotice("No amount assigned. Drop on a highlighted card with room remaining.");
        return { kind: "rejected" };
      }}
    >
      {sourceAnchor && (
        <div
          className="tcg-allocation-veil"
          data-reduced-motion={reducedMotion || undefined}
          style={{
            left: sourceAnchor.left,
            top: sourceAnchor.top,
            width: sourceAnchor.width,
            height: sourceAnchor.height,
          }}
          aria-hidden
        />
      )}
      <svg
        className="tcg-allocation-tethers"
        data-reduced-motion={reducedMotion || undefined}
        aria-hidden
      >
        <defs>
          <marker
            id="tcg-allocation-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6.5"
            markerHeight="6.5"
            orient="auto-start-reverse"
          >
            <path d="M0 0 L10 5 L0 10 z" fill="#ffd98a" />
          </marker>
        </defs>
        {previewId && anchorById.get(previewId) && (
          <line
            className="tcg-allocation-tether tcg-allocation-tether--preview"
            {...tether(focusAnchor, anchorById.get(previewId)!)}
          />
        )}
        {assigned.map((id) => {
          const coords = tether(focusAnchor, anchorById.get(id)!);
          return (
            <g key={id}>
              <line className="tcg-allocation-tether-casing" {...coords} />
              <line
                className="tcg-allocation-tether"
                markerEnd="url(#tcg-allocation-arrow)"
                {...coords}
              />
            </g>
          );
        })}
      </svg>
      {activeInput.candidates.map((candidate) => {
        const id = candidate.entity.instanceId;
        const anchor = anchors.find((a) => a.id === id);
        if (!anchor || candidate.enabled === false) return null;
        const label = labels.get(id) ?? "Target";
        const amount = value[id] ?? 0;
        const isSource = id === sourceId;
        const limitReached =
          !amount &&
          activeInput.maxRecipients !== undefined &&
          recipients >= activeInput.maxRecipients;
        const saturated =
          surface.locked || remaining <= 0 || amount >= candidate.max || limitReached;
        return (
          <PointerDroppable
            key={id}
            id={id}
            disabled={surface.locked}
            className="tcg-allocation-target"
            data-saturated={saturated || undefined}
            data-assigned={amount > 0 || undefined}
            data-issource={isSource || undefined}
            style={{
              left: anchor.left,
              top: anchor.top,
              width: anchor.width,
              height: anchor.height,
            }}
            onMouseEnter={() => setHovered(id)}
            onMouseLeave={() => setHovered((current) => (current === id ? null : current))}
          >
            {!isSource && (
              <span className="tcg-allocation-max" aria-hidden>
                {`Max ${candidate.max}`}
              </span>
            )}
            <button
              className="tcg-allocation-hit"
              aria-label={`Allocate 1 point to ${label}`}
              disabled={saturated}
              onClick={() => change(id, 1)}
            />
            {amount > 0 && (
              <button
                className="tcg-allocation-badge"
                aria-label={`Remove 1 point from ${label}`}
                disabled={surface.locked}
                onClick={() => change(id, -1)}
              >
                <output aria-label={`${label} allocation`}>{amount}</output>
              </button>
            )}
          </PointerDroppable>
        );
      })}
      {sourceAnchor && (
        <>
          <div
            ref={focusRef}
            className="tcg-allocation-focus"
            data-ready={ready || undefined}
            style={{ left: focus.left, top: focus.top, width: focus.width, height: focus.height }}
          >
            {activeSourceArt ? (
              <img src={activeSourceArt} alt="" />
            ) : (
              <span className="tcg-allocation-focus-fallback">{sourceName}</span>
            )}
            <span className="tcg-allocation-tag">Resolving</span>
          </div>
          <section
            className="tcg-allocation-source"
            data-ready={ready || undefined}
            data-rejected={surface.rejected || undefined}
            style={{
              left: focus.left + focus.width / 2,
              top: focus.top + focus.height,
            }}
            aria-label="Point allocation"
          >
            <PointerDraggable
              id="allocation-unit"
              disabled={surface.locked || remaining <= 0}
              transformBehavior="overlay-only"
              className="tcg-allocation-pool"
              aria-label="Drag one point"
              title={surface.title}
            >
              <strong>{`÷${activeInput.totalMax}`}</strong>
              <span>{`${remaining} left`}</span>
            </PointerDraggable>
            <button
              className="tcg-allocation-icon"
              aria-label="Reset allocation"
              disabled={surface.locked || total === 0}
              onClick={() => {
                draft.change(activeInput.id, {});
                setNotice("Allocation cleared. Choose again.");
              }}
            >
              ↺
            </button>
            {activeInput.allowEmpty && (
              <button
                className="tcg-allocation-icon tcg-allocation-decline"
                aria-label="Decline effect"
                disabled={surface.locked}
                onClick={() => {
                  decline.current = true;
                  draft.change(activeInput.id, {});
                }}
              >
                ✕
              </button>
            )}
            {surface.rejected && (
              <button
                className="tcg-allocation-icon tcg-allocation-confirm"
                aria-label="Retry allocation"
                onClick={surface.confirm}
              >
                ↻
              </button>
            )}
            <span className="tcg-allocation-sr" role="status" aria-live="polite">
              {`Resolving ${sourceName}. ${message}`}
            </span>
            {(surface.rejected || notice) && (
              <span className="tcg-allocation-alert" role={surface.rejected ? "alert" : "status"}>
                {surface.rejected ? "Not accepted — review amounts" : notice}
              </span>
            )}
          </section>
        </>
      )}
    </PointerDragDropSurface>
  );
}
