/**
 * Lorcana Type Definitions
 *
 * Public exports for all Lorcana-specific types
 */

// Branded types (primary source for type-safe IDs)
export * from "./branded-types";

// Card types and classifications
export * from "./card-types";
export * from "./classifications";
export * from "./deck-validation";

// Game state - exclude PlayerId/CardId/ZoneId (use branded-types)
export type {
  ActiveEffect,
  BagEntry,
  CardReadyState,
  LorcanaCardMeta,
  LorcanaExternalState,
  LorcanaGameState,
  StackPosition,
} from "./game-state";

export {
  createDefaultCardMeta,
  createInitialLorcanaState,
} from "./game-state";

// Spec 1: Foundation & Types
export * from "./ink-types";
export * from "./keywords";

// Lorcana state - CharacterState from here takes precedence
export * from "./lorcana-state";

// Move params - exclude LorcanaGameState to avoid conflict with game-state.ts
export type {
  LorcanaMoveParams,
  PlayCardCost,
} from "./move-params";
