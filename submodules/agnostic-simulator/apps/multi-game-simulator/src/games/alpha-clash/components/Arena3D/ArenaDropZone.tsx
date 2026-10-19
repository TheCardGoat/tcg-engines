import { Check, Diamond, Map, Shield, Swords } from "lucide-react";
import { PointerDroppable } from "@tcg/simulator-ui";
import type { CardAnchor, ZoneAnchor } from "./Scene";
import styles from "./arena-drop-zone.module.css";

export function ArenaDropZone({
  anchor,
  zone,
  destination = zone,
  label,
  description: customDescription,
}: {
  anchor: CardAnchor | ZoneAnchor;
  zone: "resource" | "clash" | "clashground" | "accessory";
  destination?: string;
  label?: string;
  description?: string;
}) {
  const Icon =
    zone === "resource" ? Diamond : zone === "clash" ? Swords : zone === "accessory" ? Shield : Map;
  const description =
    customDescription ??
    {
      resource: "Add this card to your resources",
      clash: "Play this card in your Clash zone",
      accessory: "Play this card in your Accessory zone",
      clashground: "Play this card in your Clashground zone",
    }[zone];
  const action = label ?? (zone === "resource" ? "deploy" : "play");
  const surface = "dropSurface" in anchor ? anchor.dropSurface : undefined;
  // Card anchors already contain projected screen bounds. Applying the card's
  // rotation to the drop element makes dnd-kit's transform-free measurement
  // invalid for an engaged attacker. Keep card drop hitboxes axis-aligned.
  const cardTarget = destination.startsWith("card:");
  const width = surface?.worldWidth ?? anchor.width;
  const height = surface?.worldHeight ?? anchor.height;
  const bevel = surface?.bevel ?? 12;
  const arm = surface?.arm ?? 30;
  return (
    <PointerDroppable
      id={destination}
      className={styles.zone}
      data-testid={`arena-drop-${destination}`}
      data-layout={zone === "clash" ? "field" : zone === "clashground" ? "side" : "rail"}
      style={{
        left: surface?.left ?? anchor.left,
        top: surface?.top ?? anchor.top,
        width: surface?.width ?? anchor.width,
        height: surface?.height ?? anchor.height,
        transform: cardTarget
          ? undefined
          : (surface?.transform ??
            ("surfaceTransform" in anchor ? anchor.surfaceTransform : undefined)),
        transformOrigin: "0 0",
      }}
    >
      {({ isOver }) => (
        <>
          <svg
            className={styles.corners}
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d={[
                `M ${arm} 0 L ${bevel} 0 L 0 ${bevel} L 0 ${arm}`,
                `M ${width - arm} 0 L ${width - bevel} 0 L ${width} ${bevel} L ${width} ${arm}`,
                `M ${width} ${height - arm} L ${width} ${height - bevel} L ${width - bevel} ${height} L ${width - arm} ${height}`,
                `M ${arm} ${height} L ${bevel} ${height} L 0 ${height - bevel} L 0 ${height - arm}`,
              ].join(" ")}
            />
          </svg>
          <span className={styles.beacon} aria-hidden="true">
            {isOver ? <Check size={27} /> : <Icon size={27} />}
          </span>
          <div className={styles.instruction} role="status" aria-live="polite">
            <strong>{isOver ? `Release to ${action}` : `Drop to ${action}`}</strong>
            <span>{description}</span>
          </div>
        </>
      )}
    </PointerDroppable>
  );
}
