import type { SimulatorEntity, SimulatorZone } from "@tcg/simulator-contract";

import { cx } from "../class-names";
import { AnimatedEntityCollection, AnimatedEntitySlot, SimulatorEntityVisual } from "../animation";
import { EmptyZone } from "./EmptyZone";
import { CardInteractionFrame } from "./CardInteractionFrame";
import {
  cardInteractionStateFromFlags,
  type CardInteractionStateResolver,
} from "../interactions/card-interaction";

export interface CardRowProps {
  entities: SimulatorEntity[];
  emptyLabel?: string;
  density?: "mini" | "compact" | "normal" | "large";
  wrap?: boolean;
  ariaLabel?: string;
  selectedId?: string;
  interactionStateFor?: CardInteractionStateResolver;
  onSelect?: (entity: SimulatorEntity) => void;
  zone?: SimulatorZone;
}

export function CardRow({
  entities,
  emptyLabel = "No cards",
  density = "compact",
  wrap = true,
  ariaLabel,
  selectedId,
  interactionStateFor,
  onSelect,
  zone,
}: CardRowProps) {
  const rowClass = cx(
    "card-row mt-2 flex min-w-0 items-stretch gap-2 [overscroll-behavior-inline:contain]",
    wrap ? "flex-wrap overflow-x-visible" : "overflow-x-auto",
  );

  return (
    <div
      className={rowClass}
      data-card-density={density}
      data-card-wrap={wrap}
      data-zone-layout="row"
      role={ariaLabel ? "list" : undefined}
      aria-label={ariaLabel}
    >
      <AnimatedEntityCollection>
        {entities.length > 0 ? (
          entities.map((entity) => {
            const interactionState =
              interactionStateFor?.(entity) ??
              cardInteractionStateFromFlags({ selected: entity.id === selectedId });
            return (
              <AnimatedEntitySlot
                key={entity.id}
                entity={entity}
                zoneRef={zone ? { kind: "zone", id: zone.id, ownerId: zone.ownerId } : undefined}
                density={density}
                className="min-w-0 flex-shrink-0"
                data-card-layout-id={entity.id}
                data-card-id={entity.id}
                data-card-states={entity.states.join(" ")}
                data-entity-id={entity.id}
                data-sim-entity-id={entity.id}
                role={ariaLabel ? "listitem" : undefined}
                aria-label={ariaLabel ? entity.title : undefined}
              >
                <button
                  type="button"
                  aria-pressed={interactionState.kind === "selected"}
                  onClick={() => onSelect?.(entity)}
                  className="block"
                >
                  <CardInteractionFrame state={interactionState}>
                    <SimulatorEntityVisual entity={entity} density={density} />
                  </CardInteractionFrame>
                </button>
              </AnimatedEntitySlot>
            );
          })
        ) : (
          <EmptyZone label={emptyLabel} />
        )}
      </AnimatedEntityCollection>
    </div>
  );
}
