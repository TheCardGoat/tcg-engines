import type { SimulatorEntity, SimulatorZone } from "@tcg/simulator-contract";

import { cx } from "../class-names";
import { useActiveLayout } from "../hooks/useActiveLayout";
import { AnimatedEntityCollection, AnimatedEntitySlot, SimulatorEntityVisual } from "../animation";
import {
  cardInteractionStateFromFlags,
  type CardInteractionStateResolver,
} from "../interactions/card-interaction";
import { CardInteractionFrame } from "./CardInteractionFrame";

export interface CardFanProps {
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
  ariaLabel?: string;
  onSelect?: (entity: SimulatorEntity) => void;
  onPlay?: (entity: SimulatorEntity) => void;
  zone?: SimulatorZone;
}

export interface CardFanItemState {
  index: number;
  total: number;
  selected: boolean;
  density: "compact" | "normal";
  mobile: boolean;
  active: boolean;
}

const CARD_WIDTH: Record<CardFanProps["density"] & string, number> = {
  compact: 138,
  normal: 156,
};

const CARD_HEIGHT: Record<CardFanProps["density"] & string, number> = {
  compact: 118,
  normal: 138,
};

export function CardFan({
  entities,
  highlightedIds,
  fanStyle = "arc",
  density = "compact",
  selectedId,
  selectionOrder,
  interactionStateFor,
  orientation = "portrait",
  ariaLabel = "Card fan",
  onSelect,
  onPlay,
  zone,
}: CardFanProps) {
  const cardW = CARD_WIDTH[density];
  const cardH = CARD_HEIGHT[density];
  const isLandscape = orientation === "landscape";
  const fanContainerHeight = isLandscape ? cardW * 0.9 : cardH * 1.35;
  const activeLayout = useActiveLayout();

  if (activeLayout === "mobile") {
    return (
      <div
        className="card-fan-mobile flex min-w-0 overflow-x-auto pb-2 pt-1"
        data-active-fan="true"
        style={{
          minHeight: cardH,
          scrollSnapType: "x mandatory",
          overscrollBehaviorInline: "contain",
        }}
        role="list"
        aria-label={ariaLabel}
      >
        <AnimatedEntityCollection>
          {entities.map((entity, i) => {
            const isSelected = entity.id === selectedId;
            const interactionState =
              interactionStateFor?.(entity) ??
              cardInteractionStateFromFlags({
                selected: isSelected,
                actionable: highlightedIds?.has(entity.id),
              });
            return (
              <AnimatedEntitySlot
                key={entity.id}
                entity={entity}
                zoneRef={zone ? { kind: "zone", id: zone.id, ownerId: zone.ownerId } : undefined}
                density="compact"
                className={cx(
                  "card-fan-mobile-item flex-shrink-0 scroll-mx-2 snap-center transition-transform duration-200",
                  i !== 0 && "-ml-3",
                  isSelected && "-translate-y-2",
                )}
                style={{ width: cardW * 0.9 }}
                data-highlighted={highlightedIds?.has(entity.id) ? "true" : undefined}
                role="listitem"
              >
                <button
                  className="relative"
                  type="button"
                  data-entity-id={entity.id}
                  data-sim-entity-id={entity.id}
                  aria-pressed={interactionState.kind === "selected"}
                  aria-label={
                    selectionOrder?.has(entity.id)
                      ? `${entity.title}, position ${selectionOrder.get(entity.id)} of ${selectionOrder.size}`
                      : entity.face === "hidden"
                        ? entity.title
                        : undefined
                  }
                  tabIndex={entity.face === "hidden" ? -1 : undefined}
                  draggable
                  onClick={() => onSelect?.(entity)}
                  onDoubleClick={() => onPlay?.(entity)}
                >
                  <CardInteractionFrame state={interactionState}>
                    <SimulatorEntityVisual entity={entity} density="compact" />
                  </CardInteractionFrame>
                  {selectionOrder?.has(entity.id) ? (
                    <span
                      className="absolute right-1 top-1 z-20 grid size-6 place-items-center rounded-full bg-[var(--prompt-accent)] text-xs font-bold text-black"
                      aria-hidden="true"
                    >
                      {selectionOrder.get(entity.id)}
                    </span>
                  ) : null}
                </button>
              </AnimatedEntitySlot>
            );
          })}
        </AnimatedEntityCollection>
      </div>
    );
  }

  return (
    <div
      className={cx(
        "card-fan-desktop relative flex min-w-0 items-end justify-center",
        isLandscape && "items-center",
      )}
      data-active-fan="true"
      data-fan-style={fanStyle}
      style={{ height: fanContainerHeight }}
      role="list"
      aria-label={ariaLabel}
    >
      <AnimatedEntityCollection>
        {entities.map((entity, i) => {
          const angle = computeFanAngle(i, entities.length, fanStyle);
          const offsetX = computeOffsetX(i, entities.length, cardW);
          const zIndex = computeZIndex(i, entities.length, selectedId, entities);
          const isSelected = entity.id === selectedId;
          const interactionState =
            interactionStateFor?.(entity) ??
            cardInteractionStateFromFlags({
              selected: isSelected,
              actionable: highlightedIds?.has(entity.id),
            });
          return (
            <AnimatedEntitySlot
              key={entity.id}
              entity={entity}
              zoneRef={zone ? { kind: "zone", id: zone.id, ownerId: zone.ownerId } : undefined}
              density={density}
              className={cx(
                "card-fan-item absolute transition-transform duration-200 ease-out will-change-transform",
                isSelected && "-translate-y-3",
              )}
              style={{
                transform: `rotate(${angle}deg) translateX(${offsetX}px)${isSelected ? " translateY(-12px)" : ""}`,
                transformOrigin: "center 130%",
                zIndex,
                width: cardW,
              }}
              data-highlighted={highlightedIds?.has(entity.id) ? "true" : undefined}
              role="listitem"
            >
              <button
                className="relative"
                type="button"
                data-entity-id={entity.id}
                data-sim-entity-id={entity.id}
                aria-pressed={interactionState.kind === "selected"}
                aria-label={
                  selectionOrder?.has(entity.id)
                    ? `${entity.title}, position ${selectionOrder.get(entity.id)} of ${selectionOrder.size}`
                    : entity.face === "hidden"
                      ? entity.title
                      : undefined
                }
                tabIndex={entity.face === "hidden" ? -1 : undefined}
                draggable
                onClick={() => onSelect?.(entity)}
                onDoubleClick={() => onPlay?.(entity)}
              >
                <CardInteractionFrame state={interactionState}>
                  <SimulatorEntityVisual entity={entity} density={density} />
                </CardInteractionFrame>
                {selectionOrder?.has(entity.id) ? (
                  <span
                    className="absolute right-1 top-1 z-20 grid size-6 place-items-center rounded-full bg-[var(--prompt-accent)] text-xs font-bold text-black"
                    aria-hidden="true"
                  >
                    {selectionOrder.get(entity.id)}
                  </span>
                ) : null}
              </button>
            </AnimatedEntitySlot>
          );
        })}
      </AnimatedEntityCollection>
    </div>
  );
}

function computeFanAngle(index: number, total: number, fanStyle: "arc" | "shallow"): number {
  if (total <= 1) return 0;
  const maxAngle = fanStyle === "shallow" ? Math.min(12, total * 2.25) : Math.min(60, total * 5.5);
  const step = maxAngle / Math.max(1, total - 1);
  return (index - (total - 1) / 2) * step;
}

function computeOverlapFactor(total: number): number {
  if (total <= 3) return 0.78;
  if (total <= 6) return 0.65;
  if (total <= 10) return 0.5;
  if (total <= 15) return 0.38;
  return 0.28;
}

function computeOffsetX(index: number, total: number, cardW: number): number {
  if (total <= 1) return 0;
  const overlap = computeOverlapFactor(total);
  const step = cardW * overlap;
  return (index - (total - 1) / 2) * step;
}

function computeZIndex(
  index: number,
  total: number,
  selectedId: string | undefined,
  entities: SimulatorEntity[],
): number {
  const base = total <= 1 ? 0 : Math.round(100 - Math.abs(index - (total - 1) / 2) * 10);
  if (selectedId && entities[index]?.id === selectedId) return base + 200;
  return base;
}
