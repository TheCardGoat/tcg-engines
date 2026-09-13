import type { ReactNode } from "react";

import { cx } from "../class-names";

export interface FixedSlotCardZoneProps<T> {
  /** Maximum number of cards this zone can hold. */
  readonly capacity: number;
  /** Cards currently occupying the zone, ordered by their game-native slot. */
  readonly items: readonly T[];
  /** Renders the game-native card visual inside an occupied slot. */
  readonly renderItem: (item: T, index: number) => ReactNode;
  /** Optional presentation for an unoccupied position. */
  readonly renderEmptySlot?: (index: number) => ReactNode;
  /** Keep capacity in semantics but omit vacant slots from the visual lane. */
  readonly showEmptySlots?: boolean;
  readonly ariaLabel: string;
  readonly className?: string;
  readonly slotClassName?: string;
  readonly emptySlotClassName?: string;
  /** A row preserves tactical ordering on small screens; grid is the desktop default. */
  readonly layout?: "grid" | "row";
}

/**
 * A game-agnostic, fixed-capacity card zone.
 *
 * The primitive deliberately owns only geometry and accessible slot state. Games
 * keep their native card renderers, pairing stacks, drag/drop affordances, and
 * zone rules by supplying `renderItem`.
 */
export function FixedSlotCardZone<T>({
  capacity,
  items,
  renderItem,
  renderEmptySlot,
  showEmptySlots = true,
  ariaLabel,
  className,
  slotClassName,
  emptySlotClassName,
  layout = "grid",
}: FixedSlotCardZoneProps<T>) {
  // Capacity remains semantic metadata. Do not hide an overflow projection:
  // game engines may transiently expose it while resolving excess management,
  // and every projected entity must remain targetable and operable.
  const visibleItems = items;
  const renderedSlotCount = showEmptySlots
    ? Math.max(capacity, visibleItems.length)
    : visibleItems.length;

  return (
    <div
      role="list"
      aria-label={ariaLabel}
      data-fixed-slot-card-zone
      data-slot-capacity={capacity}
      data-slot-count={visibleItems.length}
      className={cx("min-w-0", layout === "grid" ? "grid" : "flex", className)}
      style={
        layout === "grid" && renderedSlotCount > 0
          ? { gridTemplateColumns: `repeat(${renderedSlotCount}, minmax(0, 1fr))` }
          : undefined
      }
    >
      {Array.from({ length: renderedSlotCount }, (_, index) => {
        const item = visibleItems[index];
        const occupied = item !== undefined;
        return (
          <div
            key={index}
            role="listitem"
            aria-label={`${ariaLabel}, slot ${index + 1}${occupied ? ", occupied" : ", empty"}`}
            data-fixed-slot-index={index}
            data-fixed-slot-state={occupied ? "occupied" : "empty"}
            className={cx("min-h-0 min-w-0", slotClassName, !occupied && emptySlotClassName)}
          >
            {occupied ? renderItem(item, index) : renderEmptySlot?.(index)}
          </div>
        );
      })}
    </div>
  );
}
