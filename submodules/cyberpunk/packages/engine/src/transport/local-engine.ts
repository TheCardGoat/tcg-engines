import type { Patch } from "mutative";
import type { MatchState } from "../types/match-state.ts";
import type { PlayerId } from "../types/branded.ts";
import type { CommandEnvelope, CommandResult } from "../types/commands.ts";
import type { FilteredMatchView } from "../view/filter.ts";
import { processCommand, registerMoves } from "../command/index.ts";
import { allMoves, manualMoves } from "../moves/index.ts";
import { filterMatchView } from "../view/filter.ts";
import { buildPlayerPrompt, type PlayerPrompt } from "../view/player-prompt.ts";
import { getEffectiveActivePlayerId } from "../state/turn-info.ts";

export interface LocalEngineUndoEntry {
  state: MatchState;
  inversePatches: Patch[];
}

export interface TurnStartCheckpoint {
  state: MatchState;
  activePlayerId: PlayerId;
  turnNumber: number;
  stackDepth: number;
  signature: string;
}

export interface LocalEngineContinuationSnapshot {
  version: 1;
  undoStack: LocalEngineUndoEntry[];
  turnStartCheckpoint: TurnStartCheckpoint | null;
}

interface LocalEngineConstructionOptions {
  continuation?: LocalEngineContinuationSnapshot;
  /** Fresh games/fixtures begin at a legitimate checkpoint; restored legacy snapshots do not. */
  initializeTurnStartCheckpoint?: boolean;
}

export class LocalEngine {
  private _state: MatchState;
  private undoStack: LocalEngineUndoEntry[] = [];
  private turnStartCheckpoint: TurnStartCheckpoint | null = null;

  constructor(initialState: MatchState, options: LocalEngineConstructionOptions = {}) {
    this._state = initialState;
    registerMoves({ ...allMoves, ...manualMoves });
    if (options.continuation) {
      this.undoStack = structuredClone(options.continuation.undoStack);
      this.turnStartCheckpoint = options.continuation.turnStartCheckpoint
        ? structuredClone(options.continuation.turnStartCheckpoint)
        : null;
    } else if (options.initializeTurnStartCheckpoint !== false) {
      this.turnStartCheckpoint = checkpointForState(initialState, 0);
    }
  }

  get state(): MatchState {
    return this._state;
  }

  getState(): MatchState {
    return this._state;
  }

  /** Engine-private continuation data persisted by the server adapter. */
  getContinuationSnapshot(): LocalEngineContinuationSnapshot {
    return structuredClone({
      version: 1,
      undoStack: this.undoStack,
      turnStartCheckpoint: this.turnStartCheckpoint,
    });
  }

  /**
   * "Who has priority right now?" — same semantics as
   * {@link getEffectiveActivePlayerId}. Server-side bot drivers and
   * priority-aware UIs should prefer this over reading
   * `state.G.turnMetadata.activePlayerId` directly so the SETUP-phase
   * sequential keep/mulligan window resolves to the still-undecided player.
   */
  getEffectiveActivePlayerId(): PlayerId | undefined {
    return getEffectiveActivePlayerId(this._state);
  }

  getFilteredView(playerId: PlayerId): FilteredMatchView {
    return filterMatchView(this._state, playerId);
  }

  /**
   * Returns the engine's player-facing prompt: which moves are available right
   * now, what inputs they take, and any pending choice the engine is waiting
   * on. This is the only "what can I do?" surface AI players (and UIs) should
   * call — it never leaks hidden state.
   */
  getPrompt(playerId: PlayerId): PlayerPrompt {
    return buildPlayerPrompt(this._state, playerId);
  }

  processCommand(command: CommandEnvelope, playerId: PlayerId): CommandResult {
    const previousState = this._state;
    const result = processCommand(this._state, command, playerId);

    if (result.success) {
      if (result.undoable) {
        this.undoStack.push({
          state: this._state,
          inversePatches: result.inversePatches,
        });
      } else {
        this.undoStack = [];
        this.turnStartCheckpoint = null;
      }
      this._state = result.state;

      const nextCheckpoint = detectTurnStartCheckpoint(previousState, result.state);
      if (nextCheckpoint) {
        // Older turns are intentionally not undoable once the new Main Phase
        // begins. Drop that unreachable history so authoritative continuation
        // snapshots only retain the current turn.
        this.undoStack = [];
        this.turnStartCheckpoint = { ...nextCheckpoint, stackDepth: 0 };
      }
    }

    return result;
  }

  canUndo(): boolean {
    const checkpoint = this.currentTurnStartCheckpoint();
    if (checkpoint) {
      return this.undoStack.length > checkpoint.stackDepth;
    }
    return this.undoStack.length > 0;
  }

  undo(): boolean {
    if (!this.canUndo()) return false;
    const entry = this.undoStack.pop();
    if (!entry) return false;
    this._state = entry.state;
    return true;
  }

  canUndoToTurnStart(): boolean {
    const checkpoint = this.currentTurnStartCheckpoint();
    if (!checkpoint) return false;
    return this.undoStack.length > checkpoint.stackDepth;
  }

