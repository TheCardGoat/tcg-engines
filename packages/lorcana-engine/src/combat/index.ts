/**
 * Combat Module
 *
 * Quest and challenge mechanics for Lorcana.
 */

// Challenge
export {
  applyResist,
  calculateChallengeDamage,
  canChallenge,
  getChallengeableTargets,
  getReadyBodyguards,
  validateChallenge,
  wouldBanish,
} from "./challenge";
// Combat types
export type {
  ChallengeMove,
  ChallengeState,
  ChallengeValidationError,
  DamageCalculation,
  DamageModifier,
  MoveToLocationError,
  MoveToLocationMove,
  QuestMove,
  QuestValidationError,
} from "./combat-types";
// Quest
export {
  getQuestableCharacters,
  getQuestLore,
  validateCanQuest,
  validateQuest,
} from "./quest";
