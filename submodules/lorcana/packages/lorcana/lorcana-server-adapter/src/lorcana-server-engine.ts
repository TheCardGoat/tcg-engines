import {
  createAcceptedMoveRecord,
  createEngineLogRecord,
  checkTimeout,
  DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
  getSafeAutomatedActionStrategyOption,
  LorcanaServer,
  resetPlayerTimeAfterSkip,
  settleClocks,
  type ChessClockContext,
  type CommandEnvelope,
  type DynamicClockContext,
  type MatchState,
  type MoveLog,
  type PlayerId,
} from "@tcg/lorcana-engine";
import { evaluateReserveTimeoutDrop } from "@tcg/protocol";
import type {
  AcceptedMoveRecord,
  BotActionOptions,
  BotActionResult,
  DispatchContext,
  DispatchResult,
  EvaluateOpponentTimeoutInput,
  EngineLogRecord,
  OpponentTimeoutEvaluation,
  OpponentTimeoutSkipEvaluation,
  PacketAnimation,
  ServerGameEngine,
  SkipClockResetOptions,
  TurnSkippedLogInput,
} from "@tcg/shared/game-engine";

/**
 * Wraps a {@link LorcanaServer} into the game-agnostic
 * {@link ServerGameEngine} contract used by the play module.
 */
export class LorcanaServerEngine implements ServerGameEngine {
  constructor(public readonly engine: LorcanaServer) {}

