import type { SimulatorEntity, SimulatorZone } from "@tcg/simulator-contract";
import type { ReactNode, Ref } from "react";

import { cx } from "../class-names";
import {
  AnimatedEntityCollection,
  AnimatedEntitySlot,
  AnimatedZoneSlot,
  SimulatorEntityVisual,
} from "../animation";
import { EmptyZone } from "./EmptyZone";
import { TabletopCounterBadge } from "./TabletopCounterBadge";

export interface ResourceCardRenderState {
  index: number;
  selected: boolean;
  highlighted: boolean;
  rested: boolean;
}

export interface ResourceCardZoneProps {
  zone: SimulatorZone | undefined;
  entities: SimulatorEntity[];
  entityCount: number;
  availableCount: number;
  label?: string;
  emptyLabel?: string;
  showEmptyState?: boolean;
  density?: "mini" | "compact";
  zoneSlotClassName?: string;
  className?: string;
  rowClassName?: string;
  counterClassName?: string;
  counterAttributes?: Record<string, string | number | undefined>;
  entityClassName?:
    | string
    | ((entity: SimulatorEntity, state: ResourceCardRenderState) => string | undefined);
  entityAttributes?: (
    entity: SimulatorEntity,
    state: ResourceCardRenderState,
  ) => Record<string, string | number | undefined>;
  selectedIds?: ReadonlySet<string>;
  highlightedIds?: ReadonlySet<string>;
  anchorId?: string;
  resourceAnchorId?: string;
  elementRef?: Ref<HTMLDivElement>;
  onSelect?: (entity: SimulatorEntity) => void;
  renderEntity?: (entity: SimulatorEntity, state: ResourceCardRenderState) => ReactNode;
  testId?: string;
  dataAttributes?: Record<string, string | number | undefined>;
}

export function ResourceCardZone({
  zone,
  entities,
  entityCount,
  availableCount,
  label,
  emptyLabel,
  showEmptyState = true,
  density = "mini",
  zoneSlotClassName,
  className,
  rowClassName,
  counterClassName,
  counterAttributes,
  entityClassName,
  entityAttributes,
  selectedIds = EMPTY_IDS,
  highlightedIds = EMPTY_IDS,
  anchorId,
  resourceAnchorId,
  elementRef,
  onSelect,
  renderEntity,
  testId,
  dataAttributes,
}: ResourceCardZoneProps) {
  const resolvedLabel = label ?? zone?.label ?? "Resources";
  const resolvedEmptyLabel = emptyLabel ?? resolvedLabel;
  const counterValue = `${availableCount}/${entityCount}`;

  const contents = (
    <section
      ref={elementRef}
      role="region"
      aria-label={`${resolvedLabel}, ${counterValue} available`}
      className={cx(
        "resource-card-zone relative flex min-h-0 min-w-0 items-center justify-center overflow-hidden rounded-lg border border-[var(--board-border)] bg-[var(--board-surface-soft)] px-2 pb-2 pt-7 text-[var(--board-text)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
      data-zone-id={zone?.id}
      data-sim-zone-id={zone?.id}
      data-sim-anchor-id={anchorId}
      data-sim-resource-anchor-id={resourceAnchorId}
      data-zone-layout="resource-row"
      data-count={entityCount}
      data-available-count={availableCount}
      data-testid={testId}
      {...dataAttributes}
    >
      <TabletopCounterBadge
        label={resolvedLabel}
        value={counterValue}
        variant="pill"
        mono
        className={cx(
          "resource-card-zone-counter pointer-events-none absolute right-2 top-1.5 z-10 min-h-0 gap-[0.25em] rounded-sm px-2 py-1 text-xs font-bold",
          counterClassName,
        )}
        {...counterAttributes}
      />
      <div
        className={cx(
          "resource-card-zone-row flex min-w-0 items-center justify-center gap-1",
          rowClassName,
        )}
        role="list"
        aria-label={resolvedLabel}
      >
        <AnimatedEntityCollection>
          {entities.length > 0 ? (
            entities.map((entity, index) => {
              const state: ResourceCardRenderState = {
                index,
                selected: selectedIds.has(entity.id),
                highlighted: highlightedIds.has(entity.id),
                rested: entity.states.includes("rested"),
              };
              const resolvedEntityClassName =
                typeof entityClassName === "function"
                  ? entityClassName(entity, state)
                  : entityClassName;
              const resolvedEntityAttributes = entityAttributes?.(entity, state);
              return (
                <AnimatedEntitySlot
                  key={entity.id}
                  entity={entity}
                  zoneRef={zone ? { kind: "zone", id: zone.id, ownerId: zone.ownerId } : undefined}
                  density={density}
                  className={cx(
                    "resource-card-zone-card relative min-w-0 flex-shrink-0",
                    resolvedEntityClassName,
                  )}
                  data-card-id={entity.id}
                  data-card-states={entity.states.join(" ")}
                  data-entity-id={entity.id}
                  data-sim-entity-id={entity.id}
                  data-selected={state.selected ? "true" : undefined}
                  data-highlighted={state.highlighted ? "true" : undefined}
                  data-rested={state.rested ? "true" : "false"}
                  {...resolvedEntityAttributes}
                  role="listitem"
                  aria-label={entity.face === "hidden" ? "Hidden resource" : entity.title}
                >
                  {renderEntity ? (
                    renderEntity(entity, state)
                  ) : (
                    <button
                      type="button"
                      aria-pressed={state.selected}
                      onClick={() => onSelect?.(entity)}
                      className="block"
                    >
                      <SimulatorEntityVisual entity={entity} density={density} />
                    </button>
                  )}
                </AnimatedEntitySlot>
              );
            })
          ) : showEmptyState ? (
            <EmptyZone label={resolvedEmptyLabel} count="0" />
          ) : null}
        </AnimatedEntityCollection>
      </div>
    </section>
  );

  return zone ? (
    <AnimatedZoneSlot
      animationRef={{ kind: "zone", id: zone.id, ownerId: zone.ownerId }}
      className={zoneSlotClassName}
    >
      {contents}
    </AnimatedZoneSlot>
  ) : (
    contents
  );
}

const EMPTY_IDS: ReadonlySet<string> = new Set();
