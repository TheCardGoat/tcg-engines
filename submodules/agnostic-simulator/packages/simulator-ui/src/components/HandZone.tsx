import type { SimulatorEntity } from "@tcg/simulator-contract";

import { CardFan } from "./CardFan";

export interface HandZoneProps {
  entities: SimulatorEntity[];
  density?: "compact" | "normal";
  selectedId?: string;
  orientation?: "portrait" | "landscape";
  onSelect?: (entity: SimulatorEntity) => void;
  onPlay?: (entity: SimulatorEntity) => void;
}

export function HandZone({
  entities,
  density = "compact",
  selectedId,
  orientation = "portrait",
  onSelect,
  onPlay,
}: HandZoneProps) {
  return (
    <CardFan
      entities={entities}
      density={density}
      selectedId={selectedId}
      orientation={orientation}
      ariaLabel="Hand zone"
      onSelect={onSelect}
      onPlay={onPlay}
    />
  );
}
