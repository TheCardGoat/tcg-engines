// STUB: Legacy conditions module for test compatibility during migration
// This module provides type-safe stubs for the old conditions system

export type Condition = {
  type: string;
  [key: string]: any;
};

// Stub helper functions that card definitions may use
export function createCondition(config: any): Condition {
  return config as Condition;
}

// Legacy condition constructors
export function ifYouHaveCharacterNamed(name: string | string[]): Condition {
  return { type: "hasCharacterNamed", name };
}

export function haveElsaInPlay(): Condition {
  return { type: "hasCharacterNamed", name: "Elsa" };
}

export function haveCaptainInPlay(): Condition {
  return { type: "hasCharacterWithClassification", classification: "captain" };
}

export function whileCharacterIsAtLocation(config: any): Condition {
  return config as Condition;
}

export function whileThisCharacterIsExerted(config: any): Condition {
  return config as Condition;
}

export function ifThisCharacterIsExerted(config: any): Condition {
  return config as Condition;
}

export function duringYourTurn(config: any): Condition {
  return config as Condition;
}

export function duringOpponentsTurn(config?: any): Condition {
  return { type: "duringOpponentsTurn", ...config } as Condition;
}

export function youHaveLocationInPlay(): Condition {
  return { type: "youHaveLocationInPlay" };
}

export function unlessItIsAtALocation(config: any): Condition {
  return config as Condition;
}

// Additional missing conditions
export function youHaveItemInPlay(): Condition {
  return { type: "youHaveItemInPlay" };
}

export function haveItemInPlay(): Condition {
  return { type: "haveItemInPlay" };
}

export function ifYouHaveAnInventor(): Condition {
  return { type: "ifYouHaveAnInventor" };
}

export function ifYouHaveAnotherPirate(): Condition {
  return { type: "ifYouHaveAnotherPirate" };
}

export function haveMoreCardsThanOpponent(): Condition {
  return { type: "haveMoreCardsThanOpponent" };
}

export function whileADamagedCharacterIsInPlay(): Condition {
  return { type: "whileADamagedCharacterIsInPlay" };
}

export function haveItemInDiscard(): Condition {
  return { type: "haveItemInDiscard" };
}

export function have3orMorePuppiesInPlay(): Condition {
  return { type: "have3orMorePuppiesInPlay" };
}

export function ifYouHaveACardInYourDiscardNamed(name: string): Condition {
  return { type: "ifYouHaveACardInYourDiscardNamed", name };
}

export function whileAnotherDamagedCharacterIsInPlay(): Condition {
  return { type: "whileAnotherDamagedCharacterIsInPlay" };
}

export function whileThereAreXOrMoreDamagedCharacter(count: number): Condition {
  return { type: "whileThereAreXOrMoreDamagedCharacter", count };
}

export function haveXorMoreCharactersInPlay(count: number): Condition {
  return { type: "haveXorMoreCharactersInPlay", count };
}

export function whileYouHaveTwoOrMoreCharactersExerted(): Condition {
  return { type: "whileYouHaveTwoOrMoreCharactersExerted" };
}

export function youDidntPutAnyCardsIntoYourInkwellThisTurn(): Condition {
  return { type: "youDidntPutAnyCardsIntoYourInkwellThisTurn" };
}

export function youHaveDealtDamageToOpposingCharacterThisTurn(): Condition {
  return { type: "youHaveDealtDamageToOpposingCharacterThisTurn" };
}

export function xOrMoreCharsSangThisSongCondition(count: number): Condition {
  return { type: "xOrMoreCharsSangThisSongCondition", count };
}

export function whileYouHaveCharacterWithAbility(ability: string): Condition {
  return { type: "whileYouHaveCharacterWithAbility", ability };
}

export function ifThereIsACardUnder(): Condition {
  return { type: "ifThereIsACardUnder" };
}

// Legacy aliases
export const ifYouHaveACharacterHere = ifYouHaveCharacterNamed;
export const ifThisCharacterIsAtALocation = whileCharacterIsAtLocation;
export const dontHaveCaptainInPlay = haveCaptainInPlay;
export const notHaveCharacterNamed = ifYouHaveCharacterNamed;
