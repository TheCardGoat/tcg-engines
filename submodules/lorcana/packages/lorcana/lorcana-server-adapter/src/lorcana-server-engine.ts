import {
  createAcceptedMoveRecord,
  createEngineLogRecord,
  DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
  getSafeAutomatedActionStrategyOption,
  LorcanaServer,
  type PlayerId,
} from "@tcg/lorcana-engine";
import type {
  AcceptedMoveRecord,
  BotActionOptions,
  BotActionResult,
  DispatchContext,
  DispatchResult,
  EngineLogRecord,
  PacketAnimation,
  ServerGameEngine,
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
    const result = this.engine.dispatch(moveType, actorId, payload);
    // Thread the dispatching actorId so the accepted-move record carries it
    // even when the underlying move-history entry doesn't expose `actor`.
    return this.#toDispatchResult(result, context, { actorId });
  }

  getStateID(): number {
    return this.engine.getStateID();
  }

  getState(): unknown {
    return this.engine.getState();
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
    const result = this.engine.forfeitGame(winnerId as PlayerId, reason);
    return this.#toDispatchResult(result, context, { actorId: winnerId });
  }

  takeAutomatedAction(options: BotActionOptions, context: DispatchContext): BotActionResult {
    const strategyOption = getSafeAutomatedActionStrategyOption(
      options.strategyId ?? DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
    );
    const botResult = this.engine.takeAutomatedActionForCurrentActor({
      strategy: strategyOption.strategy,
    });
    const finalResult = this.#toDispatchResult(botResult.finalResult, context, {
      actorId: botResult.actorId,
    });
    const result: BotActionResult = { finalResult };
    if (botResult.blocked) result.blocked = { reason: botResult.blocked.reason };
    if (botResult.selectedCandidate?.family) {
      result.selectedCandidate = { family: botResult.selectedCandidate.family };
    }
    if (botResult.fallbackTaken) result.fallbackTaken = botResult.fallbackTaken;
    return result;
  }

  canUndo(playerId: string): boolean {
    return this.engine.canUndo(playerId);
  }

  undo(playerId: string, context: DispatchContext, prevStateID?: number): DispatchResult {
    const result = this.engine.undo(playerId, prevStateID);
    return this.#toDispatchResult(result, context, { actorId: playerId });
  }

  /**
   * Translate a Lorcana-engine {@link import("@tcg/lorcana-engine").CommandResult}
   * into the game-agnostic {@link DispatchResult}, building the persistence
   * records the play module hands to Redis as opaque payloads.
   */
  #toDispatchResult(
    result: ReturnType<LorcanaServer["dispatch"]>,
    context: DispatchContext,
    overrides?: { actorId?: string },
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
    const engineLogRecords: EngineLogRecord[] = (result.moveLogs ?? []).map((log) =>
      createEngineLogRecord({
        gameId: context.gameId,
        log,
        sourceAuthority: context.sourceAuthority,
        stateVersion,
      }),
    );

    let acceptedMoveRecord: AcceptedMoveRecord | undefined;
    const moveHistoryEntry = this.engine.getMoveHistory(1).at(-1);
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
        processedCommand: result.processedCommand,
        sourceAuthority: context.sourceAuthority,
        stateVersion,
      }) as AcceptedMoveRecord;
    }

    return {
      success: true,
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
