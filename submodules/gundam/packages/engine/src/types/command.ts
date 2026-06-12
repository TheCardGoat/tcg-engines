import type { MatchState } from "./match-state.ts";
import type { GameLogEntry, PublishedGameEvent } from "./game-events.ts";
import type { PacketAnimation } from "./animation.ts";
import type { MoveValidationErrorEnvelope } from "./move-types.ts";
import type { GundamMoveLog } from "./move-log.ts";

export type { CommandEnvelope } from "@tcg/engine-core";

export type ActorRole = "player" | "spectator" | "judge";

export interface CommandSuccess {
  success: true;
  stateID: number;
  state: MatchState;
  patches: unknown[]; // mutative Patch[]
  gameEvents: PublishedGameEvent[];
  logEntries: GameLogEntry[];
  processedCommand: import("@tcg/engine-core").CommandEnvelope;
  animations: PacketAnimation[];
  undoable: boolean;
  moveLogs?: GundamMoveLog[];
}

/**
 * Known error codes returned by the engine's validation and execution paths.
 * UI clients should treat this as an open string (legacy callers may still
 * observe codes not listed here) but may use the union for exhaustive
 * switch/handling of the common cases. Kept in sync with the codebase via
 * `command-error-code.test.ts`.
 */
export type CommandErrorCode =
  | "ABILITY_LIMIT_REACHED"
  | "BASE_LIMIT_REACHED"
  | "BLOCKER_IS_TARGET"
  | "CANNOT_ATTACK"
  | "CANNOT_TARGET_PLAYER"
  | "CANNOT_BLOCK"
  | "CANNOT_BLOCK_DIRECT"
  | "CANNOT_BLOCK_HIGH_MANEUVER"
  | "CANNOT_BLOCK_OWN_ATTACK"
  | "CARD_EXHAUSTED"
  | "COST_NOT_PAYABLE"
  | "STALE_STATE"
  | "CARD_NOT_IN_HAND"
  | "COMBAT_PENDING"
  | "DUPLICATE_TARGETS"
  | "EFFECT_PENDING"
  | "EMPTY_HAND"
  | "EXECUTION_ERROR"
  | "GAME_ENDED"
  | "ILLEGAL_TARGET"
  | "INSUFFICIENT_RESOURCES"
  | "INSUFFICIENT_RESOURCE_LEVEL"
  | "INVALID_ATTACKER"
  | "INVALID_ARGS"
  | "INVALID_BLOCKER"
  | "INVALID_CHOOSE_ONE_INDEX"
  | "INVALID_CHOOSE_ONE_OPTION"
  | "INVALID_DECK_LOOK_CARD_IDS"
  | "INVALID_DECK_LOOK_INDEX"
  | "INVALID_DECK_LOOK_ROUTING"
  | "INVALID_DECK_LOOK_TUTOR"
  | "INVALID_EFFECT"
  | "INVALID_EFFECT_TIMING"
  | "INVALID_FLOW_POSITION"
  | "INVALID_PLAYER"
  | "INVALID_TARGET"
  | "IN_BATTLE"
  | "INCOMPLETE_DECK_LOOK_ROUTING"
  | "MISSING_BLOCKER_KEYWORD"
  | "MISSING_ARGS"
  | "MISSING_CHOOSE_ONE_ANSWER"
  | "MISSING_DECK_LOOK_ANSWER"
  | "MISSING_DECK_LOOK_OPTIONAL_ACCEPT"
  | "MISSING_TARGETS"
  | "MULLIGAN_ALREADY_DONE"
  | "NOT_ACTIVE_PLAYER"
  | "NOT_A_BASE"
  | "NOT_A_COMMAND"
  | "NOT_A_PILOT"
  | "NOT_A_UNIT"
  | "NOT_EFFECT_CONTROLLER"
  | "NOT_PENDING"
  | "NOT_PRIORITY_TIER"
  | "NOT_STANDBY_PLAYER"
  | "NO_DISCARD_NEEDED"
  | "NO_LEGAL_TARGETS"
  | "NO_PENDING_ATTACK"
  | "NO_PILOT_KEYWORD"
  | "NO_PENDING_COMBAT"
  | "NO_ACTIVATED_ABILITY"
  | "NO_PENDING_EFFECT"
  | "NO_SUPPORT_KEYWORD"
  | "OPPONENT_DROP_REQUIRED"
  | "OPPONENT_NOT_DROPPABLE"
  | "OPPONENT_NOT_TIMED_OUT"
  | "PENDING_COMBAT"
  | "PENDING_EFFECT_NOT_FOUND"
  | "PILOT_ALREADY_ASSIGNED"
  | "PRECONDITION_FAILED"
  | "TARGETS_ALREADY_COMMITTED"
  | "UNEXPECTED_TARGETS"
  | "UNIT_ALREADY_HAS_PILOT"
  | "UNIT_CANNOT_PAIR_PILOT"
  | "UNIT_NOT_ON_BATTLEFIELD"
  | "UNKNOWN_CARD"
  | "UNKNOWN_MOVE"
  | "VALIDATION_ERROR"
  | "WRONG_DISCARD_COUNT"
  | "WRONG_PHASE"
  | "NOT_LINKED"
  | "NOT_PAIRED"
  | "CONDITIONS_NOT_MET"
  | "WRONG_STEP"
  | "WRONG_TARGET_COUNT"
  | "WRONG_TIMING";

export interface CommandFailure {
  success: false;
  error: string;
  errorCode: CommandErrorCode | (string & {});
  currentStateID: number;
  /** i18n envelope — present when the rejection came from a validator
   *  that routed through the typed log-message catalog
   *  (`rejectWithKey`). Consumers that want to re-render per locale can
   *  use this; consumers that just want a string read `error`. */
  envelope?: MoveValidationErrorEnvelope;
}

export type CommandResult = CommandSuccess | CommandFailure;
