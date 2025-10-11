// Core ability exports
export * from "./ability-types";
export * from "./duration";
export * from "./effect-types";
// Keyword abilities - export from keyword module
export * from "./keyword/keyword";
// Note: player-effect has duplicate exports (DiscardEffect) so we import specifically
export type { PlayerEffect } from "./player-effect";
export * from "./should-auto-resolve-layer";
export * from "./trigger-resolver";

// Legacy alias exports for backward compatibility
export const protectorAbility: any = { type: "keyword", keyword: "bodyguard" }; // bodyguard was renamed to protector in some contexts

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
// PlayerRestrictionStaticAbility is a type, not a value - use RestrictionStaticAbility type directly
