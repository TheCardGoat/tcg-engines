/**
 * Flow Module
 *
 * Turn structure and flow management for Lorcana.
 */

// Turn manager
export {
  addLore,
  advanceBeginningStep,
  advancePhase,
  checkLoreVictory,
  createConcession,
  createDeckOutLoss,
  createGameEndState,
  createTurnTrackers,
  endTurn,
  getCurrentPhase,
  getCurrentStep,
  getLore,
  getLoser,
  getWinner,
  hasInkedThisTurn,
  isActivePlayer,
  isGameOver,
  isInBeginningPhase,
  isInMainPhase,
  selectStartingPlayer,
  setHasInked,
  shouldSkipDraw,
} from "./turn-manager";
// Turn types
export {
  BEGINNING_STEPS,
  type BeginningStep,
  type Concession,
  type DeckOut,
  type GameConfig,
  type GameEndReason,
  type GameEndState,
  getNextBeginningStep,
  getNextPhase,
  isBeginningStep,
  isPhase,
  LORE_TO_WIN,
  type LoreVictory,
  type MulliganDecision,
  type MulliganState,
  PHASES,
  type Phase,
  STARTING_HAND_SIZE,
  type TurnTrackers,
} from "./turn-types";
