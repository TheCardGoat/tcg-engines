/**
 * Keywords Module
 *
 * Comprehensive keyword handling for Lorcana.
 * All 12 keywords: Bodyguard, Challenger, Evasive, Reckless, Resist,
 * Rush, Shift, Singer, Sing Together, Support, Vanish, Ward
 */

// Re-export core keyword utilities from card-utils for convenience
export {
  getAllKeywords,
  getShiftCost,
  getShiftTargetName,
  getTotalKeyword,
  hasBodyguard,
  hasEvasive,
  hasKeyword,
  hasReckless,
  hasRush,
  hasShift,
  hasVanish,
  hasWard,
} from "../card-utils";
// Re-export keyword type definitions
export {
  type ChallengerKeyword,
  getSingerValue,
  getSingTogetherValue,
  getTotalKeywordValue,
  type Keyword,
  type KeywordType,
  type ResistKeyword,
  type ShiftKeyword,
  type SimpleKeyword,
  type SingerKeyword,
  type SingTogetherKeyword,
} from "../types/keywords";
// Keyword effect implementations
export {
  // Stacking keywords
  calculateTotalChallenger,
  calculateTotalResist,
  canBeChosenBy,
  // Rush (Rule 10.7)
  canBypassDrying,
  // Singer/Sing Together (Rules 10.9-10.10)
  canSingSong,
  canSingTogether,
  // Ward (Rule 10.13)
  checkWardProtection,
  createSingerPayment,
  // Support (Rule 10.11)
  createSupportBonus,
  getValidSupportTargets,
  getVanishRedirect,
  hasSupport,
  hasSupportKeyword,
  needsDryRequirement,
  // Vanish (Rule 10.12)
  shouldVanishRedirect,
} from "./keyword-effects";
// Keyword effect types
export type {
  KeywordContext,
  KeywordEvent,
  ShiftStackInfo,
  SingerPayment,
  StackingKeywordTotal,
  SupportContext,
  VanishRedirect,
  WardCheckResult,
} from "./keyword-types";
