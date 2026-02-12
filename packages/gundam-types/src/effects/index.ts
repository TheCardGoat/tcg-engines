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
// Export from targeting.ts for CardFilter and ZoneType
export type {
  CardFilter,
  PropertyCostFilter,
  ZoneType,
} from "./targeting";
// Targeting System (includes LevelFilter, CardType, Color, CardFilter)
// Export from targeting-types
export type {
  CardType,
  Color,
  LevelFilter,
  TargetCountRange,
  TargetFilter,
  TargetingSpec,
  TargetPropertyFilter,
  TargetStateFilter,
} from "./targeting-types";

// ============================================================================
// EFFECT DEFINITION
// ============================================================================

// Card Definitions (for targeting system)
// NOTE: CommandCardDefinition and UnitCardDefinition are exported from cards/card-types
// to avoid duplicate exports. Only export unique types here.
export type {
  BaseCardDefinition as EffectBaseCardDefinition,
  BaseEffectCardDefinition,
  PilotEffect,
} from "./card-definitions";
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
