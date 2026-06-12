/**
 * MatchRuntime Command Processing
 *
 * Command execution logic — pure function, no class dependencies.
 */

import type { Draft, Patch } from "mutative";
import type { GameEvent, MatchState, MoveInput } from "./types";
import type {
  MatchRuntimeConfig,
  GameEndResult,
  RuntimeActorRole,
  CommandFailure,
  ProjectedLogEntry,
  UndoAPI,
  UndoBarrierReason,
} from "./match-runtime.types";
import { resolveFlowTransitionsOnDraft, checkGameEndCondition } from "./match-runtime.flow";
import { resolvePriorityPlayer } from "./match-runtime.priority";
import { validateCommand } from "./match-runtime.validation";
import {
  buildExecutionContext as buildExecutionContextFromUtils,
  buildLifecycleContext as buildLifecycleContextFromUtils,
  createFrameworkStateSnapshot,
} from "./match-runtime.utils";
import { defaultRegistryProvider } from "../../runtime-moves/rules/registry-provider";
import type { MatchStaticResources } from "./static-resources";
import { createRuntimeState, createRuntimeStateWithPatches } from "./mutative";
import { expireReveals } from "./zone-operations";

interface InternalCommandSuccess {
  success: true;
  stateID: number;
  state: MatchState;
  patches: Patch[];
  inversePatches?: Patch[];
  pendingGameEvents: GameEvent[];
  moveLogEntries: ProjectedLogEntry[];
  undoable: boolean;
}

function createUndoCollector(): UndoAPI {
  const reasons: UndoBarrierReason[] = [];

  return {
    markBarrier(reason) {
      reasons.push(reason);
    },
    hasBarrier() {
      return reasons.length > 0;
    },
    getReasons() {
      return reasons.slice();
    },
  };
}

export interface CommandExecutionContext {
  state: MatchState;
  config: MatchRuntimeConfig;
  staticResources: MatchStaticResources;
  actorRole: RuntimeActorRole;
  capturePatches: boolean;
  gameEnded: boolean;
  currentStateID: number;
}

