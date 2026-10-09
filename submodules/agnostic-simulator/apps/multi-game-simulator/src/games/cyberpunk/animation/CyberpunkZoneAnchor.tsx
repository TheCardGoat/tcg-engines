import { useAnimationNode } from "@tcg/simulator-ui";
import type { CSSProperties } from "react";

/** Register an off-screen or transparent DOM node for a Cyberpunk card zone. */
export function CyberpunkZoneAnchor({
  zoneId,
  ownerId,
  style,
}: {
  readonly zoneId: string;
  readonly ownerId: string;
  readonly style: CSSProperties;
}) {
  const ref = useAnimationNode(
    { kind: "zone", id: zoneId, ownerId },
    { zoneId, presence: "present" },
  );
  return <span ref={ref} aria-hidden data-sim-zone-id={zoneId} style={style} />;
}
