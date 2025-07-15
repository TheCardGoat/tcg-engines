/**
 * Error Backward Compatibility Type Aliases
 *
 * This file contains type aliases for backward compatibility with older versions
 * of the core-engine error types. These types are deprecated and should not be used in new code.
 *
 * Instead, use the consolidated error types from consolidated-errors.ts.
 */

import type {
  EntityNotFoundError,
  FlowFailedError,
  MoveValidationFailedError,
  PermissionDeniedError,
  SerializationFailedError,
  StateUpdateFailedError,
  SystemFailureError,
  ValidationFailedError,
} from "./consolidated-errors";

// ============================================================================
// Validation Error Aliases
// ============================================================================

/** @deprecated Use ValidationFailedError with entityType: "state" instead */
export type StateValidationError = ValidationFailedError;

/** @deprecated Use ValidationFailedError with entityType: "context" instead */
export type ContextValidationError = ValidationFailedError;

/** @deprecated Use ValidationFailedError with entityType: "card" instead */
export type InvalidCardStateError = ValidationFailedError;

/** @deprecated Use ValidationFailedError with entityType: "zone" instead */
export type ZoneValidationError = ValidationFailedError;

/** @deprecated Use ValidationFailedError with entityType: "player" instead */
export type PlayerValidationError = ValidationFailedError;

/** @deprecated Use ValidationFailedError with entityType: "move" instead */
export type MoveValidationError = ValidationFailedError;

// ============================================================================
// Not Found Error Aliases
// ============================================================================

/** @deprecated Use EntityNotFoundError with entityType: "card" instead */
export type CardNotFoundError = EntityNotFoundError;

/** @deprecated Use EntityNotFoundError with entityType: "zone" instead */
export type ZoneNotFoundError = EntityNotFoundError;

/** @deprecated Use EntityNotFoundError with entityType: "modifier" instead */
export type ModifierNotFoundError = EntityNotFoundError;

/** @deprecated Use EntityNotFoundError with entityType: "player" instead */
export type PlayerNotFoundError = EntityNotFoundError;

// ============================================================================
// State Update Error Aliases
// ============================================================================

/** @deprecated Use StateUpdateFailedError with stateType: "game" instead */
export type StateUpdateError = StateUpdateFailedError;

/** @deprecated Use StateUpdateFailedError with stateType: "context" instead */
export type ContextUpdateError = StateUpdateFailedError;

/** @deprecated Use StateUpdateFailedError with stateType: "card" and updateType: "enrichment" instead */
export type CardEnrichmentError = StateUpdateFailedError;

/** @deprecated Use StateUpdateFailedError with stateType: "zone" instead */
export type ZoneUpdateError = StateUpdateFailedError;

/** @deprecated Use StateUpdateFailedError with stateType: "state" and updateType: "transition" instead */
export type StateTransitionError = StateUpdateFailedError;

// ============================================================================
// Move Error Aliases
// ============================================================================

/** @deprecated Use MoveValidationFailedError instead */
export type ZoneMoveValidationError = MoveValidationFailedError;

/** @deprecated Use MoveValidationFailedError with moveType: "unknown" instead */
export type UnknownMoveError = MoveValidationFailedError;

// ============================================================================
// Permission Error Aliases
// ============================================================================

/** @deprecated Use PermissionDeniedError instead */
export type InvalidPlayerError = PermissionDeniedError;

// ============================================================================
// System Error Aliases
// ============================================================================

/** @deprecated Use SystemFailureError with component: "engine" and operation: "initialization" instead */
export type EngineInitializationError = SystemFailureError;

/** @deprecated Use SystemFailureError with component: "configuration" instead */
export type ConfigurationError = SystemFailureError;

/** @deprecated Use SystemFailureError with component: "network" instead */
export type NetworkError = SystemFailureError;

// ============================================================================
// Flow Error Aliases
// ============================================================================

/** @deprecated Use FlowFailedError with operation: "transition" instead */
export type FlowTransitionError = FlowFailedError;

/** @deprecated Use FlowFailedError with operation: "event" instead */
export type FlowEventError = FlowFailedError;

/** @deprecated Use FlowFailedError with operation: "processing" instead */
export type FlowProcessingError = FlowFailedError;

// ============================================================================
// Serialization Error Aliases
// ============================================================================

/** @deprecated Use SerializationFailedError instead */
export type SerializationError = SerializationFailedError;