export function executeCommand(
  command: {
    commandID?: string;
    move: string;
    input?: MoveInput;
    redactInput?: boolean;
  },
  playerId: string,
  prevStateID: number,
  timestamp: number,
  ctx: CommandExecutionContext,
): {
  result: InternalCommandSuccess | CommandFailure;
  newState: MatchState;
  gameEnded: boolean;
  gameEndResult?: GameEndResult;
} {
  const commandInput = command.input;
  if (!commandInput) {
    return {
      result: {
        success: false,
        error: "Move input was not provided",
        errorCode: "MISSING_INPUT",
        currentStateID: ctx.currentStateID,
      },
      newState: ctx.state,
      gameEnded: ctx.gameEnded,
    };
  }

  // Validate command first
  const validation = validateCommand({ ...command, input: commandInput }, playerId, prevStateID, {
    state: ctx.state,
    config: ctx.config,
    staticResources: ctx.staticResources,
    actorRole: ctx.actorRole,
    gameEnded: ctx.gameEnded,
    currentStateID: ctx.currentStateID,
  });

  if (!validation.valid) {
    return {
      result: {
        success: false,
        error: validation.reason!,
        errorCode: validation.code!,
        currentStateID: ctx.currentStateID,
      },
      newState: ctx.state,
      gameEnded: ctx.gameEnded,
    };
  }

  const moveDef = validation.moveDef!;
  const actingPlayerId = validation.actingPlayerId ?? playerId;

  // Execute move
  let patches: Patch[] = [];
  let inversePatches: Patch[] = [];
  let newState = ctx.state;
  const pendingGameEvents: GameEvent[] = [];
  const moveLogEntries: ProjectedLogEntry[] = [];

  const endGameTracker = { ended: false, result: undefined as GameEndResult | undefined };

  try {
    const undo = createUndoCollector();
    const applyCommandToDraft = (draft: Draft<MatchState>) => {
      const emitGameEvent = (event: GameEvent) => {
        pendingGameEvents.push(event);
      };
      const moveLogSink = (entries: readonly ProjectedLogEntry[]) => {
        moveLogEntries.push(...entries);
      };

      const executionContext = buildExecutionContextFromUtils({
        state: draft,
        playerId: actingPlayerId,
        input: commandInput,
        config: ctx.config,
        staticResources: ctx.staticResources,
        gameEnded: ctx.gameEnded,
        emit: emitGameEvent,
        gameEndTracker: endGameTracker,
        undo,
        moveLogSink,
      });

      // Step 5: Execute the move reducer
      moveDef.execute(executionContext);

      // Step 7: Resolve flow events
      resolveFlowTransitionsOnDraft(
        draft,
        ctx.config.flow,
        (draftState, lifecycleGameEnded, lifecyclePlayerId) =>
          buildLifecycleContextFromUtils({
            state: draftState,
            playerId: lifecyclePlayerId,
            config: ctx.config,
            staticResources: ctx.staticResources,
            gameEnded: lifecycleGameEnded,
            emit: emitGameEvent,
            gameEndTracker: endGameTracker,
            undo,
            moveLogSink,
          }),
      );

      // Step 8: Update clocks for new waiting state
      // Clock follows the decision-maker: pendingChoice.playerID (e.g., opponent
      // choosing targets) takes precedence over priority.holder (priority holder).
      if (draft.ctx.time.mode !== "none") {
        // Capture pre-command active player to detect priority hand-offs for
        // the per-decision cap accumulator.
        const prevTime = ctx.state.ctx.time;
        const prevActivePlayerID = prevTime.mode !== "none" ? prevTime.activePlayerID : undefined;

        const clockTarget = resolvePriorityPlayer(draft.ctx.priority);
        if (clockTarget) {
          draft.ctx.time.activePlayerID = clockTarget;
          draft.ctx.time.startedAtMs = timestamp;
          draft.ctx.time.running = true;
          draft.ctx.time.pausedReason = undefined;
        } else {
          // No decision-maker identified — still update startedAtMs
          // so client interpolation stays consistent with settled reserve.
          draft.ctx.time.startedAtMs = timestamp;
        }

        // Per-decision cap: reset the accumulator whenever the priority holder
        // changes (e.g. turn pass, opponent pending-choice hand-off, etc.).
        // settleClocks has already charged the outgoing player's elapsed time
        // pre-command, so we can safely zero it here.
        //
        // Also clear negative-time state for the outgoing player. If they held
        // priority while in negative time (e.g. they passed their turn naturally
        // while their reserve was exhausted), treat it as a natural timeout:
        // increment their timeoutCount, restore resetTimeOnSkipMs, and clear
        // the flag — so the opponent cannot immediately skip them on their very
        // next turn for the same overage.
        if (draft.ctx.time.mode === "chess" || draft.ctx.time.mode === "dynamic") {
          if (draft.ctx.time.activePlayerID !== prevActivePlayerID) {
            draft.ctx.time.activePlayerAccumulatedMs = 0;

            if (prevActivePlayerID) {
              const outgoingState = draft.ctx.time.players[prevActivePlayerID];
              if (outgoingState?.isInNegativeTime) {
                outgoingState.isInNegativeTime = false;
                outgoingState.timeoutCount++;
                outgoingState.reserveMsRemaining = draft.ctx.time.config.resetTimeOnSkipMs;
              }
            }
          }
        }

        // Dynamic clock bonuses
        if (draft.ctx.time.mode === "dynamic") {
          const actorState = draft.ctx.time.players[actingPlayerId];
          if (actorState) {
            const cap = draft.ctx.time.config.reserveCapMs;

            // Award per-action bonus for every action
            const actionBonusMs = draft.ctx.time.config.perActionBonusMs;
            actorState.actionBonusMsGranted += actionBonusMs;
            actorState.reserveMsRemaining = Math.min(
              cap,
              actorState.reserveMsRemaining + actionBonusMs,
            );

            // Award turn-pass bonus specifically for passTurn
            if (command.move === "passTurn") {
              const turnBonusMs = draft.ctx.time.config.perTurnPassBonusMs;
              actorState.turnPassBonusMsGranted += turnBonusMs;
              actorState.reserveMsRemaining = Math.min(
                cap,
                actorState.reserveMsRemaining + turnBonusMs,
              );
            }
          }
        }
      }

      // Step 9: Increment _stateID
      draft.ctx._stateID++;
      expireReveals(draft);

      // Warm the move-registry cache for the post-increment state. The next
      // consumer (validation of the next move, query API call, projection)
      // hits a hot cache instead of paying the build cost as a latency surprise.
      // Construct a fresh framework snapshot so the warm-up keys on the new
      // `stateID` / `staticEffectsVersion`; the executionContext above captured
      // these pre-increment.
      defaultRegistryProvider.warmFor({
        framework: { state: createFrameworkStateSnapshot(draft, endGameTracker.ended) },
        G: draft.G,
        cards: executionContext.cards,
      });

      // Check end game condition
      const endResult = checkGameEndCondition(draft, ctx.config.flow);
      if (endResult) {
        endGameTracker.ended = true;
        endGameTracker.result = endResult;
        draft.ctx.status.gameEnded = true;
        draft.ctx.status.winner = endResult.winner;
        draft.ctx.status.reason = endResult.reason;

        if (draft.ctx.time.mode !== "none") {
          draft.ctx.time.running = false;
          draft.ctx.time.pausedReason = "GAME_ENDED";
        }
      }
    };

    if (ctx.capturePatches) {
      const [nextState, capturedPatches, capturedInversePatches] = createRuntimeStateWithPatches(
        ctx.state,
        (draft) => {
          applyCommandToDraft(draft);
        },
      );
      newState = nextState;
      patches = capturedPatches;
      inversePatches = capturedInversePatches;
    } else {
      newState = createRuntimeState(ctx.state, (draft) => {
        applyCommandToDraft(draft);
      });
    }

    pendingGameEvents.unshift({
      kind: "MOVE_EXECUTED",
      commandId: command.commandID ?? `cmd-${timestamp}`,
      move: command.move,
      playerId: actingPlayerId,
      inputRedacted: Boolean(command.redactInput),
      input: command.redactInput ? "[REDACTED]" : commandInput,
    });

    if (endGameTracker.ended && endGameTracker.result) {
      pendingGameEvents.push({
        kind: "GAME_ENDED",
        winner: endGameTracker.result.winner,
        reason: endGameTracker.result.reason,
      });
    }

    return {
      result: {
        success: true,
        stateID: newState.ctx._stateID,
        state: newState,
        patches,
        inversePatches,
        pendingGameEvents,
        moveLogEntries,
        undoable: !undo.hasBarrier(),
      },
      newState,
      gameEnded: endGameTracker.ended,
      gameEndResult: endGameTracker.result,
    };
  } catch (error) {
    return {
      result: {
        success: false,
        error: error instanceof Error ? error.message : "Move execution failed",
        errorCode: "EXECUTION_ERROR",
        currentStateID: ctx.currentStateID,
      },
      newState: ctx.state,
      gameEnded: ctx.gameEnded,
    };
  }
}
