/**
 * @tcg/lorcana - Disney Lorcana TCG Engine
 *
 * A complete implementation of Disney Lorcana using the @tcg/core framework.
 * This package serves as both a production-ready Lorcana engine and a reference
 * implementation demonstrating best practices for building TCG engines.
 *
 * Key Concepts:
 * - NO defineMove(), defineZone(), definePhase(), defineCard() helpers
 * - Use GameDefinition<TState, TMoves> type directly
 * - Zones are simple state arrays: Record<PlayerId, CardId[]>
 * - Cards are plain objects in lookup tables
 * - Moves use GameMoveDefinitions with condition and reducer
 * - Flow is optional - use FlowDefinition or simple state tracking
 */

// Re-export core framework types for convenience
export type {
  GameDefinition,
  MoveContext,
  MoveExecutionResult,
  RuleEngine,
  RuleEngineOptions,
} from "@tcg/core";
// Export card-utils
export {
  canInk,
  getAllKeywords,
  getAmpersandNames,
  getLoreValue,
  getMoveCost,
  getShiftCost,
  getShiftTargetName,
  getStrength,
  getTotalKeyword,
  getWillpower,
  hasAmpersandName,
  hasBodyguard,
  hasEvasive,
  hasKeyword,
  hasReckless,
  hasRush,
  hasSameName,
  hasShift,
  hasVanish,
  hasWard,
  isAction,
  isCharacter,
  isItem,
  isLocation,
  isSong,
} from "./card-utils";
// Spec 1: Foundation & Types
export * from "./deck-validation";
// Spec 3: Turn Structure & Flow
export * from "./flow";
// Spec 4: Core Moves
export * from "./moves";
// Spec 5: Quest, Challenge & Locations
// Note: ChallengeState is exported by both combat and types, so we don't re-export everything from combat
export {
  applyResist,
  calculateChallengeDamage,
  canChallenge,
  canQuest,
  getChallengeableTargets,
  getQuestLore,
  getReadyBodyguards,
  validateChallenge,
  validateQuest,
  wouldBanish,
} from "./combat";
// Spec 6: Keywords
export {
  calculateTotalChallenger,
  calculateTotalResist,
  canBeChosenBy,
  canBypassDrying,
  canSingSong,
  canSingTogether,
  checkWardProtection,
  createSingerPayment,
  createSupportBonus,
  getValidSupportTargets,
  getVanishRedirect,
  hasSupport,
  hasSupportKeyword,
  type KeywordContext,
  type KeywordEvent,
  needsDryRequirement,
  type ShiftStackInfo,
  type SingerPayment,
  type StackingKeywordTotal,
  type SupportContext,
  shouldVanishRedirect,
  type VanishRedirect,
  type WardCheckResult,
} from "./keywords";
// Engine exports
export { LorcanaEngine } from "./engine/lorcana-engine";
// Type exports
export * from "./types";
// Move enumeration type exports
export type {
  AvailableMoveInfo,
  MoveParameterOptions,
  MoveParamSchema,
  MoveValidationError,
  ParameterInfo,
  ParamFieldSchema,
} from "./types/move-enumeration";
// Spec 2: Zones & Card States
export * from "./zones";
