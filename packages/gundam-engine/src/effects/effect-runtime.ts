/**
 * Gundam Effect Runtime Types
 *
 * Runtime types used by the Gundam engine during effect execution.
 * These are implementation-specific types that don't belong in the
 * shared type package (gundam-types).
 *
 * This module contains:
 * - Execution context types
 * - Result types
 * - Runtime state types
 * - Engine-specific enums and flags
 */

import type { CardId, PlayerId, ZoneId } from "@tcg/core";
import type { Effect, EffectAction } from "@tcg/gundam-types/effects";

// ============================================================================
// EXECUTION CONTEXT
// ============================================================================

/**
 * Effect Execution Context
 *
 * Provides the necessary context for executing an effect.
 * Created by the engine when an effect needs to be resolved.
 */
export interface EffectContext {
  /** Current game state (immutable snapshot) */
  readonly state: unknown;

  /** Player executing this effect */
  readonly playerId: PlayerId;

  /** Card that generated this effect */
  readonly sourceCardId: CardId;

  /** Current zone of the source card */
  readonly sourceZone: ZoneId;

  /** Effect being executed */
  readonly effect: Effect;

  /** Current action index being resolved */
  readonly actionIndex: number;

  /** Targets selected for this effect */
  readonly targets?: CardId[];

  /** Optional user input for choices */
  readonly userChoices?: Record<string, unknown>;

  /** Metadata for tracking */
  readonly metadata?: EffectMetadata;
}

/**
 * Effect Metadata
 *
 * Additional tracking information for effect execution.
 */
export interface EffectMetadata {
  /** Timestamp when effect was created */
  readonly createdAt: number;

  /** Timestamp when execution started */
  readonly startedAt?: number;

  /** Number of retries (for fizzled effects) */
  readonly retryCount?: number;

  /** Debug information */
  readonly debug?: {
    readonly stack?: string;
    readonly trigger?: string;
  };
}

// ============================================================================
// EXECUTION RESULT
// ============================================================================

/**
 * Effect Execution Result
 *
 * Result of executing an effect or action.
 * Uses discriminated union for type-safe result handling.
 */
export type EffectResult = SuccessResult | PendingResult | FailedResult | FizzledResult;

/**
 * Successful execution
 */
export interface SuccessResult {
  readonly success: true;
  readonly newState: unknown;
  readonly events: GameEvent[];
  readonly modifications?: TemporaryModification[];
}

/**
 * Pending execution (waiting for user input)
 */
export interface PendingResult {
  readonly success: false;
  readonly pending: true;
  readonly choice: PendingChoice;
}

/**
 * Failed execution
 */
export interface FailedResult {
  readonly success: false;
  readonly pending: false;
  readonly error: ExecutionError;
}

/**
 * Fizzled execution (effect had no valid targets)
 */
export interface FizzledResult {
  readonly success: false;
  readonly pending: false;
  readonly fizzled: true;
}

// ============================================================================
// PENDING CHOICES
// ============================================================================

/**
 * Pending Choice
 *
 * Represents a choice that needs user input before execution can continue.
 */
export interface PendingChoice {
  readonly type: "target" | "option" | "amount";
  readonly prompt: string;
  readonly playerId: PlayerId;
  readonly options: ChoiceOption[];
  readonly minChoices: number;
  readonly maxChoices: number;
  readonly context: unknown;
}

/**
 * Choice Option
 *
 * A single option in a pending choice.
 */
export interface ChoiceOption {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly preview?: unknown;
}

// ============================================================================
// EXECUTION ERRORS
// ============================================================================

/**
 * Execution Error
 *
 * Error that occurred during effect execution.
 */
export interface ExecutionError {
  readonly code: ErrorCode;
  readonly message: string;
  readonly action?: EffectAction;
  readonly context?: Record<string, unknown>;
}

/**
 * Error codes for effect execution failures
 */
export type ErrorCode =
  | "INVALID_TARGET"
  | "NO_VALID_TARGETS"
  | "INSUFFICIENT_RESOURCES"
  | "ZONE_NOT_FOUND"
  | "CARD_NOT_FOUND"
  | "ACTION_FAILED"
  | "STACK_EMPTY"
  | "INVALID_STATE";

