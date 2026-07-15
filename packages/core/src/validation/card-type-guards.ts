/**
 * Card-specific type guard utilities
 *
 * Provides convenient type guards for filtering and narrowing card types
 * in a type-safe manner.
 */

import type { CardDefinition } from "../cards/card-definition";
import { createTypeGuard } from "./type-guard-builder";

/**
 * Creates a type guard for checking if a card is of a specific type
 *
 * This is a specialized version of createTypeGuard optimized for card definitions.
 * It provides better ergonomics for the common use case of filtering cards by type.
 *
 * @template T - The card type (extends CardDefinition)
 * @param cardType - The type value to check against
 * @returns A type guard function that checks if a card matches the type
 *
 * @example
 * ```typescript
 * // Basic usage
 * const isCreature = isCardOfType("creature");
 * const creature: CardDefinition = { id: "1", name: "Dragon", type: "creature" };
 * console.log(isCreature(creature)); // true
 *
 * // Filtering arrays
 * const cards: CardDefinition[] = [...];
 * const creatures = cards.filter(isCardOfType("creature"));
 *
 * // Type narrowing in conditionals
 * if (isCardOfType("creature")(card)) {
 *   // TypeScript knows card.type is "creature" here
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Game-specific types
 * type GundamCard = CardDefinition & {
 *   type: "unit" | "command" | "character" | "base";
 * };
 *
 * const isUnit = isCardOfType<GundamCard>("unit");
 * const gundamCard: GundamCard = { id: "1", name: "Gundam", type: "unit" };
 * console.log(isUnit(gundamCard)); // true
 * ```
 */
export function isCardOfType<T extends CardDefinition = CardDefinition>(
  cardType: T["type"],
): (card: T) => card is T & { type: typeof cardType } {
  return createTypeGuard<T, "type", T["type"]>("type", cardType);
}

/**
 * Creates a type guard for checking if a card has a specific field value
 *
 * This is a more generic version that works with any card field, not just type.
 * Useful for filtering by other properties like rarity, set, or custom fields.
 *
 * @template T - The card type (extends CardDefinition)
 * @template K - The key of the field to check
 * @template V - The value type to check against
 *
 * @param field - The field name to check
 * @param value - The value to compare against
 * @returns A type guard function
 *
 * @example
 * ```typescript
 * type ExtendedCard = CardDefinition & { rarity: "common" | "rare" | "mythic" };
 *
 * const isRare = isCardWithField<ExtendedCard, "rarity", "rare">("rarity", "rare");
 * const rareCard: ExtendedCard = {
 *   id: "1",
 *   name: "Rare Dragon",
 *   type: "creature",
 *   rarity: "rare"
 * };
 *
 * console.log(isRare(rareCard)); // true
 * ```
 */
export function isCardWithField<T extends CardDefinition, K extends keyof T, V extends T[K]>(
  field: K,
  value: V,
): (card: T) => card is T & Record<K, V> {
  return createTypeGuard<T, K, V>(field, value);
}

/**
 * Combines multiple type guards with AND logic
 *
 * Returns a type guard that passes only if all provided type guards pass.
 * Useful for filtering cards that match multiple criteria.
 *
 * @template T - The object type to guard
 * @param guards - Array of type guard functions to combine
 * @returns A combined type guard that checks all conditions
 *
 * @example
 * ```typescript
 * type Card = CardDefinition & {
 *   type: string;
 *   rarity: string;
 * };
 *
 * const isCreature = isCardOfType<Card>("creature");
 * const isRare = isCardWithField<Card, "rarity", "rare">("rarity", "rare");
 * const isRareCreature = combineTypeGuards([isCreature, isRare]);
 *
 * const cards: Card[] = [...];
 * const rareCreatures = cards.filter(isRareCreature);
 * ```
 */
export function combineTypeGuards<T>(guards: ((obj: T) => boolean)[]): (obj: T) => obj is T {
  return (obj: T): obj is T => guards.every((guard) => guard(obj));
}

/**
 * Combines multiple type guards with OR logic
 *
 * Returns a type guard that passes if any of the provided type guards pass.
 * Useful for filtering cards that match any of several criteria.
 *
 * @template T - The object type to guard
 * @param guards - Array of type guard functions to combine
 * @returns A combined type guard that checks any condition
 *
 * @example
 * ```typescript
 * const isCreature = isCardOfType("creature");
 * const isInstant = isCardOfType("instant");
 * const isSpell = combineTypeGuardsOr([isCreature, isInstant]);
 *
 * const cards: CardDefinition[] = [...];
 * const spells = cards.filter(isSpell);
 * ```
 */
export function combineTypeGuardsOr<T>(guards: ((obj: T) => boolean)[]): (obj: T) => obj is T {
  return (obj: T): obj is T => guards.some((guard) => guard(obj));
}

/**
 * Negates a type guard
 *
 * Returns a type guard that passes when the provided type guard fails.
 * Useful for filtering cards that don't match a specific criterion.
 *
 * @template T - The object type to guard
 * @param guard - The type guard to negate
 * @returns A negated type guard
 *
 * @example
 * ```typescript
 * const isCreature = isCardOfType("creature");
 * const isNotCreature = negateTypeGuard(isCreature);
 *
 * const cards: CardDefinition[] = [...];
 * const nonCreatures = cards.filter(isNotCreature);
 * ```
 */
export function negateTypeGuard<T>(guard: (obj: T) => boolean): (obj: T) => obj is T {
  return (obj: T): obj is T => !guard(obj);
}
