import type { SimulatorEntity, SimulatorZone } from "@tcg/simulator-contract";

import { CardGrid } from "./CardGrid";
import { CardRow } from "./CardRow";
import { CardStack } from "./CardStack";
import { CompactHandZone } from "./CompactHandZone";
import { HandZone } from "./HandZone";

export interface CardZoneProps {
  zone: SimulatorZone | undefined;
  entities: SimulatorEntity[];
  entityCount: number;
  emptyLabel?: string;
  compact?: boolean;
  ariaLabel?: string;
  selectedId?: string;
  onSelect?: (entity: SimulatorEntity) => void;
}

export function CardZone({
  zone,
  entities,
  entityCount,
  emptyLabel,
  compact = false,
  ariaLabel,
  selectedId,
  onSelect,
}: CardZoneProps) {
  const resolvedEmptyLabel = emptyLabel ?? "Card zone";

  if (zone?.layoutHint === "stack") {
    return (
      <CardStack
        zone={zone}
        entities={entities}
        entityCount={entityCount}
        label={zone.label}
        emptyLabel={resolvedEmptyLabel}
        selectedId={selectedId}
        onSelect={onSelect}
      />
    );
  }

  if (zone?.layoutHint === "row") {
    return (
      <CardRow
        entities={entities}
        emptyLabel={resolvedEmptyLabel}
        density={compact ? "mini" : "normal"}
        wrap={false}
        ariaLabel={ariaLabel}
        selectedId={selectedId}
        onSelect={onSelect}
      />
    );
  }

  if (compact && zone?.layoutHint === "fan" && entities.length > 0) {
    return (
      <CompactHandZone
        entities={entities}
        selectedId={selectedId}
        ariaLabel={ariaLabel}
        onSelect={onSelect}
      />
    );
  }

  if (compact) {
    return (
      <CardGrid
        entities={entities}
        emptyLabel={resolvedEmptyLabel}
        countLabel={entityCount.toString()}
        density="compact"
        compact
        ariaLabel={ariaLabel}
        selectedId={selectedId}
        onSelect={onSelect}
      />
    );
  }

  return zone?.layoutHint === "fan" ? (
    <HandZone entities={entities} density="compact" selectedId={selectedId} onSelect={onSelect} />
  ) : (
    <CardGrid
      entities={entities}
      emptyLabel={resolvedEmptyLabel}
      countLabel={entityCount.toString()}
      ariaLabel={ariaLabel}
      selectedId={selectedId}
      onSelect={onSelect}
    />
  );
}
