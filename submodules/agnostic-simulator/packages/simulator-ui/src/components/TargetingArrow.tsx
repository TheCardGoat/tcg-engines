import { memo } from "react";

interface TargetingArrowProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  curved?: boolean;
  animated?: boolean;
  color?: string;
}

export const TargetingArrow = memo(function TargetingArrow({
  x1,
  y1,
  x2,
  y2,
  curved = true,
  animated = true,
  color = "var(--game-accent)",
}: TargetingArrowProps) {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const controlX = curved ? midX : midX;
  const controlY = curved ? Math.min(y1, y2) - Math.abs(x2 - x1) * 0.25 : midY;

  const pathD = curved
    ? `M ${x1} ${y1} Q ${controlX} ${controlY} ${x2} ${y2}`
    : `M ${x1} ${y1} L ${x2} ${y2}`;

  const arrowHeadSize = 8;
  const angle = Math.atan2(y2 - controlY, x2 - controlX);
  const arrowX1 = x2 - arrowHeadSize * Math.cos(angle - Math.PI / 6);
  const arrowY1 = y2 - arrowHeadSize * Math.sin(angle - Math.PI / 6);
  const arrowX2 = x2 - arrowHeadSize * Math.cos(angle + Math.PI / 6);
  const arrowY2 = y2 - arrowHeadSize * Math.sin(angle + Math.PI / 6);

  return (
    <g className={animated ? "targeting-arrow-animated" : ""}>
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
        className={animated ? "targeting-arrow-dash" : ""}
        style={
          animated
            ? { strokeDasharray: "8 6", animation: "targeting-dash-flow 1s linear infinite" }
            : undefined
        }
      />
      <polygon
        points={`${x2},${y2} ${arrowX1},${arrowY1} ${arrowX2},${arrowY2}`}
        fill={color}
        opacity="0.9"
      />
    </g>
  );
});
