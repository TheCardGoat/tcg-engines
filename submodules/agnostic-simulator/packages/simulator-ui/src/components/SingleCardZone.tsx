import type { SimulatorEntity, SimulatorZone } from "@tcg/simulator-contract";
import type { CSSProperties } from "react";

import { cx } from "../class-names";
import {
  AnimatedEntityCollection,
  AnimatedEntitySlot,
  AnimatedZoneSlot,
  SimulatorEntityVisual,
} from "../animation";
import { EmptyZone } from "./EmptyZone";
import { CardInteractionFrame } from "./CardInteractionFrame";
import {
  cardInteractionStateFromFlags,
  type CardInteractionStateResolver,
} from "../interactions/card-interaction";

export interface SingleCardZoneProps {
  zone: SimulatorZone | undefined;
  entities: SimulatorEntity[];
  entityCount: number;
  label?: string;
  emptyLabel?: string;
  density?: "mini" | "compact" | "normal";
  selectedId?: string;
  interactionStateFor?: CardInteractionStateResolver;
  showCount?: boolean;
  className?: string;
  style?: CSSProperties;
  onSelect?: (entity: SimulatorEntity) => void;
}

export function SingleCardZone({
  zone,
  entities,
  entityCount,
  label,
  emptyLabel,
  density = "mini",
  selectedId,
  interactionStateFor,
  showCount = false,
  className,
  style,
  onSelect,
}: SingleCardZoneProps) {
  const entity = entities[0];
  const resolvedLabel = label ?? zone?.label ?? "Card slot";
  const resolvedEmptyLabel = emptyLabel ?? resolvedLabel;
  const interactionState = entity
    ? (interactionStateFor?.(entity) ??
      cardInteractionStateFromFlags({ selected: entity.id === selectedId }))
    : null;

  const contents = (
    <div
      className={cx(
        "single-card-zone relative grid min-h-[106px] w-[76px] place-items-center overflow-hidden rounded-lg border border-[var(--board-border)] bg-[var(--board-surface-soft)] p-2 text-[var(--board-text)]",
        className,
      )}
      style={style}
      data-testid={`${zone?.id ?? resolvedLabel}-single-card-zone`}
      data-zone-id={zone?.id}
      data-sim-zone-id={zone?.id}
      data-zone-layout="single-card"
      data-card-id={entity?.id}
      data-sim-entity-id={entity?.id}
      data-card-states={entity?.states.join(" ")}
      data-count={entityCount}
      aria-label={`${resolvedLabel}, ${entityCount} ${entityCount === 1 ? "card" : "cards"}`}
    >
      <AnimatedEntityCollection>
        {entity ? (
          <AnimatedEntitySlot
            entity={entity}
            density={density}
            zoneRef={zone ? { kind: "zone", id: zone.id, ownerId: zone.ownerId } : undefined}
          >
            <button
              type="button"
              aria-pressed={interactionState?.kind === "selected"}
              onClick={() => onSelect?.(entity)}
              className={cx("block", entity.id === selectedId && "is-selected")}
            >
              <CardInteractionFrame state={interactionState ?? undefined}>
                <SimulatorEntityVisual entity={entity} density={density} />
              </CardInteractionFrame>
            </button>
          </AnimatedEntitySlot>
        ) : (
          <EmptyZone
            label={resolvedEmptyLabel}
            count={showCount ? entityCount.toString() : undefined}
          />
        )}
      </AnimatedEntityCollection>
      {showCount && entityCount > 1 && (
        <span className="absolute bottom-1 right-1 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--game-accent)] px-1 text-[11px] font-black leading-none text-white">
          {entityCount}
        </span>
      )}
    </div>
  );

  return zone ? (
    <AnimatedZoneSlot animationRef={{ kind: "zone", id: zone.id, ownerId: zone.ownerId }}>
      {contents}
    </AnimatedZoneSlot>
  ) : (
    contents
  );
}
