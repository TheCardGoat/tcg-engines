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
export function ifYouHaveCharacterNamed(name: string): Condition {
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

export function unlessItIsAtALocation(config: any): Condition {
  return config as Condition;
}

// Re-export Condition type for old import paths
export type { Condition };
