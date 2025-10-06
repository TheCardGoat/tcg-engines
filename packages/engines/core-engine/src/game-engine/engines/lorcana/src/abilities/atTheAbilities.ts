// STUB: Legacy "atThe" abilities module for test compatibility during migration
// This module provides type-safe stubs for the old atTheAbilities system
import type { LorcanaTriggeredAbility } from "./triggered/triggered-ability";

// Stub type exports that tests may reference
export type AtTheAbility = LorcanaTriggeredAbility;

// Stub helper functions that card definitions may use
export function createAtTheAbility(config: any): LorcanaTriggeredAbility {
  return config as LorcanaTriggeredAbility;
}

// Legacy ability constructors
export function atTheEndOfYourTurn(config: any): LorcanaTriggeredAbility {
  return config as LorcanaTriggeredAbility;
}

export function atTheEndOfEachOpponentsTurn(
  config: any,
): LorcanaTriggeredAbility {
  return config as LorcanaTriggeredAbility;
}

export function atTheStartOfYourTurn(config: any): LorcanaTriggeredAbility {
  return config as LorcanaTriggeredAbility;
}
