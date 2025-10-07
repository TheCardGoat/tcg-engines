// STUB: Legacy "while" abilities module for test compatibility during migration
// This module provides type-safe stubs for the old whileAbilities system
import type { LorcanaStaticAbility } from "./static/static";

// Stub type exports that tests may reference
export type WhileAbility = LorcanaStaticAbility;

// Stub helper functions that card definitions may use
export function createWhileAbility(config: any): LorcanaStaticAbility {
  return config as LorcanaStaticAbility;
}

// Legacy ability constructors
export function whileConditionThisCharacterGains(
  config: any,
): LorcanaStaticAbility {
  return config as LorcanaStaticAbility;
}

export function whileConditionOnThisCharacterTargetsGain(
  config: any,
): LorcanaStaticAbility {
  return config as LorcanaStaticAbility;
}

export function whileConditionThisCharacterGets(
  config: any,
): LorcanaStaticAbility {
  return config as LorcanaStaticAbility;
}

export function targetCardsGains(config: any): LorcanaStaticAbility {
  return config as LorcanaStaticAbility;
}

export function whileThisCharacterHasNoDamageGets(
  config: any,
): LorcanaStaticAbility {
  return config as LorcanaStaticAbility;
}

export function yourOtherCharactersWithGain(config: any): LorcanaStaticAbility {
  return config as LorcanaStaticAbility;
}

export function whileThisCharacterHasDamageGets(
  config: any,
): LorcanaStaticAbility {
  return config as LorcanaStaticAbility;
}

export function whileCharacterIsAtLocation(config: any): LorcanaStaticAbility {
  return config as LorcanaStaticAbility;
}

export function whileCharacterIsAtLocationItGains(
  config: any,
): LorcanaStaticAbility {
  return config as LorcanaStaticAbility;
}

export function whileCharacterIsAtLocationItGets(
  config: any,
): LorcanaStaticAbility {
  return config as LorcanaStaticAbility;
}

export function whileThisCharacterIsExerted(config: any): LorcanaStaticAbility {
  return config as LorcanaStaticAbility;
}

export function whileYouHaveACharacterNamedThisCharGets(
  config: any,
): LorcanaStaticAbility {
  return config as LorcanaStaticAbility;
}

export function yourOtherCharactersGet(config: any): LorcanaStaticAbility {
  return config as LorcanaStaticAbility;
}

export function thisMissionIsCursed(config: any): LorcanaStaticAbility {
  return config as LorcanaStaticAbility;
}

export function whileYouHaveACharacterNamedThisCharGains(
  config: any,
): LorcanaStaticAbility {
  return config as LorcanaStaticAbility;
}

export function whileYouHaveAnotherCharacterInPlayThisCharacterGets(
  config: any,
): LorcanaStaticAbility {
  return config as LorcanaStaticAbility;
}

export function whileNoOtherCharacterHasQuestedThisCharacterGets(
  config: any,
): LorcanaStaticAbility {
  return config as LorcanaStaticAbility;
}

export function whileYouHaveAnotherCharacterWithCharacteristicThisCharacterGets(
  config: any,
): LorcanaStaticAbility {
  return config as LorcanaStaticAbility;
}

export function whileYouHaveMoreItemsInPlayThanEachOpponentThisCharacterGets(
  config: any,
): LorcanaStaticAbility {
  return config as LorcanaStaticAbility;
}

export function whileYouHaveCharactersHere(config: any): LorcanaStaticAbility {
  return config as LorcanaStaticAbility;
}

export function whileYouHaveNoCardsInHandThisCharacterCanChallengeReadyChars(
  config: any,
): LorcanaStaticAbility {
  return config as LorcanaStaticAbility;
}