// ============================================================================
// GAME EVENTS
// ============================================================================

/**
 * Game Event
 *
 * Events generated during effect execution that can be observed.
 */
export type GameEvent =
  | CardDrawnEvent
  | CardDamagedEvent
  | CardDestroyedEvent
  | CardMovedEvent
  | StatModifiedEvent
  | KeywordGrantedEvent
  | EffectTriggeredEvent;

/**
 * Base event properties
 */
interface BaseEvent {
  readonly type: string;
  readonly playerId: PlayerId;
  readonly timestamp: number;
}

/**
 * Card drawn event
 */
export interface CardDrawnEvent extends BaseEvent {
  readonly type: "CARD_DRAWN";
  readonly cardId: CardId;
  readonly count: number;
  readonly from: ZoneId;
  readonly to: ZoneId;
}

/**
 * Card damaged event
 */
export interface CardDamagedEvent extends BaseEvent {
  readonly type: "CARD_DAMAGED";
  readonly cardId: CardId;
  readonly amount: number;
  readonly damageType: "battle" | "effect";
}

/**
 * Card destroyed event
 */
export interface CardDestroyedEvent extends BaseEvent {
  readonly type: "CARD_DESTROYED";
  readonly cardId: CardId;
  readonly zone: ZoneId;
}

/**
 * Card moved event
 */
export interface CardMovedEvent extends BaseEvent {
  readonly type: "CARD_MOVED";
  readonly cardId: CardId;
  readonly from: ZoneId;
  readonly to: ZoneId;
}

/**
 * Stat modified event
 */
export interface StatModifiedEvent extends BaseEvent {
  readonly type: "STAT_MODIFIED";
  readonly cardId: CardId;
  readonly stat: "ap" | "hp";
  readonly modifier: number;
  readonly duration: ModifierDuration;
}

/**
 * Keyword granted event
 */
export interface KeywordGrantedEvent extends BaseEvent {
  readonly type: "KEYWORD_GRANTED";
  readonly cardId: CardId;
  readonly keyword: string;
  readonly duration: ModifierDuration;
}

/**
 * Effect triggered event
 */
export interface EffectTriggeredEvent extends BaseEvent {
  readonly type: "EFFECT_TRIGGERED";
  readonly effectId: string;
  readonly sourceCardId: CardId;
  readonly trigger: string;
}

// ============================================================================
// TEMPORARY MODIFICATIONS
// ============================================================================

/**
 * Temporary Modification
 *
 * Runtime tracking of temporary stat modifiers and keyword grants.
 * These are applied during execution and tracked until they expire.
 */
export interface TemporaryModification {
  readonly id: string;
  readonly cardId: CardId;
  readonly type: "stat" | "keyword";
  readonly apModifier?: number;
  readonly hpModifier?: number;
  readonly grantedKeywords?: string[];
  readonly duration: ModifierDuration;
  readonly sourceCardId: CardId;
  readonly condition?: string;
}

/**
 * Modifier duration
 */
export type ModifierDuration = "permanent" | "this_turn" | "end_of_combat" | "while_condition";

// ============================================================================
// RESOLVED TARGETS
// ============================================================================

/**
 * Resolved Target
 *
 * A target that has been resolved to a specific card.
 */
export interface ResolvedTarget {
  readonly cardId: CardId;
  readonly playerId: PlayerId;
  readonly zone: ZoneId;
  readonly valid: boolean;
}

// ============================================================================
// EVENT TYPES
// ============================================================================

/**
 * Event Type
 *
 * Types of events that can trigger effects.
 */
export type EventType =
  | "DEPLOY"
  | "ATTACK"
  | "DESTROYED"
  | "START_OF_TURN"
  | "END_OF_TURN"
  | "ACTIVATE_MAIN"
  | "ACTIVATE_ACTION";

// ============================================================================
// HELPER TYPES
// ============================================================================

/**
 * Card definition with runtime effects
 */
export interface CardDefinition {
  readonly id: string;
  readonly name: string;
  readonly effects: Effect[];
  readonly [key: string]: unknown;
}

/**
 * Target resolution result
 */
