import type { SimulatorEntity, SimulatorZone } from "@tcg/simulator-contract";
import type { MouseEvent, ReactNode } from "react";

import { cx } from "../class-names";
import {
  AnimatedEntityCollection,
  AnimatedEntitySlot,
  AnimatedZoneSlot,
  SimulatorEntityVisual,
} from "../animation";
import { EmptyZone } from "./EmptyZone";
import { CardInteractionFrame } from "./CardInteractionFrame";
import type { CardInteractionStateResolver } from "../interactions/card-interaction";

export interface DiscardPileZoneProps {
  zone: SimulatorZone | undefined;
  entities: SimulatorEntity[];
  entityCount: number;
  label?: string;
  emptyLabel?: string;
  showEmptyState?: boolean;
  density?: "mini" | "compact";
  selectedId?: string;
  interactionStateFor?: CardInteractionStateResolver;
  className?: string;
  onSelect?: (entity: SimulatorEntity) => void;
  onHoverEnter?: (entity: SimulatorEntity) => void;
  onHoverLeave?: (entity: SimulatorEntity) => void;
  onContextMenu?: (entity: SimulatorEntity, event: MouseEvent) => void;
  renderTopEntity?: (entity: SimulatorEntity) => ReactNode;
}

export function DiscardPileZone({
  zone,
  entities,
  entityCount,
  label,
  emptyLabel,
  showEmptyState = true,
  density = "mini",
  selectedId,
  interactionStateFor,
  className,
  onSelect,
  onHoverEnter,
  onHoverLeave,
  onContextMenu,
  renderTopEntity,
}: DiscardPileZoneProps) {
  const topEntity = entities[0];
  const resolvedLabel = label ?? zone?.label ?? "Discard";
  const resolvedEmptyLabel = emptyLabel ?? resolvedLabel;

  const contents = (
    <div
      className={cx(
        "discard-pile-zone relative grid min-h-[118px] w-[78px] content-start justify-items-center overflow-hidden rounded-lg border border-[var(--board-border)] bg-[var(--board-surface-soft)] px-[9px] pb-[18px] pt-1 text-[var(--board-text)]",
        className,
      )}
      data-testid={`${zone?.id ?? resolvedLabel}-stack`}
      data-zone-id={zone?.id}
      data-sim-zone-id={zone?.id}
      data-zone-layout="discard-pile"
      data-count={entityCount}
      aria-label={`${resolvedLabel}, ${entityCount} ${entityCount === 1 ? "card" : "cards"}`}
    >
      <AnimatedEntityCollection>
        {topEntity ? (
          <>
            {entityCount > 1 && (
              <span
                className="discard-pile-zone-layers pointer-events-none absolute inset-[9px_7px_22px_12px] rounded-md border border-white/25 bg-slate-950/20"
                aria-hidden="true"
              />
            )}
            <AnimatedEntitySlot
              entity={topEntity}
              density={density}
              zoneRef={zone ? { kind: "zone", id: zone.id, ownerId: zone.ownerId } : undefined}
              className="discard-pile-zone-entity"
            >
              {renderTopEntity ? (
                renderTopEntity(topEntity)
              ) : (
                <button
                  type="button"
                  aria-pressed={topEntity.id === selectedId}
                  onClick={() => onSelect?.(topEntity)}
                  onMouseEnter={() => onHoverEnter?.(topEntity)}
                  onMouseLeave={() => onHoverLeave?.(topEntity)}
                  onContextMenu={(event) => onContextMenu?.(topEntity, event)}
                  className={cx("block", topEntity.id === selectedId && "is-selected")}
                >
                  <CardInteractionFrame state={interactionStateFor?.(topEntity)}>
                    <SimulatorEntityVisual entity={topEntity} density={density} />
                  </CardInteractionFrame>
                </button>
              )}
            </AnimatedEntitySlot>
          </>
        ) : showEmptyState ? (
          <EmptyZone label={resolvedEmptyLabel} count="0" />
        ) : null}
      </AnimatedEntityCollection>
      <StackCount value={entityCount} />
      <StackLabel label={resolvedLabel} />
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

function StackCount({ value }: { value: number }) {
  return (
    <span className="tabletop-pile-count absolute bottom-[27px] right-1 grid h-[22px] min-w-[26px] place-items-center rounded-[7px] border border-white/30 bg-black/70 px-1 text-[13px] font-black leading-none text-white">
      {value}
    </span>
  );
}

function StackLabel({ label }: { label: string }) {
  return (
    <span className="tabletop-pile-label absolute bottom-[3px] left-1/2 max-w-[calc(100%-10px)] -translate-x-1/2 overflow-hidden text-ellipsis whitespace-nowrap text-[10px] font-extrabold uppercase text-[var(--board-muted)]">
      {label}
    </span>
  );
}
