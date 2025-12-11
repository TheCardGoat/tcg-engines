/**
 * Systems Module
 *
 * Core game systems for Lorcana:
 * - The Bag (Rule 1.7, 8.7)
 * - Game State Check (Rule 1.9)
 * - Win/Loss conditions
 * - Banishment
 */

// Bag management
export {
  addToBag,
  addTriggeredAbilityToBag,
  chooseToResolve,
  clearBag,
  completeResolution,
  createBagEntry,
  getBagEntriesForPlayer,
  getBagSize,
  getEntriesByTimestamp,
  getEntry,
  getNextResolvableEntries,
  getResolvableEntries,
  hasEntry,
  isBagEmpty,
  mustResolveBag,
  removeFromBag,
  setCurrentlyResolving,
} from "./bag";
// Game state check
export {
  checkLossConditions,
  checkWinConditions,
  determineGameEnd,
  getCardsExceedingWillpower,
  getLoser,
  getWinner,
  isGameOver,
  needsGameStateCheck,
  performGameStateCheck,
  shouldBanish,
} from "./game-state-check";
// System types
export {
  type BagEntry,
  type BagResolutionChoice,
  type BagState,
  createEmptyBagState,
  createResolutionState,
  type GameEndReason,
  type GameEndState,
  type GameStateCheckResult,
  type LossCondition,
  type RequiredAction,
  type ResolutionState,
  type WinCondition,
} from "./system-types";
