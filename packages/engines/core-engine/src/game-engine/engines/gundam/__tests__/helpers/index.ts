/**
 * Test Helper Utilities for Gundam E2E Testing
 *
 * This module exports helper utilities for writing comprehensive E2E tests:
 * - Assertion helpers for verifying game state
 * - Scenario builders for setting up common test scenarios
 * - Card catalog index for finding and filtering real cards
 */

export {
  assertCardInZone,
  assertGamePhase,
  assertGameSegment,
  assertPriorityPlayer,
  assertTurnPlayer,
  assertUnitHasStats,
  assertZoneCount,
} from "./assertion-helpers";
export {
  getCardById,
  getCardsByColor,
  getCardsByCost,
  getCardsByHP,
  getCardsByKeyword,
  getCardsBySet,
  getCardsByTrait,
  getCardsByType,
  getCatalogStats,
  getRandomCard,
  getUnitsByAP,
} from "./card-catalog-index";
export {
  buildCombatScenario,
  buildDeckConstructionScenario,
  buildGameStartScenario,
  buildResourceScenario,
} from "./scenario-builders";