  undoToTurnStart(): boolean {
    const checkpoint = this.currentTurnStartCheckpoint();
    if (!checkpoint || this.undoStack.length <= checkpoint.stackDepth) return false;
    this._state = checkpoint.state;
    this.undoStack = this.undoStack.slice(0, checkpoint.stackDepth);
    return true;
  }

  /**
   * Whether a board-correction rewind to the start of the current turn is
   * possible. Unlike {@link canUndoToTurnStart} this does not require any
   * undoable move to have happened — restoring an untouched turn is a no-op.
   */
  hasTurnStartCheckpoint(): boolean {
    return this.currentTurnStartCheckpoint() !== null;
  }

  /**
   * Board-correction rewind: restore the in-memory start-of-current-turn
   * checkpoint, discarding everything that happened this turn (including
   * wedged triggers and combat — a rewind supersedes them all).
   *
   * The checkpoint is engine-private and never appears in {@link getState}.
   * Server adapters may persist it separately as continuation metadata so a
   * process restore preserves the same correction boundary.
   */
  restoreToTurnStart():
    | { success: true; restoredTurnNumber: number }
    | { success: false; error: string; errorCode: string } {
    const checkpoint = this.currentTurnStartCheckpoint();
    if (!checkpoint) {
      return {
        success: false,
        error: "No in-memory turn-start checkpoint is available for the current turn",
        errorCode: "NO_TURN_START_CHECKPOINT",
      };
    }
    const restored: MatchState = structuredClone(checkpoint.state);
    restored.ctx.stateID = this._state.ctx.stateID + 1;
    this._state = restored;
    this.undoStack = this.undoStack.slice(0, checkpoint.stackDepth);
    return { success: true, restoredTurnNumber: checkpoint.turnNumber };
  }

  /**
   * Returns a deep-cloned, independent engine at the same point in time.
   * Used by search-style strategies that need to simulate "what if I do X?"
   * without mutating the live game. The clone has its own state and undo
   * stack; mutations on either side don't affect the other.
   *
   * Implementation note: relies on `structuredClone` (Node ≥ 17), which is
   * the right tool for this — the engine state is a plain data tree (no
   * functions, no DOM nodes, no class instances we own).
   */
  fork(): LocalEngine {
    const clone = new LocalEngine(structuredClone(this._state));
    // Copy the undo stack too so a forked engine's undo behaves the same as
    // the original would have. Inverse patches are also plain data.
    clone.undoStack = this.undoStack.map((entry) => ({
      state: structuredClone(entry.state),
      inversePatches: structuredClone(entry.inversePatches),
    }));
    clone.turnStartCheckpoint = this.turnStartCheckpoint
      ? {
          state: structuredClone(this.turnStartCheckpoint.state),
          activePlayerId: this.turnStartCheckpoint.activePlayerId,
          turnNumber: this.turnStartCheckpoint.turnNumber,
          stackDepth: this.turnStartCheckpoint.stackDepth,
          signature: this.turnStartCheckpoint.signature,
        }
      : null;
    return clone;
  }

  private currentTurnStartCheckpoint(): TurnStartCheckpoint | null {
    const checkpoint = this.turnStartCheckpoint;
    if (!checkpoint) return null;
    const currentTurn = this._state.G.turnMetadata;
    if (
      currentTurn.turnNumber !== checkpoint.turnNumber ||
      currentTurn.activePlayerId !== checkpoint.activePlayerId ||
      stateSignature(this._state) !== checkpoint.signature
    ) {
      return null;
    }
    return checkpoint;
  }
}

function checkpointForState(state: MatchState, stackDepth: number): TurnStartCheckpoint | null {
  if (state.G.gamePhase !== "main" && state.G.gamePhase !== "start") return null;
  return {
    state,
    activePlayerId: state.G.turnMetadata.activePlayerId,
    turnNumber: state.G.turnMetadata.turnNumber,
    stackDepth,
    signature: stateSignature(state),
  };
}

function stateSignature(state: MatchState): string {
  return JSON.stringify({
    matchId: state.ctx.matchId,
    playerIds: state.ctx.playerIds,
    playerZones: Object.fromEntries(
      Object.entries(state.G.players).map(([playerId, player]) => [
        playerId,
        Object.keys(player.zones).sort(),
      ]),
    ),
  });
}

function detectTurnStartCheckpoint(
  previousState: MatchState,
  nextState: MatchState,
): TurnStartCheckpoint | null {
  if (nextState.G.gamePhase !== "main" && nextState.G.gamePhase !== "start") return null;

  const previousTurn = previousState.G.turnMetadata;
  const nextTurn = nextState.G.turnMetadata;
  const newTurnStarted =
    previousTurn.turnNumber !== nextTurn.turnNumber ||
    previousTurn.activePlayerId !== nextTurn.activePlayerId;
  const readyPhaseCompleted = previousState.G.gamePhase === "start";
  const setupCompleted = previousState.G.gamePhase === "setup";

  if (!newTurnStarted && !readyPhaseCompleted && !setupCompleted) {
    return null;
  }

  return checkpointForState(nextState, 0);
}
