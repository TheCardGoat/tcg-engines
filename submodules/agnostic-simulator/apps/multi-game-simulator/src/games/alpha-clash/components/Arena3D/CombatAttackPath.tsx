import { useId } from "react";
import type { CardAnchor } from "./Scene";
import styles from "./combat-attack-path.module.css";

/** Projected anchors follow the board camera; masking keeps the path off card faces. */
export function CombatAttackPath({
  anchors,
  clash,
  reducedMotion,
}: {
  anchors: readonly CardAnchor[];
  clash: { attackerId: string; targetId: string };
  reducedMotion: boolean;
}) {
  const id = useId().replace(/:/g, "");
  const source = anchors.find((card) => card.id === clash.attackerId);
  const target = anchors.find((card) => card.id === clash.targetId);
  if (!source || !target) return null;
  const sx = source.left + source.width / 2,
    sy = source.top + source.height / 2;
  const tx = target.left + target.width / 2,
    ty = target.top + target.height / 2;
  const dx = tx - sx,
    dy = ty - sy,
    distance = Math.hypot(dx, dy);
  if (distance < 1) return null;
  const ux = dx / distance,
    uy = dy / distance;
  const edge = (card: CardAnchor) =>
    Math.min(
      Math.abs(ux) > 0.001 ? card.width / 2 / Math.abs(ux) : Infinity,
      Math.abs(uy) > 0.001 ? card.height / 2 / Math.abs(uy) : Infinity,
    ) + 12;
  const start = edge(source),
    end = edge(target);
  if (start + end >= distance) return null;
  const x1 = sx + ux * start,
    y1 = sy + uy * start;
  const x2 = tx - ux * end,
    y2 = ty - uy * end;
  const bend = Math.min(28, (distance - start - end) * 0.12);
  const path = `M ${x1} ${y1} Q ${(x1 + x2) / 2 - uy * bend} ${(y1 + y2) / 2 + ux * bend} ${x2} ${y2}`;
  return (
    <svg
      className={styles.path}
      aria-hidden="true"
      data-testid="combat-attack-path"
      data-reduced-motion={reducedMotion || undefined}
    >
      <defs>
        <marker
          id={`${id}-head`}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="9"
          markerHeight="9"
          markerUnits="userSpaceOnUse"
          orient="auto"
        >
          <path
            d="M 1 1 L 9 5 L 1 9"
            fill="none"
            stroke="#ffb17f"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </marker>
        <mask id={`${id}-mask`}>
          <rect width="100%" height="100%" fill="white" />
          {anchors.map((card) => (
            <rect
              key={card.id}
              x={card.left - 4}
              y={card.top - 4}
              width={card.width + 8}
              height={card.height + 8}
              rx="5"
              fill="black"
            />
          ))}
        </mask>
      </defs>
      <g
        mask={`url(#${id}-mask)`}
        key={`${clash.attackerId}:${clash.targetId}`}
        className={styles.reveal}
      >
        <path d={path} fill="none" stroke="#f28458" strokeWidth="7" opacity="0.12" />
        <path
          d={path}
          fill="none"
          stroke="#ffb17f"
          strokeWidth="2"
          strokeLinecap="round"
          markerEnd={`url(#${id}-head)`}
        />
      </g>
    </svg>
  );
}
