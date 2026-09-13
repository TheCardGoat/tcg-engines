import type { SimulatorEntity, SimulatorZone } from "@tcg/simulator-contract";

import { AnimatedZoneSlot } from "../animation";
import { CardFan } from "./CardFan";
import type { CardInteractionStateResolver } from "../interactions/card-interaction";

export interface HandZoneProps {
  entities: SimulatorEntity[];
  /** Entity ids that are currently legal spatial choices. */
  highlightedIds?: ReadonlySet<string>;
  /** Controls the amount of rotation while retaining the shared hand layout. */
  fanStyle?: "arc" | "shallow";
  density?: "compact" | "normal";
  selectedId?: string;
  selectionOrder?: ReadonlyMap<string, number>;
  interactionStateFor?: CardInteractionStateResolver;
  orientation?: "portrait" | "landscape";
  onSelect?: (entity: SimulatorEntity) => void;
  onPlay?: (entity: SimulatorEntity) => void;
  zone?: SimulatorZone;
}

export function HandZone({
  entities,
  highlightedIds,
  fanStyle,
  density = "compact",
  selectedId,
  selectionOrder,
  interactionStateFor,
  orientation = "portrait",
  onSelect,
  onPlay,
  zone,
}: HandZoneProps) {
  const contents = (
    <CardFan
      entities={entities}
      highlightedIds={highlightedIds}
      fanStyle={fanStyle}
      density={density}
      selectedId={selectedId}
      selectionOrder={selectionOrder}
      interactionStateFor={interactionStateFor}
      orientation={orientation}
      ariaLabel="Hand zone"
      onSelect={onSelect}
      onPlay={onPlay}
      zone={zone}
    />
  );
  return zone ? (
    <AnimatedZoneSlot animationRef={{ kind: "zone", id: zone.id, ownerId: zone.ownerId }}>
      {contents}
    </AnimatedZoneSlot>
  ) : (
    contents
  );
}
