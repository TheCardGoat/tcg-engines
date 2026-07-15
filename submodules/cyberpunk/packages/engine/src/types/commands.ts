import type { Patch } from "mutative";
import type {
  CommandEnvelope as UnifiedCommandEnvelope,
  CommandSuccess as UnifiedCommandSuccess,
  CommandFailure as UnifiedCommandFailure,
  CommandResult as UnifiedCommandResult,
} from "@tcg/engine-core";
import type { PlayerId } from "./branded.ts";
import type { MatchState } from "./match-state.ts";
import type { GameEvent } from "./game-events.ts";
import type { MoveLog } from "../logging/move-log.ts";
import type { AnimationScript } from "../animation/types.ts";

/**
 * Re-exports of engine-core command primitives for cross-engine consumers.
 * Cyberpunk's own command types below do not map 1:1 (different envelope shape,
 * additional fields like `inversePatches` and `animationScript`), so the
 * unified versions are provided as aliases.
 */
export type {
  UnifiedCommandEnvelope,
  UnifiedCommandSuccess,
  UnifiedCommandFailure,
  UnifiedCommandResult,
};

export interface CommandEnvelope {
  commandID: string;
  move: string;
  input?: MoveInput;
  timestamp?: number;
}

export interface MoveInput<TArgs = unknown> {
  args: TArgs;
}

export interface CommandSuccess {
  success: true;
  stateID: number;
  state: MatchState;
  patches: Patch[];
  inversePatches: Patch[];
  gameEvents: GameEvent[];
  /**
   * Player-facing logs produced by this command.
   *
   * Contract: one primary player-attributed log for the dispatched move, plus
   * selected follow-up action logs and zero or more system logs (turnStarted,
   * turnEnded, gameEnded) emitted by the same execution. Private fields are
   * still embedded — viewers must run them through {@link stripPrivateFields}
   * before rendering.
   */
  moveLogs: MoveLog[];
  /**
   * Pre-computed animation timeline for this command's gameEvents. Pure
   * derivation of `gameEvents` — deterministic, JSON-safe, replay-friendly.
   * UI clients consume this directly; no client-side diffing required.
   */
  animationScript: AnimationScript;
  processedCommand: CommandEnvelope;
  undoable: boolean;
}

export interface CommandFailure {
  success: false;
  error: string;
  errorCode: string;
  currentStateID: number;
}

export type CommandResult = CommandSuccess | CommandFailure;

export interface MoveValidationResult {
  valid: boolean;
  error?: string;
  errorCode?: string;
}

export interface MoveDefinition<TInput extends MoveInput = MoveInput> {
  available?: (context: MoveEnumerationContext) => boolean;
  validate?: (context: MoveValidationContext<TInput>) => MoveValidationResult;
  execute: (context: MoveExecutionContext<TInput>) => void;
  undoable?: boolean;
  /**
   * Set to `true` on moves that are explicitly designed to resolve or bypass a
   * pending choice (e.g. resolveCardToPlay, concede). All other moves are
   * rejected at the processor level when a pendingChoice is set, so they cannot
   * accidentally interleave with an in-progress player decision.
   */
  handlesPendingChoice?: true;
}

export interface MoveEnumerationContext {
  readonly state: MatchState;
  readonly playerId: PlayerId;
}

export interface MoveValidationContext<TInput extends MoveInput = MoveInput> {
  readonly state: MatchState;
  readonly playerId: PlayerId;
  readonly input: TInput;
}

export interface MoveExecutionContext<TInput extends MoveInput = MoveInput> {
  readonly state: MatchState;
  readonly playerId: PlayerId;
  readonly input: TInput;
  readonly operations: import("../operations/index.ts").Operations;
}
