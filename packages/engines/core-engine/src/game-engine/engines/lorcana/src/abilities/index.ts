// STUB: Legacy exports for test compatibility during migration
export * from "./ability-types";
export * from "./duration";
export * from "./effect-types";
// Note: player-effect has duplicate exports (DiscardEffect) so we import specifically
export type { PlayerEffect } from "./player-effect";
export * from "./should-auto-resolve-layer";
export * from "./trigger-resolver";

// Legacy ability exports
export const bodyguardAbility: any = { type: "keyword", keyword: "bodyguard" };
export const supportAbility: any = { type: "keyword", keyword: "support" };
export const SingerAbility: any = { type: "keyword", keyword: "singer" };
export type SingerAbility = any; // Legacy: export as type too
export const ChallengerAbility: any = {
  type: "keyword",
  keyword: "challenger",
};
export type ChallengerAbility = any; // Legacy: export as type too
export const rushAbility: any = { type: "keyword", keyword: "rush" };
export const challengerAbility: any = {
  type: "keyword",
  keyword: "challenger",
};
export const evasiveAbility: any = { type: "keyword", keyword: "evasive" };
export const recklessAbility: any = { type: "keyword", keyword: "reckless" };
export const wardAbility: any = { type: "keyword", keyword: "ward" };
export const shiftAbility: any = { type: "keyword", keyword: "shift" };
export const ShiftAbility: any = { type: "keyword", keyword: "shift" };
export const resistAbility: any = { type: "keyword", keyword: "resist" };
export const protectorAbility: any = { type: "keyword", keyword: "protector" };

// Legacy type aliases for abilities
export type ActivatedAbility = any;
export type GainAbilityStaticAbility = any;
export type TriggeredAbility = any;
export type RestrictionStaticAbility = any;
export type EffectStaticAbility = any;
export type StaticAbilityWithEffect = any;
export type ResolutionAbility = any;
export type StaticAbility = any;
export type MetaAbility = any;
export type PlayConditionAbility = any;

// Legacy ability constructor
export const yourCharactersNamedGain: any = () => ({});
export const charactersWithCostXorLessCantChallenge: any = () => ({});
export const duringYourTurnGains: any = () => ({});
export const madameMimAbility: any = () => ({});
export const exertCharCost: any = { type: "exert" };
export const damageDealtRestrictionEffect: any = () => ({});
export const atEndOfTurnBanishItself: any = () => ({});
export const yourOtherCharactersWithGain: any = () => ({});
export const reverseChallenge: any = () => ({});
export const challengeReadyCharacters: any = () => ({});
export const duringYourTurnWheneverBanishesCharacterInChallenge: any =
  () => ({});
export const exertedCharCantReadyNextTurn: any = () => ({});
export const gainAbilityWhileHere: any = () => ({});
export const ifThisCharacterIsExerted: any = () => ({});
export const duringYourTurn: any = () => ({});
export const thisMissionIsCursed: any = () => ({});
export const unlessItIsAtALocation: any = () => ({});
export const singerAbility: any = { type: "keyword", keyword: "singer" };
export const moveDamageAbility: any = () => ({});
export const yourOtherCharactersGet: any = () => ({});
export const otherCharacterGains: any = () => ({});
export const exertItemCost: any = { type: "exert" };
export const wheneverYouPlayAnActionNotASong: any = () => ({});
export const wheneverOneOfYouCharactersIsBanished: any = () => ({});
export const wheneverOneOfYourCharactersSings: any = () => ({});
export const whenThisIsBanished: any = () => ({});
export const duringYourTurnThisCharacterGains: any = () => ({});
export const duringOpponentsTurn: any = () => ({});
export const yourCharactersNamed: any = () => ({});

// Additional missing ability exports
export const vanishAbility: any = { type: "keyword", keyword: "vanish" };
export const voicelessAbility: any = { type: "keyword", keyword: "voiceless" };
export const metaAbility: any = () => ({});
export const chosenExertedCharacterCantReadyWhileThisIsInPlace: any =
  () => ({});
export const duringYourTurnWheneverBanishesItem: any = () => ({});
export const targetCharacterGains: any = () => ({});
export const PlayerRestrictionStaticAbility = RestrictionStaticAbility;
