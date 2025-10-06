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
