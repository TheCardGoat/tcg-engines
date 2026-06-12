import { useEffect, useState } from "react";

import { m } from "../../lib/i18n/messages.ts";
import { usePrefersReducedMotion } from "../../lib/use-prefers-reduced-motion.ts";
import type { AttackAttacker, AttackTarget, DOMRectLike } from "./types.ts";

const ATO_GOLD = "#2d6bff";
const ATO_GOLD_HOT = "#5a8dff";
const ATO_RED = "#ff2d7a";
const ATO_RED_DEEP = "#c8155a";

export interface AttackTargetingOverlayProps {
  readonly attacker: AttackAttacker | null;
  readonly attackerRect: DOMRectLike | null;
  readonly targets?: readonly AttackTarget[];
  readonly targetRects?: Readonly<Record<string, DOMRectLike>>;
  readonly hoveredTargetId?: string;
  readonly hoveredTarget?: AttackTarget | null;
  readonly onTargetHover?: (id: string | null) => void;
  readonly onConfirm?: (targetId: string) => void;
  readonly onCancel?: () => void;
}

export function AttackTargetingOverlay({
  attacker,
  attackerRect,
  targets = [],
  targetRects = {},
  hoveredTargetId,
  hoveredTarget,
  onTargetHover,
  onConfirm,
  onCancel,
}: AttackTargetingOverlayProps) {
  const [mouse, setMouse] = useState(() => {
    if (attackerRect) {
      return {
        x: attackerRect.left + attackerRect.width / 2,
        y: attackerRect.top - 40,
      };
    }
    return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  });

  useEffect(() => {
    function onMove(e: MouseEvent) {
      setMouse({ x: e.clientX, y: e.clientY });
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel?.();
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("keydown", onKey);
    };
  }, [onCancel]);

  if (!attacker || !attackerRect) return null;

  const ax = attackerRect.left + attackerRect.width / 2;
  const ay = attackerRect.top + attackerRect.height / 2;

  const hoveredRect = hoveredTargetId ? targetRects[hoveredTargetId] : null;
  const tx = hoveredRect ? hoveredRect.left + hoveredRect.width / 2 : mouse.x;
  const ty = hoveredRect ? hoveredRect.top + hoveredRect.height / 2 : mouse.y;

  const spotlightRects: DOMRectLike[] = [
    attackerRect,
    ...targets.map((t) => targetRects[t.id]).filter((r): r is DOMRectLike => Boolean(r)),
  ];

  return (
    <>
      <SpotlightDim rects={spotlightRects} onClick={onCancel} />
      <ArrowLayer from={{ x: ax, y: ay }} to={{ x: tx, y: ty }} locked={!!hoveredRect} />
      <DealBadge rect={attackerRect} value={attacker.strength ?? 0} />
      {hoveredRect &&
        hoveredTarget &&
        (hoveredTarget.isDirect ? (
          <DirectBadge rect={hoveredRect} />
        ) : (
          <TakeBadge
            rect={hoveredRect}
            value={attacker.strength ?? 0}
            defenderWP={hoveredTarget.willpower ?? 0}
          />
        ))}

      {targets.map((t) => {
        const r = targetRects[t.id];
        if (!r) return null;
        const pad = 6;
        return (
          <div
            key={t.id}
            data-testid={`attack-target-${t.id}`}
            onMouseEnter={() => onTargetHover?.(t.id)}
            onMouseLeave={() => onTargetHover?.(null)}
            onClick={(e) => {
              e.stopPropagation();
              onConfirm?.(t.id);
            }}
            className="fixed z-[402] cursor-crosshair"
            style={{
              left: r.left - pad,
              top: r.top - pad,
              width: r.width + pad * 2,
              height: r.height + pad * 2,
            }}
          />
        );
      })}
    </>
  );
}

interface SpotlightDimProps {
  readonly rects: readonly DOMRectLike[];
  readonly onClick?: () => void;
}

