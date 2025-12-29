// We must use the real type during parsing, so we don't create duplicated types
// To avoid cyclic dependencies, we must not import @tcg/lorcana from here, as @tcg/lorcana also import cards.
// import type {
//   Ability as LorcanaAbility,
//   Condition as LorcanaCardCondition,
//   AbilityCost as LorcanaCost,
//   Effect as LorcanaEffect,
//   CardTarget as LorcanaTarget,
// } from "@tcg/lorcana";

/**
 *
 * Internal type definitions for v2 parser.
 * These are temporary types used during parsing.
 * Final output types will come from @tcg/lorcana in later phases.
 */

/**
 * Placeholder ability type for v2 parser.
 * Will be replaced with proper types from @tcg/lorcana.
 */
export interface Ability {
  type: "triggered" | "activated" | "static" | "keyword";
  [key: string]: unknown;
}

/**
 * Placeholder effect type for v2 parser.
 * Will be replaced with proper types from @tcg/lorcana.
 */
export interface Effect {
  type: string;
  [key: string]: unknown;
}