  dispatch(
    moveType: string,
    actorId: string,
    payload: Record<string, unknown>,
    context: DispatchContext,
  ): DispatchResult {
    const moveHistoryStartIndex = this.engine.getMoveHistory().length;
    const moveLogStartIndex = this.engine.getMoveLogHistory().length;
    const result = this.engine.dispatch(moveType, actorId, payload);
    // Thread the dispatching actorId so the accepted-move record carries it
    // even when the underlying move-history entry doesn't expose `actor`.
    return this.#toDispatchResult(result, context, {
      actorId,
      moveHistoryStartIndex,
      moveLogStartIndex,
    });
  }

  getStateID(): number {
    return this.engine.getStateID();
  }

  getState(): unknown {
    return this.engine.getState();
  }

  getViewerState(
    viewer: { role: "player"; actorId: string } | { role: "spectator" } | { role: "replay" },
  ): unknown {
    return this.engine
      .getRuntime()
      .getFilteredView(
        viewer.role === "player"
          ? { role: "player", playerID: viewer.actorId }
          : { role: "spectator" },
      );
  }

  getViewerResources(
    _viewer: { role: "player"; actorId: string } | { role: "spectator" } | { role: "replay" },
  ): unknown {
    // Card identity and ownership are intentionally public, immutable match
    // metadata. Hidden information is enforced exclusively by getViewerState's
    // board projection, so resources never need per-viewer or per-move updates.
    return { cardsMaps: this.engine.getCardsMaps() };
  }

  getActivePlayerId(): string | undefined {
    const state = this.engine.getState() as unknown as {
      ctx?: { time?: { mode?: string; activePlayerID?: string } };
    };
    const time = state?.ctx?.time;
    if (!time || time.mode === "none") return undefined;
    return time.activePlayerID;
  }

  hasGameEnded(): boolean {
    return this.engine.hasGameEnded();
  }

  getGameEndResult(): { winnerId?: string; reason?: string } | undefined {
    if (!this.engine.hasGameEnded()) return undefined;
    const winnerId = this.engine.getGameEndResult();
    const board = this.engine.getBoard() as { reason?: string | null };
    return {
      winnerId: winnerId || undefined,
      reason: board.reason ?? undefined,
    };
  }

  forfeit(winnerId: string, reason: string, context: DispatchContext): DispatchResult {
    const moveHistoryStartIndex = this.engine.getMoveHistory().length;
    const moveLogStartIndex = this.engine.getMoveLogHistory().length;
    const result = this.engine.forfeitGame(winnerId as PlayerId, reason);
    return this.#toDispatchResult(result, context, {
      actorId: winnerId,
      moveHistoryStartIndex,
      moveLogStartIndex,
    });
  }

  takeAutomatedAction(options: BotActionOptions, context: DispatchContext): BotActionResult {
    const strategyOption = getSafeAutomatedActionStrategyOption(
      options.strategyId ?? DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
    );
    const moveHistoryStartIndex = this.engine.getMoveHistory().length;
    const moveLogStartIndex = this.engine.getMoveLogHistory().length;
    const botResult = this.engine.takeAutomatedActionForCurrentActor({
      strategy: strategyOption.strategy,
    });
    const finalResult = this.#toDispatchResult(botResult.finalResult, context, {
      actorId: botResult.actorId,
      moveHistoryStartIndex,
      moveLogStartIndex,
    });
    const result: BotActionResult = { finalResult };
    if (botResult.blocked) result.blocked = { reason: botResult.blocked.reason };
    if (botResult.selectedCandidate?.family) {
      result.selectedCandidate = { family: botResult.selectedCandidate.family };
    }
    if (botResult.fallbackTaken) result.fallbackTaken = botResult.fallbackTaken;
    return result;
  }

  evaluateOpponentTimeout(input: EvaluateOpponentTimeoutInput): OpponentTimeoutEvaluation {
    const state = this.engine.getState() as MatchState;
    if (state.ctx.time.mode !== "chess" && state.ctx.time.mode !== "dynamic") {
      return {
        skip: { allowed: false, reason: "no_time_control" },
        drop: { allowed: false, reason: "no_time_control", facts: { mode: state.ctx.time.mode } },
      };
    }
    const settled = settleClocks(state, input.nowMs);
    const time = settled.ctx.time as ChessClockContext | DynamicClockContext;
    const opponent = time.players[input.opponentPlayerId];
    if (!opponent) {
      return {
        skip: { allowed: false, reason: "within_limit" },
        drop: { allowed: false, reason: "clock_unavailable", facts: { mode: time.mode } },
      };
    }

    const isActive = time.running === true && time.activePlayerID === input.opponentPlayerId;
    const elapsedMs =
      isActive && typeof time.startedAtMs === "number"
        ? Math.max(0, input.nowMs - time.startedAtMs)
        : 0;
    const maxDecisionTimeMs = time.config.maxDecisionTimeMs;
    const activeDecisionMs = (time.activePlayerAccumulatedMs ?? 0) + elapsedMs;
    const decisionCapExceeded =
      isActive && typeof maxDecisionTimeMs === "number" && activeDecisionMs > maxDecisionTimeMs;
    const drop = evaluateReserveTimeoutDrop({
      nowMs: input.nowMs,
      mode: time.mode,
      graceMs: time.config.graceMs ?? 0,
      effectiveReserveMs: opponent.reserveMsRemaining - elapsedMs,
      isActive,
      isInNegativeTime: opponent.isInNegativeTime,
      timeoutCount: opponent.timeoutCount,
      decisionCapExceeded,
      skipSupported: true,
    });

    return { skip: lorcanaSkipEvaluation(time, opponent, input, settled), drop };
  }

  resetPlayerTimeAfterSkip(playerId: string, options: SkipClockResetOptions): void {
    const state = this.engine.getState() as MatchState;
    const time = state.ctx.time;
    const currentTimeoutCount =
      time.mode === "chess" || time.mode === "dynamic"
        ? (time.players[playerId]?.timeoutCount ?? 0)
        : 0;
    const reset = resetPlayerTimeAfterSkip(state, playerId, options.resetMs, {
      incrementTimeoutCount: currentTimeoutCount <= options.previousTimeoutCount,
    });
    this.engine.loadState(reset);
  }

  createTurnSkippedLog(input: TurnSkippedLogInput): EngineLogRecord {
    const log: MoveLog = {
      moveType: "turnSkipped",
      playerId: input.skipperPlayerId as PlayerId,
      timestamp: Date.now(),
      public: [
        {
          key: "lorcana.system.turnSkipped",
          values: {
            skipperPlayerId: input.skipperPlayerId as PlayerId,
            stallerPlayerId: input.stallerPlayerId as PlayerId,
          },
        },
      ],
    };
    return createEngineLogRecord({
      gameId: input.gameId,
      stateVersion: input.stateVersion,
      log,
      sourceAuthority: input.sourceAuthority,
    }) as EngineLogRecord;
  }

  canUndo(playerId: string): boolean {
    return this.engine.canUndo(playerId);
  }

  undo(playerId: string, context: DispatchContext, prevStateID?: number): DispatchResult {
    const moveHistoryStartIndex = this.engine.getMoveHistory().length;
    const moveLogStartIndex = this.engine.getMoveLogHistory().length;
    const result = this.engine.undo(playerId, prevStateID);
    return this.#toDispatchResult(result, context, {
      actorId: playerId,
      moveHistoryStartIndex,
      moveLogStartIndex,
    });
  }

  /**
   * Translate a Lorcana-engine {@link import("@tcg/lorcana-engine").CommandResult}
   * into the game-agnostic {@link DispatchResult}, building the persistence
   * records the play module hands to Redis as opaque payloads.
   */
  #toDispatchResult(
    result: ReturnType<LorcanaServer["dispatch"]>,
    context: DispatchContext,
    overrides?: {
      actorId?: string;
      moveHistoryStartIndex?: number;
      moveLogStartIndex?: number;
    },
  ): DispatchResult {
    if (!result.success) {
      return {
        success: false,
        error: result.error,
        errorCode: result.errorCode,
        stateID: result.currentStateID,
      };
    }

    const stateVersion = result.stateID;
    const capturedMoveLogs =
      overrides?.moveLogStartIndex === undefined
        ? (result.moveLogs ?? [])
        : this.engine.getMoveLogHistory().slice(overrides.moveLogStartIndex);
    const engineLogRecords: EngineLogRecord[] = capturedMoveLogs.map((log) =>
      createEngineLogRecord({
        gameId: context.gameId,
        log,
        sourceAuthority: context.sourceAuthority,
        stateVersion,
      }),
    );

    let acceptedMoveRecord: AcceptedMoveRecord | undefined;
    const moveHistoryEntries =
      overrides?.moveHistoryStartIndex === undefined
        ? this.engine.getMoveHistory(1)
        : this.engine.getMoveHistory().slice(overrides.moveHistoryStartIndex);
    // A single submitted command can synchronously auto-resolve deterministic
    // bag entries. Persist the first entry (the submitted command), not the
    // final internal resolveBag transition, so replays and analytics retain
    // the player's actual action.
    const moveHistoryEntry = moveHistoryEntries[0];
    if (moveHistoryEntry) {
      const actorId = overrides?.actorId ?? (moveHistoryEntry as { actor?: string }).actor;
      if (!actorId) {
        throw new Error(
          "LorcanaServerEngine: cannot build accepted-move record without an actorId. " +
            "The dispatch call must thread its actorId through, or the move-history entry must expose `actor`.",
        );
      }
      acceptedMoveRecord = createAcceptedMoveRecord({
        actorId,
        gameId: context.gameId,
        moveEntry: moveHistoryEntry,
        processedCommand: isProcessedCommandForMove(
          result.processedCommand,
          moveHistoryEntry.moveId,
        )
          ? result.processedCommand
          : undefined,
        sourceAuthority: context.sourceAuthority,
        stateVersion,
      }) as AcceptedMoveRecord;
    }

    if (!acceptedMoveRecord) {
      // Judge-role forfeit historically omitted moveHistory. Synthesize only
      // that terminal command so drop/timeout can persist; other successes
      // without history (for example automatedNoop) stay a loud invariant.
      if (!isProcessedCommandForMove(result.processedCommand, "forfeitGame")) {
        throw new Error("Lorcana dispatch succeeded without a move history entry.");
      }
      acceptedMoveRecord = synthesizeAcceptedMoveRecord({
        actorId: overrides?.actorId,
        context,
        processedCommand: result.processedCommand,
        stateVersion,
        turnNumber: turnNumberFromState(result.state),
      });
    }

    return {
      success: true,
      transition: "move",
      stateID: stateVersion,
      state: result.state,
      patches: (result.patches ?? []) as readonly unknown[],
      animations: (result.animations ?? []) as readonly PacketAnimation[],
      acceptedMoveRecord,
      engineLogRecords,
      undoable: result.undoable ?? false,
      processedCommand: result.processedCommand,
    };
  }
}