function SpotlightDim({ rects, onClick }: SpotlightDimProps) {
  const pad = 8;
  const radius = 6;

  const VW = typeof window !== "undefined" ? window.innerWidth : 1920;
  const VH = typeof window !== "undefined" ? window.innerHeight : 1080;

  const [, force] = useState(0);
  useEffect(() => {
    function r() {
      force((v) => (v + 1) % 1e6);
    }
    window.addEventListener("resize", r);
    return () => window.removeEventListener("resize", r);
  }, []);

  return (
    <svg
      onMouseDown={onClick}
      className="fixed inset-0 z-[400] w-full h-full pointer-events-auto"
      width={VW}
      height={VH}
    >
      <defs>
        <mask id="ato-spotlight-mask" maskUnits="userSpaceOnUse">
          <rect x="0" y="0" width={VW} height={VH} fill="white" />
          {rects.map((r, i) => (
            <rect
              key={i}
              x={r.left - pad}
              y={r.top - pad}
              width={r.width + pad * 2}
              height={r.height + pad * 2}
              rx={radius}
              ry={radius}
              fill="black"
            />
          ))}
        </mask>
      </defs>
      <rect
        x="0"
        y="0"
        width={VW}
        height={VH}
        fill="rgba(26,37,66,.62)"
        mask="url(#ato-spotlight-mask)"
      />
      {rects.slice(1).map((r, i) => (
        <rect
          key={`glow-${i}`}
          x={r.left - pad}
          y={r.top - pad}
          width={r.width + pad * 2}
          height={r.height + pad * 2}
          rx={radius}
          ry={radius}
          fill="none"
          stroke={ATO_GOLD}
          strokeWidth="1.5"
          opacity="0.55"
          style={{ filter: `drop-shadow(0 0 6px ${ATO_GOLD})` }}
          pointerEvents="none"
        />
      ))}
    </svg>
  );
}

interface Point {
  readonly x: number;
  readonly y: number;
}

interface ArrowLayerProps {
  readonly from: Point;
  readonly to: Point;
  readonly locked: boolean;
}

function ArrowLayer({ from, to, locked }: ArrowLayerProps) {
  const reduceMotion = usePrefersReducedMotion();
  // The targeting overlay only mounts when a pending selectTarget
  // with role "attackTarget" is active — that can't happen on the
  // server from a fresh-match snapshot — but guard defensively so a
  // future fixture with mid-battle state doesn't crash SSR.
  const VW = typeof window === "undefined" ? 1920 : window.innerWidth;
  const VH = typeof window === "undefined" ? 1080 : window.innerHeight;

  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.hypot(dx, dy);

  const attackerOnBottom = from.y > to.y;
  const sag = Math.min(60, dist * 0.18) * (attackerOnBottom ? -1 : 1);
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2 + sag;
  const path = `M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`;

  const hx = to.x - mx;
  const hy = to.y - my;
  const ang = Math.atan2(hy, hx);
  const HEAD = 18;
  const ax = to.x - Math.cos(ang) * HEAD;
  const ay = to.y - Math.sin(ang) * HEAD;
  const px = -Math.sin(ang) * HEAD * 0.55;
  const py = Math.cos(ang) * HEAD * 0.55;
  const head = `M ${to.x} ${to.y} L ${ax + px} ${ay + py} L ${ax - px} ${ay - py} Z`;

  const color = locked ? ATO_GOLD_HOT : ATO_GOLD;
  const glowCol = locked ? ATO_GOLD_HOT : ATO_GOLD;

  return (
    <svg width={VW} height={VH} className="fixed inset-0 z-[403] pointer-events-none">
      <defs>
        <filter id="ato-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient
          id="ato-shaft"
          gradientUnits="userSpaceOnUse"
          x1={from.x}
          y1={from.y}
          x2={to.x}
          y2={to.y}
        >
          <stop offset="0%" stopColor={color} stopOpacity="0.45" />
          <stop offset="60%" stopColor={color} stopOpacity="0.95" />
          <stop offset="100%" stopColor={ATO_GOLD_HOT} stopOpacity="1" />
        </linearGradient>
      </defs>

      <path
        d={path}
        stroke={glowCol}
        strokeWidth="10"
        fill="none"
        opacity="0.25"
        strokeLinecap="round"
        filter="url(#ato-glow)"
      />
      <path
        d={path}
        stroke="url(#ato-shaft)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 4px ${glowCol})` }}
      />
      <path
        d={path}
        stroke={ATO_GOLD_HOT}
        strokeWidth="1.25"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="4 8"
        opacity="0.9"
      >
        {!reduceMotion && (
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-24"
            dur="0.6s"
            repeatCount="indefinite"
          />
        )}
      </path>

      <circle
        cx={from.x}
        cy={from.y}
        r="5"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.9"
      />
      <circle cx={from.x} cy={from.y} r="2.5" fill={ATO_GOLD_HOT} />

      <path
        d={head}
        fill={color}
        stroke={ATO_GOLD_HOT}
        strokeWidth="1.2"
        strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 6px ${glowCol})` }}
      />
    </svg>
  );
}

function DealBadge({ rect, value }: { readonly rect: DOMRectLike; readonly value: number }) {
  const cx = rect.left + rect.width / 2;
  const top = rect.bottom + 6;
  return (
    <div
      className="gd-display tracking-hud-label fixed z-[404] pointer-events-none whitespace-nowrap flex items-center gap-1 text-hud-md font-black text-[#ffffff] -translate-x-1/2 pt-[3px] pr-[10px] pb-[3px] pl-2 [clip-path:polygon(6px_0,100%_0,calc(100%-6px)_100%,0_100%)] [text-shadow:0_1px_0_rgba(255,255,255,.3)]"
      style={{
        left: cx,
        top,
        background: `linear-gradient(180deg, ${ATO_GOLD} 0%, #1c4cd1 100%)`,
        border: `1px solid ${ATO_GOLD_HOT}`,
        boxShadow: `0 0 14px ${ATO_GOLD}99, 0 2px 6px rgba(0,0,0,.6)`,
      }}
    >
      <span className="text-hud-xs opacity-80">▶</span>
      DEAL {value}
    </div>
  );
}

