/**
 * @tcg/lorcana-cards
 *
 * Card definitions and tooling for Lorcana TCG.
 *
 * Types and builders are provided by @tcg/lorcana-engine package.
 * This package provides:
 * - Card data definitions
 *
 * @example Get all cards
 * ```typescript
 * import { allCards, allCardsById, getLorcanaCardCatalog } from "@tcg/lorcana-cards";
 *
 * // Get catalog for engine
 * const catalog = getLorcanaCardCatalog();
 * ```
 */

export { fromDeckToCardInstances } from "./utils/fromDeckToCardInstances";
export * from "./utils/deck-list-resolver";

// Re-export card catalog
export { getAllCards, getAllCardsById, getLorcanaCardCatalog } from "./cards";
