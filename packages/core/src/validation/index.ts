/**
 * Validation utilities for @tcg/core
 *
 * This module provides type guards, validators, and schema builders
 * for runtime validation of cards, moves, and game states.
 *
 * @module validation
 */

// Card-specific type guards
export {
  combineTypeGuards,
  combineTypeGuardsOr,
  isCardOfType,
  isCardWithField,
  negateTypeGuard,
} from "./card-type-guards";
// Zod schema builders
export {
  composeSchemas,
  createArraySchema,
  createCardSchema,
  createDiscriminatedUnion,
  createMultiRefinedSchema,
  createOptionalSchema,
  createRecordSchema,
  createRefinedSchema,
  createStrictSchema,
  extendSchema,
  mergeSchemas,
} from "./schema-builders";
// Type guard builder
export { createTypeGuard } from "./type-guard-builder";
// Validator builder
export {
  createValidator,
  type ValidationResult,
  type Validator,
  ValidatorBuilder,
} from "./validator-builder";