interface TakeBadgeProps {
  readonly rect: DOMRectLike;
  readonly value: number;
  readonly defenderWP: number;
}

function TakeBadge({ rect, value, defenderWP }: TakeBadgeProps) {
  const cx = rect.left + rect.width / 2;
  const top = rect.top - 22;
  const lethal = value >= defenderWP;
  return (
    <div
      className="gd-display tracking-hud-label fixed z-[404] pointer-events-none whitespace-nowrap flex items-center gap-1 text-[#fff5d6] text-hud-md font-black -translate-x-1/2 pt-[3px] pr-[10px] pb-[3px] pl-2 [clip-path:polygon(0_0,100%_0,calc(100%-6px)_100%,6px_100%)] [text-shadow:0_1px_1px_rgba(0,0,0,.5)] [animation:gd-fade-in_.15s_ease]"
      style={{
        left: cx,
        top,
        background: lethal
          ? `linear-gradient(180deg, ${ATO_RED}, ${ATO_RED_DEEP})`
          : `linear-gradient(180deg, #ff8a3d, #8c3a0a)`,
        border: `1px solid ${lethal ? "#ffb0b8" : "#ffc79a"}`,
        boxShadow: lethal
          ? `0 0 14px ${ATO_RED}aa, 0 2px 6px rgba(0,0,0,.6)`
          : `0 0 10px rgba(255,138,61,.6), 0 2px 6px rgba(0,0,0,.6)`,
      }}
    >
      <span className="text-hud-xs opacity-90">{lethal ? "☠" : "▼"}</span>
      TAKE {value}
      {lethal && (
        <span className="ml-1 text-hud-2xs px-1 py-px tracking-hud-label bg-black/30 border border-white/25">
          KO
        </span>
      )}
    </div>
  );
}

/**
 * Hover badge anchored to the opponent's plate when the arrow is over the
 * direct-attack zone. Replaces the old confirm-dialog DIRECT button —
 * clicking the spotlight commits the direct attack, matching the official
 * Gundam digital UI where the player drags the arrow to the enemy
 * shield/base column.
 */
function DirectBadge({ rect }: { readonly rect: DOMRectLike }) {
  const cx = rect.left + rect.width / 2;
  const top = rect.top - 22;
  return (
    <div
      className="gd-display tracking-hud-label fixed z-[404] pointer-events-none whitespace-nowrap flex items-center gap-1 text-white text-hud-md font-black -translate-x-1/2 pt-[3px] pr-[10px] pb-[3px] pl-2 [clip-path:polygon(0_0,100%_0,calc(100%-6px)_100%,6px_100%)] [text-shadow:0_1px_1px_rgba(0,0,0,.5)] [animation:gd-fade-in_.15s_ease]"
      style={{
        left: cx,
        top,
        background: `linear-gradient(180deg, ${ATO_RED}, ${ATO_RED_DEEP})`,
        border: `1px solid ${ATO_RED}`,
        boxShadow: `0 0 16px ${ATO_RED}aa, 0 2px 6px rgba(26,37,66,.4)`,
      }}
    >
      <span className="text-hud-xs opacity-90">▶</span>
      {m["sim.attack.directBadge"]()}
    </div>
  );
}

export { SpotlightDim, ArrowLayer, DealBadge, TakeBadge, DirectBadge };
