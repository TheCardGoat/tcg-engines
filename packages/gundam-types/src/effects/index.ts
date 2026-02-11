/**
 * Gundam Card Game Effect Types
 *
 * Complete type system for defining card effects in Gundam Card Game.
 *
 * This module provides type definitions for:
 * - Effect Actions: All possible actions an effect can perform
 * - Effect Timing: When effects can activate or resolve
 * - Keywords: Official game keyword abilities
 * - Targeting: System for selecting valid targets
 * - Effect Definition: Complete effect schema
 * - Card Definitions: Card types with effects
 *
 * Based on Gundam Card Game Official Rules Sections 11-1 through 11-5.
 */

// ============================================================================
// LEGACY TYPES (Transitional - To be removed)
// ============================================================================

// Legacy to new effect mapper
export {
  asActivatedEffect,
  asConstantEffect,
  asTriggeredEffect,
  legacyToNewEffect,
  legacyToNewEffects,
} from "./legacy-mapper";
// Legacy types for backward compatibility during migration
export type * from "./legacy-types";

// ============================================================================
// TYPE EXPORTS
// ============================================================================

// Effect Actions
export type * from "./effect-actions";

// Effect Timing
export type * from "./effect-timing";

// Keywords
export type * from "./keywords";

// Targeting System (includes LevelFilter, CostFilter, CardType, Color, CardFilter)
export type {
  CardFilter,
  CardType,
  Color,
  TargetCountRange,
  TargetFilter,
  TargetingSpec,
  TargetPropertyFilter,
  TargetStateFilter,
  ZoneType,
} from "./targeting";

// ============================================================================
// EFFECT DEFINITION
// ============================================================================

// Effect Definition
export type * from "./effect-definition";

// Effect narrowing types
export type {
  ActivatedEffect,
  ConstantEffect,
  TriggeredEffect,
} from "./effect-definition";

// ============================================================================
// CARD DEFINITIONS
// ============================================================================
//
// NOTE: Card definitions (BaseEffectCardDefinition, CommandCardDefinition,
// UnitCardDefinition, BaseCardDefinition, PilotEffect) are exported from
// ./cards/card-types.ts to avoid duplicate exports. These types extend the
// RawCardDefinition which is the canonical source for card definitions.
//
// The types in ./card-definitions.ts are internal and should not be directly
// imported from this package.
//
// import type { CommandCardDefinition } from "@tcg/gundam-types/cards";
