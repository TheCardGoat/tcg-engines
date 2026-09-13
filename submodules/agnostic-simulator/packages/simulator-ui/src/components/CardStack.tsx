import type { SimulatorEntity, SimulatorZone } from "@tcg/simulator-contract";

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

export interface CardStackProps {
  zone: SimulatorZone | undefined;
  entities: SimulatorEntity[];
  entityCount: number;
  label?: string;
  emptyLabel?: string;
  selectedId?: string;
  interactionStateFor?: CardInteractionStateResolver;
  density?: "mini" | "compact";
  className?: string;
  onSelect?: (entity: SimulatorEntity) => void;
}

export function CardStack({
  zone,
  entities,
  entityCount,
  label,
  emptyLabel,
  selectedId,
  interactionStateFor,
  density = "mini",
  className,
  onSelect,
}: CardStackProps) {
  const topEntity = entities[0];
  const stackLabel = label ?? zone?.label ?? "Stack";
  const resolvedEmptyLabel = emptyLabel ?? stackLabel;
  const interactionState = topEntity
    ? (interactionStateFor?.(topEntity) ??
      cardInteractionStateFromFlags({ selected: topEntity.id === selectedId }))
    : null;

  const contents = (
    <div
      className={cx(
        "card-stack relative grid min-h-[106px] w-[70px] p-0 text-[var(--board-text)]",
        className,
      )}
      data-testid={`${zone?.id ?? stackLabel}-stack`}
      data-zone-id={zone?.id}
      data-sim-zone-id={zone?.id}
      data-zone-layout="stack"
      data-count={entityCount}
      aria-label={`${stackLabel}, ${entityCount} cards`}
    >
      <AnimatedEntityCollection>
        {entityCount > 0 && topEntity ? (
          <>
            <span
              className="card-stack-layers absolute inset-[5px_-5px_-5px_5px] rounded-[7px] border border-white/25 bg-slate-950/20"
              aria-hidden="true"
            />
            <AnimatedEntitySlot
              entity={topEntity}
              density={density}
              zoneRef={zone ? { kind: "zone", id: zone.id, ownerId: zone.ownerId } : undefined}
            >
              <button
                type="button"
                aria-pressed={interactionState?.kind === "selected"}
                onClick={() => onSelect?.(topEntity)}
                className={cx("block", topEntity.id === selectedId && "is-selected")}
              >
                <CardInteractionFrame state={interactionState ?? undefined}>
                  <SimulatorEntityVisual entity={topEntity} density={density} />
                </CardInteractionFrame>
              </button>
            </AnimatedEntitySlot>
          </>
        ) : (
          <EmptyZone label={resolvedEmptyLabel} count={entityCount.toString()} />
        )}
      </AnimatedEntityCollection>
      <span className="card-stack-count absolute bottom-[17px] right-[-8px] grid h-6 min-w-7 place-items-center rounded-[7px] border border-white/30 bg-black/70 px-1 text-[15px] font-black leading-none text-white">
        {entityCount}
      </span>
      <span className="card-stack-label absolute bottom-[-6px] left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-extrabold uppercase text-[var(--board-muted)]">
        {stackLabel}
      </span>
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
