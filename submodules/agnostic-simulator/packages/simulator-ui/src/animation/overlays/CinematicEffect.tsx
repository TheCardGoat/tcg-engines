import type { CinematicStyle } from "@tcg/protocol/animations";
import { motion } from "motion/react";

export interface CinematicPoint {
  readonly x: number;
  readonly y: number;
}

/** Fixed particle counts and deterministic geometry keep replay and fixtures repeatable. */
export function cinematicPath(source: CinematicPoint, target: CinematicPoint, chain = false) {
  if (!chain) return `M ${source.x} ${source.y} L ${target.x} ${target.y}`;
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const length = Math.hypot(dx, dy) || 1;
  return `M ${source.x} ${source.y} ${[0.2, 0.4, 0.6, 0.8]
    .map((t, i) => {
      const offset = (i % 2 ? -1 : 1) * Math.min(16, length * 0.08);
      return `L ${source.x + dx * t - (dy / length) * offset} ${source.y + dy * t + (dx / length) * offset}`;
    })
    .join(" ")} L ${target.x} ${target.y}`;
}

const connectedStyles = new Set<CinematicStyle>([
  "projectile",
  "volley",
  "beam",
  "chain",
  "tether",
  "drain",
]);

export function CinematicEffect({
  style,
  source,
  targets,
  center,
  startAtMs,
  durationMs,
  tone,
}: {
  readonly style: CinematicStyle;
  readonly source: CinematicPoint | null;
  readonly targets: readonly CinematicPoint[];
  readonly center: CinematicPoint | null;
  readonly startAtMs: number;
  readonly durationMs: number;
  readonly tone?: "positive" | "negative" | "neutral";
}) {
  const connected = connectedStyles.has(style);
  // Missing endpoints must never point at an unrelated card or at viewport (0, 0).
  const points = connected
    ? source
      ? targets
      : []
    : targets.length
      ? targets
      : center
        ? [center]
        : [];
  const color =
    tone === "positive"
      ? "var(--game-positive, #78d8b1)"
      : tone === "negative"
        ? "var(--game-negative, #f18e87)"
        : "color-mix(in srgb, var(--game-accent, #e0aa57) 65%, white)";
  const duration = durationMs / 1000;
  const delay = startAtMs / 1000;
  return (
    <motion.g
      data-cinematic-style={style}
      fill="none"
      stroke={color}
      strokeWidth={3}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ delay, duration, times: [0, 0.12, 0.78, 1] }}
    >
      {points.map((target, index) => {
        // Chain visits targets in engine-provided order. Drain travels in reverse.
        const origin = style === "chain" && index > 0 ? points[index - 1]! : source;
        const from = style === "drain" ? target : origin;
        const to = style === "drain" ? origin : target;
        const beatDelay =
          delay + (style === "chain" ? (index / Math.max(1, points.length)) * duration * 0.45 : 0);
        const travel = duration * (style === "chain" ? 0.4 / Math.max(1, points.length) : 0.48);
        return (
          <g key={index} data-cinematic-target={index}>
            {connected && from && to && (
              <>
                <motion.path
                  d={cinematicPath(from, to, style === "chain")}
                  strokeWidth={style === "beam" ? 9 : 2}
                  strokeLinecap="round"
                  strokeDasharray={style === "tether" ? "5 7" : undefined}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: [0, 1, 1], opacity: [0, 0.85, 0] }}
                  transition={{ delay: beatDelay, duration: duration * 0.85, times: [0, 0.5, 1] }}
                />
                {(style === "projectile" || style === "volley" || style === "drain") &&
                  Array.from({ length: style === "volley" ? 3 : 1 }, (_, particle) => (
                    <motion.circle
                      key={particle}
                      r={style === "drain" ? 5 : 7}
                      fill={color}
                      stroke="none"
                      initial={{ cx: from.x, cy: from.y, opacity: 0 }}
                      animate={{
                        cx: [from.x, (from.x + to.x) / 2, to.x],
                        cy: [
                          from.y,
                          (from.y + to.y) / 2 - (style === "volley" ? 30 + particle * 12 : 0),
                          to.y,
                        ],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        delay: beatDelay + duration * particle * 0.1,
                        duration: travel,
                        times: [0, 0.5, 1],
                        ease: "easeIn",
                      }}
                    />
                  ))}
              </>
            )}
            <g transform={`translate(${target.x} ${target.y})`}>
              {(style === "burst" ||
                style === "projectile" ||
                style === "volley" ||
                style === "chain" ||
                style === "beam") &&
                Array.from({ length: 8 }, (_, ray) => {
                  const angle = (ray * Math.PI) / 4;
                  return (
                    <motion.line
                      key={ray}
                      x1={Math.cos(angle) * 12}
                      y1={Math.sin(angle) * 12}
                      x2={Math.cos(angle) * 38}
                      y2={Math.sin(angle) * 38}
                      initial={{ scale: 0.3, opacity: 0 }}
                      animate={{ scale: [0.3, 1.2], opacity: [1, 0] }}
                      transition={{
                        delay: beatDelay + (connected ? travel : duration * 0.2),
                        duration: duration * 0.35,
                      }}
                    />
                  );
                })}
              {(style === "wave" || style === "aura" || style === "summon") &&
                [0, 1, 2].map((ring) => (
                  <motion.circle
                    key={ring}
                    r={style === "wave" ? 110 : 55}
                    initial={{ scale: style === "summon" ? 1.8 : 0.15, opacity: 0 }}
                    animate={{
                      scale: style === "summon" ? [1.8, 0.25] : [0.15, style === "aura" ? 1 : 1.8],
                      opacity: [0, 0.7, 0],
                    }}
                    transition={{ delay: delay + ring * duration * 0.13, duration: duration * 0.6 }}
                  />
                ))}
              {style === "shield" && (
                <motion.path
                  d="M 0 -66 L 49 -43 L 42 25 Q 25 57 0 72 Q -25 57 -42 25 L -49 -43 Z"
                  fill={color}
                  fillOpacity={0.12}
                  initial={{ scale: 0.65, pathLength: 0 }}
                  animate={{ scale: [0.65, 1.08, 1], pathLength: [0, 1, 1] }}
                  transition={{ delay, duration: duration * 0.65 }}
                />
              )}
              {style === "heal" &&
                [-22, 0, 22].map((x, i) => (
                  <motion.path
                    key={x}
                    d={`M ${x - 6} 0 h 12 M ${x} -6 v 12`}
                    strokeWidth={4}
                    initial={{ y: 25, opacity: 0 }}
                    animate={{ y: [25, -45], opacity: [0, 1, 0] }}
                    transition={{ delay: delay + i * duration * 0.1, duration: duration * 0.7 }}
                  />
                ))}
              {style === "sweep" && (
                <motion.rect
                  x={-9}
                  y={-100}
                  width={18}
                  height={200}
                  rx={9}
                  fill={color}
                  stroke="none"
                  initial={{ x: -180, opacity: 0 }}
                  animate={{ x: [-180, 180], opacity: [0, 0.7, 0] }}
                  transition={{ delay, duration, ease: "easeInOut" }}
                />
              )}
              {style === "dissolve" &&
                Array.from({ length: 12 }, (_, i) => (
                  <motion.rect
                    key={i}
                    x={((i % 3) - 1) * 28}
                    y={(Math.floor(i / 3) - 1.5) * 28}
                    width={12}
                    height={12}
                    fill={color}
                    stroke="none"
                    initial={{ opacity: 0, y: 0 }}
                    animate={{
                      opacity: [0, 0.7, 0],
                      y: [0, -25 - i * 3],
                      rotate: [0, i % 2 ? 60 : -60],
                      scale: [1, 0.1],
                    }}
                    transition={{ delay: delay + i * duration * 0.025, duration: duration * 0.65 }}
                  />
                ))}
            </g>
          </g>
        );
      })}
    </motion.g>
  );
}
