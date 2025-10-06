// STUB: Legacy "while" abilities module for test compatibility during migration
// This module provides type-safe stubs for the old whileAbilities system
import type { LorcanaStaticAbility } from "./static/static";

// Stub type exports that tests may reference
export type WhileAbility = LorcanaStaticAbility;

// Stub helper functions that card definitions may use
export function createWhileAbility(config: any): LorcanaStaticAbility {
  return config as LorcanaStaticAbility;
}
