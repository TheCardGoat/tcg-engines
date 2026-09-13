import type { SimulatorEntity, SimulatorZone } from "@tcg/simulator-contract";

import { cx } from "../class-names";
import { AnimatedEntityCollection, AnimatedEntitySlot, SimulatorEntityVisual } from "../animation";
import { EmptyZone } from "./EmptyZone";
import { CardInspector } from "./CardInspector";
import { CardInteractionFrame } from "./CardInteractionFrame";
import {
  cardInteractionStateFromFlags,
  type CardInteractionStateResolver,
} from "../interactions/card-interaction";

export interface CardGridProps {
  entities: SimulatorEntity[];
  emptyLabel?: string;
  countLabel?: string;
  density?: "compact" | "normal" | "large";
  compact?: boolean;
  ariaLabel?: string;
  selectedId?: string;
  interactionStateFor?: CardInteractionStateResolver;
  onSelect?: (entity: SimulatorEntity) => void;
  disabledEntityIds?: ReadonlySet<string>;
  /** Show the shared card inspector when a card is clicked. */
  inspectable?: boolean;
  /** Number of equal-width columns to render instead of the responsive default. */
  columns?: number;
  /** Report the card currently hovered or keyboard-focused without changing selection. */
  onPreviewChange?: (entity: SimulatorEntity) => void;
  /** Clear an external preview when its card loses hover or keyboard focus. */
  onPreviewEnd?: () => void;
  /** Keep card names visible when recognition is part of the choice. */
  showTitles?: boolean;
  /** Number of interchangeable copies represented by each displayed tile. */
  copyCounts?: ReadonlyMap<string, number>;
  /** Let a containing surface own scrolling when it needs a fixed vertical viewport. */
  scrollable?: boolean;
  /**
   * Inventory views can duplicate an entity already mounted on the board.
   * Keep those copies outside the animation registry so board transitions
   * cannot suppress the viewer's card.
   */
  animated?: boolean;
  zone?: SimulatorZone;
}

const CARD_GRID_MIN_HEIGHT_CLASS: Record<NonNullable<CardGridProps["density"]>, string> = {
  compact: "min-h-[134px]",
  normal: "min-h-[157px]",
  large: "min-h-[190px]",
};

export function CardGrid({
  entities,
  emptyLabel = "Empty zone",
  countLabel,
  density = "normal",
  compact = false,
  ariaLabel,
  selectedId,
  interactionStateFor,
  onSelect,
  disabledEntityIds = new Set<string>(),
  inspectable = false,
  columns,
  onPreviewChange,
  onPreviewEnd,
  showTitles = false,
  copyCounts,
  scrollable = true,
  animated = true,
  zone,
}: CardGridProps) {
  const cardDensity = compact ? "mini" : density;
  const gridClass = cx(
    "card-grid grid items-stretch gap-2",
    scrollable ? "overflow-auto" : "overflow-visible",
    compact ? "min-h-0" : CARD_GRID_MIN_HEIGHT_CLASS[density],
    density === "large"
      ? "grid-cols-[repeat(auto-fit,minmax(148px,1fr))]"
      : compact
        ? "grid-cols-[repeat(auto-fit,minmax(82px,max-content))]"
        : "grid-cols-[repeat(auto-fit,minmax(118px,1fr))]",
  );

  return (
    <div
      className={gridClass}
      data-card-density={density}
      role={ariaLabel ? "list" : undefined}
      aria-label={ariaLabel}
      style={columns ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` } : undefined}
    >
      <AnimatedEntityCollection>
        {entities.length > 0 ? (
          entities.map((entity, index) => {
            const interactionState =
              interactionStateFor?.(entity) ??
              cardInteractionStateFromFlags({ selected: entity.id === selectedId });
            const visual = (
              <CardInteractionFrame state={interactionState}>
                <SimulatorEntityVisual entity={entity} density={cardDensity} />
              </CardInteractionFrame>
            );
            const card = inspectable ? (
              <CardInspector entity={entity}>{visual}</CardInspector>
            ) : (
              <button
                type="button"
                aria-pressed={interactionState.kind === "selected"}
                disabled={disabledEntityIds.has(entity.id)}
                onClick={() => onSelect?.(entity)}
                className="group block w-full text-left disabled:cursor-not-allowed disabled:opacity-50"
              >
                {visual}
                {showTitles && entity.face !== "hidden" ? (
                  <span className="mt-2 line-clamp-2 min-h-8 text-center text-xs font-bold leading-tight text-[var(--board-text,#f8fbff)] group-hover:text-[var(--game-accent,#f5e642)]">
                    {entity.title}
                  </span>
                ) : null}
              </button>
            );
            const copyCount = copyCounts?.get(entity.id) ?? 1;
            const copyLabel =
              copyCount > 1 ? (
                <div className="card-grid-copy-count mt-1 text-center text-xs font-bold text-[var(--board-text,#f8fbff)]">
                  {copyCount} copies
                </div>
              ) : null;
            const sharedProps = {
              "aria-label": ariaLabel
                ? entity.face === "hidden"
                  ? "Hidden card"
                  : copyCount > 1
                    ? `${entity.title}, ${copyCount} copies`
                    : entity.title
                : undefined,
              "aria-posinset": ariaLabel ? index + 1 : undefined,
              "aria-setsize": ariaLabel ? entities.length : undefined,
              "data-card-id": entity.id,
              "data-card-states": entity.states.join(" "),
              className: "min-w-0 w-full justify-self-start",
              "data-card-layout-id": entity.id,
              "data-entity-id": entity.id,
              "data-sim-entity-id": entity.id,
              onMouseEnter: onPreviewChange ? () => onPreviewChange(entity) : undefined,
              onMouseLeave: onPreviewEnd,
              onFocus: onPreviewChange ? () => onPreviewChange(entity) : undefined,
              onBlur: onPreviewEnd,
              role: ariaLabel ? "listitem" : undefined,
            };

            return animated ? (
              <AnimatedEntitySlot
                key={entity.id}
                entity={entity}
                zoneRef={zone ? { kind: "zone", id: zone.id, ownerId: zone.ownerId } : undefined}
                density={cardDensity}
                {...sharedProps}
              >
                {card}
                {copyLabel}
              </AnimatedEntitySlot>
            ) : (
              <div key={entity.id} {...sharedProps}>
                {card}
                {copyLabel}
              </div>
            );
          })
        ) : (
          <EmptyZone label={emptyLabel} count={countLabel} />
        )}
      </AnimatedEntityCollection>
    </div>
  );
}
