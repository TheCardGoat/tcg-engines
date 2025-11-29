/**
 * Targeting Module
 *
 * Provides DSL and utilities for expressing and resolving card/player targets
 * in a game-agnostic way. Game engines extend these types for game-specific
 * targeting needs.
 *
 * @module targeting
 */

// Legacy target definition (for backward compatibility with moves)
export type {
  TargetCount as LegacyTargetCount,
  TargetDefinition,
  TargetRestriction,
} from "./target-definition";
// Core DSL types
export {
  type BaseContext,
  DEFAULT_SELF_TARGET,
  DEFAULT_SINGLE_TARGET,
  getMaxCount,
  getMinCount,
  isMultipleTargetSelector,
  isOptionalCount,
  type OwnerScope,
  type PlayerTargetDSL,
  requiresPlayerChoice,
  type SelectorScope,
  type TargetCount,
  type TargetDSL,
  type TargetingUIHint,
} from "./target-dsl";
// Target resolution
export {
  BaseTargetResolver,
  invalidSelection,
  type TargetIssue,
  type TargetResolutionContext,
  type TargetResolver,
  type TargetValidationResult,
  validateTargetCount,
  validSelection,
} from "./target-resolver";

// Target validation utilities
export {
  enumerateTargetCombinations,
  getLegalTargets,
  isLegalTarget,
  type TargetContext,
  type ValidationResult,
  validateTargetSelection,
} from "./target-validation";