function lorcanaSkipEvaluation(
  time: ChessClockContext | DynamicClockContext,
  opponent: { isInNegativeTime: boolean; timeoutCount: number },
  input: EvaluateOpponentTimeoutInput,
  settled: MatchState,
): OpponentTimeoutSkipEvaluation {
  if (!time.activePlayerID || time.activePlayerID === input.requesterPlayerId) {
    if (!opponent.isInNegativeTime || opponent.timeoutCount < 1) {
      return { allowed: false, reason: "requester_has_priority" };
    }
    return {
      allowed: true,
      timeout: "second",
      stallerPlayerId: input.opponentPlayerId,
      timeoutCount: opponent.timeoutCount,
      forceDrop: true,
      resetTimeOnSkipMs: time.config.resetTimeOnSkipMs,
    };
  }
  const timeout = checkTimeout(settled, input.opponentPlayerId, input.nowMs);
  if (!timeout) return { allowed: false, reason: "within_limit" };
  return {
    allowed: true,
    timeout,
    stallerPlayerId: input.opponentPlayerId,
    timeoutCount: opponent.timeoutCount,
    forceDrop: false,
    resetTimeOnSkipMs: time.config.resetTimeOnSkipMs,
  };
}

function isProcessedCommandForMove(value: unknown, moveId: string): boolean {
  return (
    typeof value === "object" &&
    value !== null &&
    "move" in value &&
    (value as { move?: unknown }).move === moveId
  );
}

