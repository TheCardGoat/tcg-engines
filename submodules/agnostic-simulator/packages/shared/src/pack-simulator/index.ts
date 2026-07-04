/**
 * Cross-game pack simulator contract.
 *
 * This module defines a minimal, game-agnostic shape for simulating
 * trading-card booster packs. Game-specific rules (rarities, color
 * distribution, slot layouts) are implemented in per-game adapters that
 * satisfy the `PackSimulator` interface.
 */

/** Information about a set that can be selected for pack generation. */
export interface PackSetInfo {
  id: string;
  name: string;
  code?: string;
  sortNumber?: number;
}

/** A single slot inside a generated pack. */
export interface PackSlot<TCardRef> {
  /** The category of this slot, e.g. "common", "rare", "foil". */
  slotType: string;
  /** Game-specific reference to the chosen card. */
  cardRef: TCardRef;
  /** Whether this slot is treated as a foil/foil-stamped variant. */
  foil?: boolean;
  /**
   * Optional list of variant treatments applied to this slot.
   * Examples: "hyperspace", "showcase", "borderless", "etched".
   */
  variants?: string[];
}

/** The result of opening a single pack. */
export interface PackResult<TCardRef> {
  /** The set the pack was generated from. */
  setId: string;
  /** The slots that make up the pack, in display order. */
  slots: PackSlot<TCardRef>[];
  /** Optional seed used to generate the pack. */
  seed?: string;
}

/** Describes the layout of a pack: how many of each slot type. */
export interface PackDefinition {
  name: string;
  slots: { slotType: string; count: number }[];
}

/** Cross-game interface implemented by every pack simulator adapter. */
export interface PackSimulator<TCard, TCardRef = string> {
  /** Pack layout used by this simulator. */
  readonly packDefinition: PackDefinition;

  /** Return the sets this simulator can generate packs for. */
  getAvailableSets(): PackSetInfo[];

  /** Generate a single pack from the given set, optionally seeded. */
  generatePack(setId: string, seed?: string): PackResult<TCardRef>;

  /** Resolve a card reference back to the full card definition. */
  resolveCard(cardRef: TCardRef): TCard | undefined;
}

/** Count slots by their `slotType`. */
export function countSlotsByType<TCardRef>(result: PackResult<TCardRef>): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const slot of result.slots) {
    counts[slot.slotType] = (counts[slot.slotType] ?? 0) + 1;
  }
  return counts;
}

/** Build a `PackResult` from a set id and a list of slots. */
export function createPackResult<TCardRef>(
  setId: string,
  slots: PackSlot<TCardRef>[],
  seed?: string,
): PackResult<TCardRef> {
  return { setId, slots, seed };
}
