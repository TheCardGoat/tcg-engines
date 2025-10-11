/**
 * Test Helper Utilities for Gundam E2E Testing
 *
 * Central export module for all test helper utilities. This module provides a
 * unified interface for:
 *
 * **Assertion Helpers** (`assertion-helpers.ts`):
 * - Verify game state (phases, segments, zones, player info)
 * - Type-safe assertions with descriptive error messages
 * - Validate card locations and unit statistics
 *
 * **Scenario Builders** (`scenario-builders.ts`):
 * - Create common test scenarios consistently
 * - Game start, combat, resource, deck construction setups
 * - Return configured engine instances ready for testing
 *
 * **Card Catalog Helpers** (`card-catalog-index.ts`):
 * - Search and filter real cards from the catalog
 * - Find cards by set, type, color, cost, stats, keywords, traits
 * - Follow "Real Cards First" principle
 *
 * ## Usage
 *
 * Import utilities from this module to keep test imports clean and organized:
 *
 * ```typescript
 * import {
 *   buildGameStartScenario,
 *   assertZoneCount,
 *   assertGamePhase,
 *   getCardsByKeyword
 * } from "../helpers";
 * ```
 *
 * @module test-helpers
 * @see assertion-helpers for game state verification
 * @see scenario-builders for test scenario creation
 * @see card-catalog-index for card search and filtering
 */

// Assertion helpers - verify game state and conditions
export {
  /** Assert that a card is in a specific zone */
  assertCardInZone,
  /** Assert that the game is in a specific phase */
  assertGamePhase,
  /** Assert that the game is in a specific segment */
  assertGameSegment,
  /** Assert that priority order matches expected player sequence */
  assertPriorityOrder,
  /** Assert that a specific player has priority */
  assertPriorityPlayer,
  /** Assert that a specific player is the turn player */
  assertTurnPlayer,
  /** Assert that a unit has specific stats */
  assertUnitHasStats,
  /** Assert that a zone is at its maximum capacity */
  assertZoneAtCapacity,
  /** Assert that a zone contains an expected number of cards */
  assertZoneCount,
} from "./assertion-helpers";

// Card catalog helpers - search and filter real cards
export {
  /** Get a specific card by its unique ID */
  getCardById,
  /** Get all cards of a specific color */
  getCardsByColor,
  /** Get cards by cost (exact or range) */
  getCardsByCost,
  /** Get units by HP (exact or range) */
  getCardsByHP,
  /** Get cards with specific keyword/ability type */
  getCardsByKeyword,
  /** Get all cards from a specific set */
  getCardsBySet,
  /** Get cards with specific trait */
  getCardsByTrait,
  /** Get all cards of a specific type */
  getCardsByType,
  /** Get comprehensive statistics about the card catalog */
  getCatalogStats,
  /** Get a random card from the catalog */
  getRandomCard,
  /** Get units by Attack Power (AP) */
  getUnitsByAP,
} from "./card-catalog-index";

// Scenario builders - create common test scenarios
export {
  /** Build a combat scenario with units in battle area */
  buildCombatScenario,
  /** Build a scenario for testing deck construction rules */
  buildDeckConstructionScenario,
  /** Build a game start scenario with proper initial setup */
  buildGameStartScenario,
  /** Build a scenario with specified resource counts */
  buildResourceScenario,
} from "./scenario-builders";
