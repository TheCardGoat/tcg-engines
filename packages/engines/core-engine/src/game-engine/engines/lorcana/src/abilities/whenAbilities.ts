// STUB: Legacy "when" abilities module for test compatibility during migration
// This module provides type-safe stubs for the old whenAbilities system
import type { LorcanaTriggeredAbility } from "./triggered/triggered-ability";

// Stub type exports that tests may reference
export type WhenAbility = LorcanaTriggeredAbility;

// Stub helper functions that card definitions may use
export function createWhenAbility(config: any): LorcanaTriggeredAbility {
  return config as LorcanaTriggeredAbility;
}

// Legacy ability constructors
export function whenYouPlayThisCharAbility(
  config: any,
): LorcanaTriggeredAbility {
  return config as LorcanaTriggeredAbility;
}

export function whenYouPlayThisForEachYouPayLess(
  config: any,
): LorcanaTriggeredAbility {
  return config as LorcanaTriggeredAbility;
}

export function whenThisCharChallengesAndIsBanished(
  config: any,
): LorcanaTriggeredAbility {
  return config as LorcanaTriggeredAbility;
}

export function whenYouPlayMayDrawACard(config: any): LorcanaTriggeredAbility {
  return config as LorcanaTriggeredAbility;
}

export function whenThisCharacterBanishedInAChallenge(
  config: any,
): LorcanaTriggeredAbility {
  return config as LorcanaTriggeredAbility;
}

export function whenChallengedAndBanished(
  config: any,
): LorcanaTriggeredAbility {
  return config as LorcanaTriggeredAbility;
}

export function whenChallenged(config: any): LorcanaTriggeredAbility {
  return config as LorcanaTriggeredAbility;
}

export function whenPlayAndWheneverQuests(
  config: any,
): LorcanaTriggeredAbility[] {
  return [config as LorcanaTriggeredAbility];
}

export function whenThisCharacterBanished(
  config: any,
): LorcanaTriggeredAbility {
  return config as LorcanaTriggeredAbility;
}

// Legacy alias
export const whenThisIsBanished = whenThisCharacterBanished;

export function whenPlayAndWhenLeaves(config: any): LorcanaTriggeredAbility[] {
  return [config as LorcanaTriggeredAbility];
}

export function whenYourOtherCharactersIsBanished(
  config: any,
): LorcanaTriggeredAbility {
  return config as LorcanaTriggeredAbility;
}

export function whenXIsBanished(config: any): LorcanaTriggeredAbility {
  return config as LorcanaTriggeredAbility;
}

export function whenMovesToALocation(config: any): LorcanaTriggeredAbility {
  return config as LorcanaTriggeredAbility;
}

export function whenYouPlayThis(config: any): LorcanaTriggeredAbility {
  return config as LorcanaTriggeredAbility;
}

export function whenYouMoveACharacterHere(
  config: any,
): LorcanaTriggeredAbility {
  return config as LorcanaTriggeredAbility;
}

export function whenThisIsTargeted(config: any): LorcanaTriggeredAbility {
  return config as LorcanaTriggeredAbility;
}

export function whenPlayOnThisCard(config: any): LorcanaTriggeredAbility {
  return config as LorcanaTriggeredAbility;
}

// Legacy alias
export const whenYouPlayThisCharacter = whenYouPlayThisCharAbility;
