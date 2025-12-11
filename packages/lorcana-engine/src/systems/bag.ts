/**
 * Bag System (Rule 1.7, 8.7)
 *
 * The Bag holds triggered abilities waiting to be resolved.
 * - Triggered abilities go into the bag
 * - Action effects don't use the bag
 * - Active player chooses resolution order
 * - Each ability resolves completely before the next
 */

import type {
  GameEvent,
  TriggeredAbilityInstance,
} from "../abilities/ability-types";
import type { LorcanaCardDefinition } from "../types/card-types";
import type { CardId, PlayerId } from "../types/game-state";
import type { BagEntry, BagResolutionChoice, BagState } from "./system-types";
import { createEmptyBagState } from "./system-types";

/**
 * Create a new bag entry
 */
export function createBagEntry(
  ability: TriggeredAbilityInstance,
  sourceCardId: CardId,
  controllerId: PlayerId,
  triggerEvent: GameEvent,
  sourceCardSnapshot?: LorcanaCardDefinition,
): BagEntry {
  return {
    id: `bag-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    ability,
    sourceCardId,
    controllerId,
    triggerEvent,
    timestamp: Date.now(),
    sourceCardSnapshot,
  };
}

/**
 * Add an entry to the bag
 */
export function addToBag(bag: BagState, entry: BagEntry): BagState {
  return {
    ...bag,
    entries: [...bag.entries, entry],
  };
}

/**
 * Add a triggered ability to the bag
 */
export function addTriggeredAbilityToBag(
  bag: BagState,
  ability: TriggeredAbilityInstance,
  event: GameEvent,
  sourceCardSnapshot?: LorcanaCardDefinition,
): BagState {
  const entry = createBagEntry(
    ability,
    ability.sourceCardId,
    ability.controllerId,
    event,
    sourceCardSnapshot,
  );
  return addToBag(bag, entry);
}

/**
 * Remove an entry from the bag by ID
 */
export function removeFromBag(bag: BagState, entryId: string): BagState {
  return {
    ...bag,
    entries: bag.entries.filter((e) => e.id !== entryId),
    resolutionOrder: [...bag.resolutionOrder, entryId],
  };
}

/**
 * Clear all entries from the bag
 */
export function clearBag(bag: BagState): BagState {
  return createEmptyBagState();
}

/**
 * Check if the bag is empty
 */
export function isBagEmpty(bag: BagState): boolean {
  return bag.entries.length === 0;
}

/**
 * Get the number of entries in the bag
 */
export function getBagSize(bag: BagState): number {
  return bag.entries.length;
}

/**
 * Get all entries for a specific player
 */
export function getBagEntriesForPlayer(
  bag: BagState,
  playerId: PlayerId,
): BagEntry[] {
  return bag.entries.filter((e) => e.controllerId === playerId);
}

/**
 * Get all entries (resolvable by active player)
 */
export function getResolvableEntries(bag: BagState): BagEntry[] {
  return [...bag.entries];
}

/**
 * Get entries sorted by timestamp (oldest first)
 */
export function getEntriesByTimestamp(bag: BagState): BagEntry[] {
  return [...bag.entries].sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Set the currently resolving entry
 */
export function setCurrentlyResolving(
  bag: BagState,
  entry: BagEntry | null,
): BagState {
  return {
    ...bag,
    currentlyResolving: entry,
  };
}

/**
 * Choose and start resolving a bag entry
 */
export function chooseToResolve(bag: BagState, entryId: string): BagState {
  const entry = bag.entries.find((e) => e.id === entryId);
  if (!entry) {
    return bag;
  }

  return {
    ...bag,
    entries: bag.entries.filter((e) => e.id !== entryId),
    currentlyResolving: entry,
  };
}

/**
 * Complete resolution of the current entry
 */
export function completeResolution(bag: BagState): BagState {
  if (!bag.currentlyResolving) {
    return bag;
  }

  return {
    ...bag,
    currentlyResolving: null,
    resolutionOrder: [...bag.resolutionOrder, bag.currentlyResolving.id],
  };
}

/**
 * Check if the bag must be resolved (has entries)
 */
export function mustResolveBag(bag: BagState): boolean {
  return bag.entries.length > 0;
}

/**
 * Get the next entries that can be resolved
 * Active player can choose any entry
 */
export function getNextResolvableEntries(bag: BagState): BagEntry[] {
  if (bag.currentlyResolving) {
    // Can't choose another while one is resolving
    return [];
  }
  return [...bag.entries];
}

/**
 * Check if a specific entry exists in the bag
 */
export function hasEntry(bag: BagState, entryId: string): boolean {
  return bag.entries.some((e) => e.id === entryId);
}

/**
 * Get a specific entry by ID
 */
export function getEntry(bag: BagState, entryId: string): BagEntry | undefined {
  return bag.entries.find((e) => e.id === entryId);
}
