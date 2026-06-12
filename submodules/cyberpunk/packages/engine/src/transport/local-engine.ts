import type { Patch } from "mutative";
import type { MatchState } from "../types/match-state.ts";
import type { PlayerId } from "../types/branded.ts";
import type { CommandEnvelope, CommandResult } from "../types/commands.ts";
import type { GameEvent } from "../types/game-events.ts";
import type { FilteredMatchView } from "../view/filter.ts";
import { processCommand, registerMoves } from "../command/index.ts";
import { allMoves } from "../moves/index.ts";
import { filterMatchView } from "../view/filter.ts";
import { buildPlayerPrompt, type PlayerPrompt } from "../view/player-prompt.ts";
import { getEffectiveActivePlayerId } from "../state/turn-info.ts";

interface UndoEntry {
  state: MatchState;
  inversePatches: Patch[];
}

interface TurnStartCheckpoint {
  state: MatchState;
  activePlayerId: PlayerId;
  turnNumber: number;
  stackDepth: number;
  signature: string;
}

export class LocalEngine {
  private _state: MatchState;
  private undoStack: UndoEntry[] = [];
  private turnStartCheckpoint: TurnStartCheckpoint | null = null;

  constructor(initialState: MatchState) {
    this._state = initialState;
    registerMoves(allMoves);
    this.turnStartCheckpoint = checkpointForState(initialState, 0);
  }

  get state(): MatchState {
    return this._state;
  }

  getState(): MatchState {
    return this._state;
  }

  /**
   * "Who has priority right now?" — same semantics as
   * {@link getEffectiveActivePlayerId}. Server-side bot drivers and
   * priority-aware UIs should prefer this over reading
   * `state.G.turnMetadata.activePlayerId` directly so the SETUP-phase
   * parallel-decision window resolves to the still-undecided player.
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
      const reviewedHiddenInformation = reviewsHiddenInformation(result.gameEvents);

      if (reviewedHiddenInformation) {
        this.undoStack = [];
        this.turnStartCheckpoint = nextCheckpoint
          ? { ...nextCheckpoint, stackDepth: this.undoStack.length }
          : null;
      } else if (nextCheckpoint) {
        this.turnStartCheckpoint = { ...nextCheckpoint, stackDepth: this.undoStack.length };
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

function reviewsHiddenInformation(events: ReadonlyArray<GameEvent>): boolean {
  return events.some((event) => {
    switch (event.type) {
      case "cardsDrawn":
      case "cardsRevealed":
      case "legendFlipped":
      case "legendCalled":
      case "deckShuffled":
        return true;
      case "actionLog":
        return event.messageKey === "move.searchDeck.reveal";
      default:
        return false;
    }
  });
}