function synthesizeAcceptedMoveRecord(args: {
  actorId?: string;
  context: DispatchContext;
  processedCommand: unknown;
  stateVersion: number;
  turnNumber: number;
}): AcceptedMoveRecord {
  const { actorId, context, processedCommand, stateVersion, turnNumber } = args;
  if (!actorId) {
    throw new Error(
      "LorcanaServerEngine: cannot build accepted-move record without an actorId. " +
        "The dispatch call must thread its actorId through, or the move-history entry must expose `actor`.",
    );
  }
  if (!isProcessedCommandEnvelope(processedCommand)) {
    throw new Error("Lorcana dispatch succeeded without a move history entry.");
  }
  return createAcceptedMoveRecord({
    actorId,
    gameId: context.gameId,
    moveEntry: {
      moveId: processedCommand.move,
      input: processedCommand.input,
      playerId: actorId,
      role: "judge",
      timestamp: Date.now(),
      stateID: stateVersion,
      turnNumber,
      transitionType: "move",
      newStateID: stateVersion,
    },
    processedCommand,
    sourceAuthority: context.sourceAuthority,
    stateVersion,
  }) as AcceptedMoveRecord;
}

function turnNumberFromState(state: unknown): number {
  const turn = (state as { ctx?: { status?: { turn?: unknown } } } | undefined)?.ctx?.status?.turn;
  return typeof turn === "number" ? turn : 0;
}

function isProcessedCommandEnvelope(value: unknown): value is CommandEnvelope {
  if (typeof value !== "object" || value === null) return false;
  const command = value as { commandID?: unknown; move?: unknown; input?: unknown };
  return typeof command.commandID === "string" && typeof command.move === "string";
}
