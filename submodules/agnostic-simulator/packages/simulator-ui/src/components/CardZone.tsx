import type { SimulatorEntity, SimulatorZone } from "@tcg/simulator-contract";

import { CardGrid } from "./CardGrid";
import { CompactHandZone } from "./CompactHandZone";
import { HandZone } from "./HandZone";

export interface CardZoneProps {
  zone: SimulatorZone | undefined;
  entities: SimulatorEntity[];
  entityCount: number;
  emptyLabel?: string;
  compact?: boolean;
  ariaLabel?: string;
}

export function CardZone({
  zone,
  entities,
  entityCount,
  emptyLabel = "Card zone",
  compact = false,
  ariaLabel,
}: CardZoneProps) {
  if (compact && zone?.layoutHint === "fan" && entities.length > 0) {
    return <CompactHandZone entities={entities} />;
  }

  if (compact) {
    return (
      <CardGrid
        entities={entities}
        emptyLabel={emptyLabel}
        countLabel={entityCount.toString()}
        density="compact"
        compact
        ariaLabel={ariaLabel}
      />
    );
  }

  return zone?.layoutHint === "fan" ? (
    <HandZone entities={entities} density="compact" />
  ) : (
    <CardGrid
      entities={entities}
      emptyLabel={emptyLabel}
      countLabel={entityCount.toString()}
      ariaLabel={ariaLabel}
    />
  );
}
