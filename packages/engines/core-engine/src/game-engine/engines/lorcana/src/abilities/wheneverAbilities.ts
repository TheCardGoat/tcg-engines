// STUB: Legacy "whenever" abilities module for test compatibility during migration
// This module provides type-safe stubs for the old wheneverAbilities system
import type { LorcanaTriggeredAbility } from "./triggered/triggered-ability";

// Stub type exports that tests may reference
export type WheneverAbility = LorcanaTriggeredAbility;

// Stub helper functions that card definitions may use
export function createWheneverAbility(config: any): LorcanaTriggeredAbility {
  return config as LorcanaTriggeredAbility;
}
