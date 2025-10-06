// STUB: Legacy "when" abilities module for test compatibility during migration
// This module provides type-safe stubs for the old whenAbilities system
import type { LorcanaTriggeredAbility } from "./triggered/triggered-ability";

// Stub type exports that tests may reference
export type WhenAbility = LorcanaTriggeredAbility;

// Stub helper functions that card definitions may use
export function createWhenAbility(config: any): LorcanaTriggeredAbility {
  return config as LorcanaTriggeredAbility;
}
