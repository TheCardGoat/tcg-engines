import { memo } from "react";
import { motion, useReducedMotion } from "motion/react";

export type TargetingArrowVariant = "candidate" | "attack" | "redirect" | "effect" | "history";

interface TargetingArrowProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  curved?: boolean;
  animated?: boolean;
  color?: string;
  variant?: TargetingArrowVariant;
}

export const TargetingArrow = memo(function TargetingArrow({
  x1,
  y1,
  x2,
  y2,
  curved = true,
  animated = true,
  color = "var(--game-accent)",
  variant = "candidate",
}: TargetingArrowProps) {
  const prefersReducedMotion = useReducedMotion();
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const controlX = curved ? midX : midX;
  const controlY = curved ? Math.min(y1, y2) - Math.abs(x2 - x1) * 0.25 : midY;

  const pathD = curved
    ? `M ${x1} ${y1} Q ${controlX} ${controlY} ${x2} ${y2}`
    : `M ${x1} ${y1} L ${x2} ${y2}`;

  const arrowHeadSize = variant === "candidate" ? 9 : variant === "history" ? 11 : 13;
  const strokeWidth = variant === "candidate" ? 2.5 : variant === "history" ? 3 : 4;
  const opacity = variant === "history" ? 0.42 : 0.94;
  const dashPattern =
    variant === "history"
      ? "5 7"
      : variant === "attack"
        ? "11 7"
        : variant === "effect"
          ? "6 5"
          : "8 6";
  const dashOffset = variant === "attack" ? -36 : variant === "effect" ? -32 : -28;
  const shouldAnimate = animated && !prefersReducedMotion && variant !== "history";
  const angle = Math.atan2(y2 - controlY, x2 - controlX);
  const arrowX1 = x2 - arrowHeadSize * Math.cos(angle - Math.PI / 6);
  const arrowY1 = y2 - arrowHeadSize * Math.sin(angle - Math.PI / 6);
  const arrowX2 = x2 - arrowHeadSize * Math.cos(angle + Math.PI / 6);
  const arrowY2 = y2 - arrowHeadSize * Math.sin(angle + Math.PI / 6);

  return (
    <g
      className={shouldAnimate ? "targeting-arrow-animated" : ""}
      data-targeting-arrow-variant={variant}
      data-targeting-arrow-animated={shouldAnimate ? "true" : "false"}
    >
      <path
        d={pathD}
        fill="none"
        stroke="rgba(5, 9, 18, 0.82)"
        strokeWidth={strokeWidth + 4}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={variant === "history" ? 0.36 : 0.72}
      />
      <motion.path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={opacity}
        strokeDasharray={dashPattern}
        initial={false}
        animate={shouldAnimate ? { strokeDashoffset: [0, dashOffset] } : { strokeDashoffset: 0 }}
        transition={
          shouldAnimate
            ? { duration: variant === "redirect" ? 0.62 : 0.9, ease: "linear", repeat: Infinity }
            : { duration: 0 }
        }
      />
      <polygon
        points={`${x2},${y2} ${arrowX1},${arrowY1} ${arrowX2},${arrowY2}`}
        fill={color}
        stroke="rgba(5, 9, 18, 0.82)"
        strokeWidth="1.5"
        opacity={opacity}
      />
    </g>
  );
});
