import { useId } from "react";
import type { CardAnchor } from "./Scene";
import styles from "./arena3d.module.css";

/** Native legal targets stay clear while an active decision dims the rest of the table. */
export function ArenaAttentionLayer({
  anchors,
  targetIds,
  payment = false,
  engagedIds,
  paymentZone,
  sceneCueIds,
}: {
  anchors: readonly CardAnchor[];
  sceneCueIds?: ReadonlySet<string>;
  targetIds: ReadonlySet<string>;
  payment?: boolean;
  paymentZone?: CardAnchor;
  engagedIds?: ReadonlySet<string>;
}) {
  const maskId = useId();
  const targets = anchors.filter((anchor) => targetIds.has(anchor.id));
  const padding = payment ? 2 : 7;
  return (
    <svg className={styles.attentionLayer} aria-hidden="true" data-testid="arena-attention-layer">
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
          <rect width="100%" height="100%" fill="white" />
          {paymentZone && (
            <rect
              x={paymentZone.left}
              y={paymentZone.top}
              width={paymentZone.width}
              height={paymentZone.height}
              rx="8"
              fill="black"
            />
          )}
          {targets.map((anchor) => (
            <rect
              key={anchor.id}
              x={anchor.left - padding}
              y={anchor.top - padding}
              width={anchor.width + padding * 2}
              height={anchor.height + padding * 2}
              rx={payment ? 3 : 9}
              fill="black"
            />
          ))}
        </mask>
      </defs>
      <rect width="100%" height="100%" fill="#030912" opacity="0.56" mask={`url(#${maskId})`} />
      {targets.map((anchor) => {
        // Cards with scene cues already have a rim aligned with their artwork.
        if (sceneCueIds?.has(anchor.id)) return null;
        if (payment) {
          const x = anchor.left - 1;
          const y = anchor.top - 1;
          const right = x + anchor.width + 2;
          const bottom = y + anchor.height + 2;
          const corner = Math.min(10, anchor.width * 0.2);
          const engaged = engagedIds?.has(anchor.id);
          return (
            <g key={anchor.id} className={styles.paymentTarget} data-engaged={engaged || undefined}>
              <rect x={x} y={y} width={right - x} height={bottom - y} rx="3" />
              <path
                d={`M${x},${y + corner} V${y} H${x + corner}
                M${right - corner},${y} H${right} V${y + corner}
                M${right},${bottom - corner} V${bottom} H${right - corner}
                M${x + corner},${bottom} H${x} V${bottom - corner}`}
              />
            </g>
          );
        }
        return (
          <rect
            key={anchor.id}
            x={anchor.left - 6}
            y={anchor.top - 6}
            width={anchor.width + 12}
            height={anchor.height + 12}
            rx="8"
            fill="none"
            stroke="#eed39b"
            strokeOpacity="0.7"
            strokeWidth="1.5"
          />
        );
      })}
    </svg>
  );
}