export type TargetResolutionResult =
  | { readonly success: true; readonly targets: ResolvedTarget[] }
  | { readonly success: false; readonly error: string };

/**
 * Action execution result
 */
export type ActionExecutionResult =
  | {
      readonly success: true;
      readonly state: unknown;
      readonly events: GameEvent[];
    }
  | {
      readonly success: false;
      readonly pending: true;
      readonly choice: PendingChoice;
    }
  | { readonly success: false; readonly error: ExecutionError };

// ============================================================================
// RUNTIME EFFECT TYPES (from original effects.ts)
// ============================================================================

/**
 * Unique identifier for a temporary modifier instance.
 * Allows tracking and removal of specific modifiers.
 */
export type ModifierId = string & { readonly brand: unique symbol };

/**
 * Base properties shared by all temporary modifier types.
 */
interface BaseTemporaryModifier {
  /** Unique identifier for this modifier instance */
  readonly id: ModifierId;

  /** AP modification */
  readonly apModifier?: number;

  /** HP modification */
  readonly hpModifier?: number;

  /** Keywords granted by effects */
  readonly grantedKeywords?: string[];

  /** Source of this modifier (for tracking/cleanup) */
  readonly sourceId: CardId;
}

/**
 * Modifier that expires at the end of the current turn.
 * Corresponds to `this_turn` duration in effect actions.
 */
export interface EndOfTurnModifier extends BaseTemporaryModifier {
  readonly duration: "end_of_turn";
}

/**
 * Modifier that expires at the end of combat.
 * Corresponds to `end_of_combat` duration in effect actions.
 */
export interface EndOfCombatModifier extends BaseTemporaryModifier {
  readonly duration: "end_of_combat";
}

/**
 * Modifier that never expires (persists until card leaves play).
 * Corresponds to `permanent` duration in effect actions.
 */
export interface PermanentModifier extends BaseTemporaryModifier {
  readonly duration: "permanent";
}

/**
 * Modifier that persists while a specific condition is true.
 * Corresponds to `while_condition` duration in effect actions.
 */
export interface WhileConditionModifier extends BaseTemporaryModifier {
  readonly duration: "while_condition";

  /** Condition reference that determines when this modifier expires */
  readonly condition: string;
}

/**
 * Temporary Modifier
 *
 * Discriminated union tracking temporary stat changes and keyword grants on cards.
 * These modifiers expire at specific timing points or when conditions are no longer met.
 *
 * The `duration` field acts as the discriminant, allowing type-safe narrowing:
 * - "end_of_turn": Removed during end phase cleanup
 * - "end_of_combat": Removed after combat resolution
 * - "permanent": Never expires (though card removal clears them)
 * - "while_condition": Expires when the specified condition becomes false
 *
 * Each modifier has a unique `id` for tracking and individual removal.
 */
export type TemporaryModifier =
  | EndOfTurnModifier
  | EndOfCombatModifier
  | PermanentModifier
  | WhileConditionModifier;

/**
 * Effect Instance
 *
 * Runtime state of an effect that has been activated and is on the stack.
 *
 * Created when an effect is triggered/activated and tracked in the
 * effectStack until fully resolved.
 */
export interface EffectInstance {
  /** Unique instance identifier */
  readonly instanceId: string;

  /** Card that generated this effect */
  readonly sourceCardId: CardId;

  /** Player controlling this effect */
  readonly controllerId: PlayerId;

  /** Reference to the effect definition */
  readonly effectRef: {
    readonly effectId: string;
  };

  /** Current action being resolved (index into actions array) */
  readonly currentActionIndex: number;

  /** Selected targets for this effect */
  readonly targets?: CardId[];

  /** Current resolution state */
  readonly state: "pending" | "resolving" | "resolved" | "fizzled";
}

/**
 * Effect Stack State
 *
 * Manages the stack of pending effects waiting to resolve.
 * Effects resolve in FIFO (First-In, First-Out) order.
 *
 * See Official Rules Section 11-3: Effect Resolution.
 */
export interface EffectStackState {
  /** Stack of effect instances */
  readonly stack: EffectInstance[];

  /** Counter for generating unique instance IDs (mutable) */
  nextInstanceId: number;
}
