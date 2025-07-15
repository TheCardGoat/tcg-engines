/**
 * Core engine error types and utilities
 */

// Export consolidated errors (preferred)
export * from "./consolidated-errors";
export {
  CardEnrichmentError,
  CardError,
  CardNotFoundError,
  ContextUpdateError,
  ContextValidationError,
  InvalidCardStateError,
  ModifierNotFoundError,
  SerializationError,
  ZoneMoveValidationError,
  ZoneNotFoundError,
} from "./domain-errors";
// Export type unions
export type { AllEngineErrors } from "./engine-errors";
// Re-export specific types from legacy error files
// These are kept for backward compatibility
export {
  ConfigurationError,
  EngineError,
  EngineInitializationError,
  FlowEventError,
  FlowProcessingError,
  FlowTransitionError,
  InvalidPlayerError,
  MoveValidationError,
  NetworkError,
  PlayerValidationError,
  StateTransitionError,
  StateUpdateError,
  StateValidationError,
  UnknownMoveError,
} from "./engine-errors";
// Export backward compatibility aliases
// These are type aliases only and don't cause conflicts
export * from "./error-compatibility";
// Export error templates
export * from "./error-templates";
