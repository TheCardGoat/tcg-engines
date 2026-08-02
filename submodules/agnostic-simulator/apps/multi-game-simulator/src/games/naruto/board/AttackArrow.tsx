/**
 * Bezier attack arrow overlay (baseline port, SVG + rAF, no libs):
 *  - quadratic bezier with a perpendicular-offset control point
 *    (min(58, 0.16 * distance)) so the arc is consistent at any angle;
 *  - 13/8 marching dashes (attack-arrow-flow), arrowhead marker, origin square;
 *  - attacker POWER NUMBER rendered at the curve midpoint;
 *  - rotating-dash reticle ring on the hovered/locked target;
 *  - while an attack draft is armed and no target is hovered, the arrow
 *    tracks the pointer; hovering a legal target snaps + locks the reticle.
 * Geometry recomputes each frame but only writes when it moves >0.5px.
 */

import { useEffect, useRef, type RefObject } from "react";

import type { AttackView } from "../projection/projectSimulator.ts";
import animations from "./animations.module.css";
import classes from "./board.module.css";
import type { AttackDraft } from "./types.ts";

export interface AttackArrowProps {
  readonly boardRef: RefObject<HTMLDivElement | null>;
  readonly attack: AttackView | null;
  readonly draft: AttackDraft | null;
}

interface Point {
  x: number;
  y: number;
}

function centerOf(el: Element, relativeTo: DOMRect): Point {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2 - relativeTo.left,
    y: rect.top + rect.height / 2 - relativeTo.top,
  };
}

function findUid(board: Element, uid: string): Element | null {
  return board.querySelector(`[data-board-uid="${CSS.escape(uid)}"]`);
}

/** Quadratic bezier with perpendicular control offset; ends trimmed to card edges. */
function buildPath(from: Point, to: Point): { d: string; mid: Point; angle: number } {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.hypot(dx, dy) || 1;
  const ux = dx / distance;
  const uy = dy / distance;
  // trim start/end so the line starts/ends at card edges
  const start: Point = { x: from.x + ux * 3, y: from.y + uy * 3 };
  const end: Point = { x: to.x - ux * 7, y: to.y - uy * 7 };
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;
  const offset = Math.min(58, 0.16 * distance);
  // perpendicular (rotate unit vector 90deg)
  const control: Point = { x: midX - uy * offset, y: midY + ux * offset };
  const mid: Point = {
    x: 0.25 * start.x + 0.5 * control.x + 0.25 * end.x,
    y: 0.25 * start.y + 0.5 * control.y + 0.25 * end.y,
  };
  return {
    d: `M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`,
    mid,
    angle: (Math.atan2(end.y - control.y, end.x - control.x) * 180) / Math.PI,
  };
}

export function AttackArrow({ boardRef, attack, draft }: AttackArrowProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const lineRef = useRef<SVGPathElement | null>(null);
  const trailRef = useRef<SVGPathElement | null>(null);
  const headRef = useRef<SVGPolygonElement | null>(null);
  const originRef = useRef<SVGRectElement | null>(null);
  const ringRef = useRef<SVGCircleElement | null>(null);
  const powerGroupRef = useRef<SVGGElement | null>(null);
  const powerTextRef = useRef<SVGTextElement | null>(null);
  const pointerRef = useRef<Point | null>(null);
  const lastDRef = useRef("");

  const sourceUid = attack?.attackerUid ?? draft?.attackerUid ?? null;
  const lockedTargetUid = attack?.targetUid ?? draft?.hoverUid ?? null;
  const power = attack?.power ?? draft?.power ?? 0;

  useEffect(() => {
    const board = boardRef.current;
    const svg = svgRef.current;
    if (!board || !svg || !sourceUid) return;

    const onPointerMove = (event: PointerEvent) => {
      const rect = svg.getBoundingClientRect();
      pointerRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };
    if (draft) {
      board.addEventListener("pointermove", onPointerMove);
    }

    let frame = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      const sourceEl = findUid(board, sourceUid);
      if (!sourceEl) return;
      const svgRect = svg.getBoundingClientRect();
      const from = centerOf(sourceEl, svgRect);

      let to: Point | null = null;
      let ringAt: Point | null = null;
      if (lockedTargetUid) {
        const targetEl = findUid(board, lockedTargetUid);
        if (targetEl) {
          to = centerOf(targetEl, svgRect);
          ringAt = to;
        }
      } else if (draft && pointerRef.current) {
        to = pointerRef.current;
      }
      if (!to) return;

      const { d, mid, angle } = buildPath(from, to);
      if (Math.abs(d.length - lastDRef.current.length) > 0 || d !== lastDRef.current) {
        // cheap change gate: skip sub-pixel writes
        const prev = lastDRef.current;
        lastDRef.current = d;
        if (prev === "" || d !== prev) {
          lineRef.current?.setAttribute("d", d);
          trailRef.current?.setAttribute("d", d);
          headRef.current?.setAttribute("transform", `translate(${to.x} ${to.y}) rotate(${angle})`);
          originRef.current?.setAttribute("x", String(from.x - 4));
          originRef.current?.setAttribute("y", String(from.y - 4));
          powerGroupRef.current?.setAttribute("transform", `translate(${mid.x} ${mid.y})`);
          if (powerTextRef.current) powerTextRef.current.textContent = String(power);
          if (ringRef.current && ringAt) {
            ringRef.current.setAttribute("cx", String(ringAt.x));
            ringRef.current.setAttribute("cy", String(ringAt.y));
          }
        }
      }
      if (powerTextRef.current) powerTextRef.current.textContent = String(power);
      if (ringRef.current) ringRef.current.style.display = ringAt ? "" : "none";
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      board.removeEventListener("pointermove", onPointerMove);
      lastDRef.current = "";
    };
  }, [boardRef, sourceUid, lockedTargetUid, draft, power]);

  if (!sourceUid) return null;

  return (
    <svg
      ref={svgRef}
      className={`${classes.attackArrow} ${animations.arrowIn}`}
      data-testid="naruto-attack-arrow"
      aria-hidden
    >
      <defs>
        <linearGradient id="naruto-arrow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#eb6101" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#eb6101" stopOpacity="1" />
        </linearGradient>
      </defs>
      {/* target reticle ring (rotating dashes) */}
      <circle
        ref={ringRef}
        r={26}
        fill="none"
        stroke="#a33636"
        strokeWidth={2.4}
        strokeDasharray="7 7"
        className={animations.arrowRing}
        data-testid="naruto-attack-ring"
      />
      {/* soft trail + main dashed line */}
      <path
        ref={trailRef}
        d=""
        fill="none"
        stroke="#eb6101"
        strokeOpacity={0.25}
        strokeWidth={9}
        strokeLinecap="round"
      />
      <path
        ref={lineRef}
        d=""
        fill="none"
        stroke="url(#naruto-arrow-gradient)"
        strokeWidth={3.4}
        strokeDasharray="13 8"
        strokeLinecap="round"
        className={animations.arrowFlow}
        data-testid="naruto-attack-line"
      />
      {/* arrowhead */}
      <polygon ref={headRef} points="0,-7 14,0 0,7" fill="#eb6101" />
      {/* origin square */}
      <rect ref={originRef} width={8} height={8} fill="#eb6101" />
      {/* attacker power at the midpoint */}
      <g ref={powerGroupRef}>
        <circle r={14} fill="#0d1d34" stroke="#eb6101" strokeWidth={2} />
        <text
          ref={powerTextRef}
          className={classes.attackPowerBadge}
          data-testid="naruto-attack-power"
        >
          {power}
        </text>
      </g>
    </svg>
  );
}
