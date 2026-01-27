/**
 * @tcg/gundam - Gundam Card Game Engine
 *
 * A complete implementation of the Bandai Gundam Card Game using the @tcg/core framework.
 * This package serves as both a production-ready game engine and a reference implementation
 * for building TCG engines with @tcg/core.
 *
 * - NO defineMove(), defineZone(), definePhase(), defineCard() helpers
 * - Use GameDefinition<TState, TMoves> type directly
 * - Zones are simple state arrays: Record<PlayerId, CardId[]>
 * - Cards are plain objects in lookup tables
 * - Moves use GameMoveDefinitions with condition and reducer
 * - Flow is optional - use FlowDefinition or simple state tracking
 */

// Re-export core framework types for convenience
export type {
  GameDefinition,
  MoveContext,
  MoveExecutionResult,
  RuleEngine,
  RuleEngineOptions,
} from "@tcg/core";

// Engine exports
export { GundamEngine } from "./engine/gundam-engine";

// Targeting DSL
export * from "./targeting";

// Type exports
export * from "./types";

// Move enumeration type exports
export type {
  AvailableMoveInfo,
  MoveParameterOptions,
  MoveParamSchema,
  MoveValidationError,
  ParameterInfo,
  ParamFieldSchema,
} from "./types/move-enumaration";
