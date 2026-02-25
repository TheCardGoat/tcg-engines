// ============================================================================
// Branded Types (re-export from @tcg/core)
// ============================================================================

export type { CardId, GameId, PlayerId, ZoneId } from "./branded-types";
export {
  createCardId,
  createGameId,
  createPlayerId,
  createZoneId,
} from "./branded-types";

// ============================================================================
// Game State Types (IState pattern)
// ============================================================================

export type {
  GundamCardMeta,
  GundamExternalState,
  GundamGameState,
  GundamPhase,
} from "./game-state";
export {
  createDefaultCardMeta,
  createInitialGundamState,
} from "./game-state";

// ============================================================================
// Move Enumeration Types
// ============================================================================

export type {
  AvailableMoveInfo,
  MoveParameterOptions,
  MoveParamSchema,
  MoveValidationError,
  ParameterInfo,
  ParamFieldSchema,
} from "./move-enumeration";

// ============================================================================
// Effect System Types
// ============================================================================

/**
 * Effect type system for the Gundam Card Game.
 *
 * Provides a comprehensive, serializable type system for defining and
 * managing card effects using discriminated unions for type safety.
 *
 * Key exports:
 * - EffectDefinition: Schema-level effect definitions on cards
 * - EffectInstance: Runtime effect state on the stack
 * - EffectStackState: Manages the effect resolution stack
 * - EffectAction: Union of all possible effect actions
 * - EffectTiming: Union of all effect timing types
 * - EffectCategory: Classification of effect types
 * - TargetingSpec: Target selection system
 * - Card Definition Extensions: CommandCardDefinition, UnitCardDefinition, etc.
 *
 * See @tcg/gundam-types/effects for comprehensive JSDoc documentation.
 */
