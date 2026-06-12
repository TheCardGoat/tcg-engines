import {
  LocalEngine,
  candidateToCommand,
  enumerateGundamBotCandidates,
  greedyLegalStrategy,
  passOnlyStrategy,
  valueRankedStrategy,
  type CandidateStrategy,
  type CandidateStrategyContext,
  type CommandResult,
  type GundamMoveLog,
  type GundamBotCandidate,
  type MatchState,
  type MatchStaticResources,
  type PlayerId,
} from "@tcg/gundam-engine";
import {
  validateInteractionSubmission,
  type EngineInteractionView,
  type InteractionSubmission,
} from "@tcg/protocol";
import { createCanonicalEngineMoveLog, createEngineLogMessage } from "@tcg/shared/game-engine";
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
import { buildGundamInteractionView, gundamSubmissionToPayload } from "./interaction-protocol.js";

/**
 * Wraps a Gundam {@link LocalEngine} into the game-agnostic
 * {@link ServerGameEngine} contract.
 *
 * Translation notes:
 * - `dispatch(moveType, actorId, payload)` →
 *   `executeCommand({ commandID, move, prevStateID, actorRole, args }, actorId)`.
 * - `getActivePlayerId` reads `state.ctx.status.activePlayer`.
 * - `getGameEndResult` reads `state.ctx.status.{gameEnded, winner, winReason}`.
 * - `takeAutomatedAction` inlines the bot loop (candidate → passTurn → concede)
 *   so each attempt routes through `this.dispatch(...)` and returns a full
 *   `DispatchResult` (patches/animations/move record). `options.strategyId`
 *   selects the candidate-ranking strategy (defaults to `value-ranked`).
 *
 * `staticResources` is captured at adapter construction so the planner can
 * call `enumerateGundamBotCandidates` without re-deriving deck metadata.
 */
const STRATEGY_REGISTRY: Readonly<Record<string, CandidateStrategy>> = {
  "value-ranked": valueRankedStrategy,
  "greedy-legal": greedyLegalStrategy,
  "pass-only": passOnlyStrategy,
};

const DEFAULT_STRATEGY_ID = "value-ranked";

export class GundamServerEngine implements ServerGameEngine {
  constructor(
    public readonly engine: LocalEngine,
    public readonly staticResources: MatchStaticResources,
  ) {}

  dispatch(
    moveType: string,
    actorId: string,
    payload: Record<string, unknown>,
    context: DispatchContext,
  ): DispatchResult {
    const prevStateID = this.engine.getStateID();
    const result = this.engine.executeCommand(
      {
        commandID: `${context.gameId}:${actorId}:${prevStateID}`,
        move: moveType,
        prevStateID,
        actorRole: "player",
        args: payload as never,
      },
      actorId as never,
    );
    return this.#toDispatchResult(result, context, actorId, moveType);
  }

  getStateID(): number {
    return this.engine.getStateID();
  }

  getState(): unknown {
    return this.engine.getState();
  }

  getActivePlayerId(): string | undefined {
    const state = this.engine.getState() as MatchState;
    return state.ctx.status.activePlayer as string | undefined;
  }

  hasGameEnded(): boolean {
    const state = this.engine.getState() as MatchState;
    return state.ctx.status.gameEnded;
  }

  getGameEndResult(): { winnerId?: string; reason?: string } | undefined {
    const state = this.engine.getState() as MatchState;
    if (!state.ctx.status.gameEnded) return undefined;
    return {
      winnerId: state.ctx.status.winner as string | undefined,
      reason: state.ctx.status.winReason,
    };
  }

  getInteractionView(actorId: string): EngineInteractionView {
    const state = this.engine.getState() as MatchState;
    return buildGundamInteractionView({
      actorId,
      stateVersion: this.getStateID(),
      state,
      staticResources: this.staticResources,
      pendingChoice: this.engine
        .getRuntime()
        .getPendingChoice({ role: "player", playerId: actorId as PlayerId }),
    });
  }

  submitInteraction(
    actorId: string,
    submission: InteractionSubmission,
    context: DispatchContext,
  ): DispatchResult {
    const currentStateID = this.getStateID();
    const view = this.getInteractionView(actorId);
    const validation = validateInteractionSubmission(view, submission);
    if (!validation.ok) {
      return {
        success: false,
        error: validation.error,
        errorCode: validation.issues.some((issue) => issue.code === "stale_state")
          ? "stale_interaction"
          : "invalid_interaction_submission",
        stateID: currentStateID,
      };
    }

    try {
      const translated = gundamSubmissionToPayload(submission);
      return this.dispatch(translated.moveType, actorId, translated.payload, context);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Invalid interaction submission.",
        errorCode: "invalid_interaction_submission",
        stateID: currentStateID,
      };
    }
  }

  canUndo(playerId: string): boolean {
    return this.engine.canUndo(playerId as never);
  }

  /**
   * Run a single bot action on behalf of the current actor.
   *
   * We *inline* the planner loop (rather than delegate to
   * `takeAutomatedActionWithFallback`) because the play module needs the
   * full `CommandResult` — patches, animations, accepted-move record — and
   * the planner's `BotDecisionAttempt` only surfaces success/error
   * metadata. Each attempt routes through `this.dispatch(...)` so the
   * resulting `DispatchResult` is identical in shape to a human move.
   *
   * Fallback chain mirrors the engine planner:
   *   1. Strategy-selected candidates (up to 3).
   *   2. `passTurn`.
   *   3. `concede`.
   *
   * `options.strategyId` selects from `STRATEGY_REGISTRY`; unknown ids fall
   * back to the default so a stale config in match meta never bricks the
   * bot loop.
   */
  takeAutomatedAction(options: BotActionOptions, context: DispatchContext): BotActionResult {
    const activePlayer = this.getActivePlayerId();
    if (!activePlayer) {
      return {
        finalResult: {
          success: false,
          error: "No active player; cannot run automated action.",
          errorCode: "no_active_player",
        },
        blocked: { reason: "no-active-player" },
      };
    }

    if (this.hasGameEnded()) {
      return {
        finalResult: {
          success: false,
          error: "Game has already ended.",
          errorCode: "game_ended",
        },
        blocked: { reason: "game-ended" },
      };
    }

    const strategyId = options.strategyId ?? DEFAULT_STRATEGY_ID;
    const strategy = STRATEGY_REGISTRY[strategyId] ?? STRATEGY_REGISTRY[DEFAULT_STRATEGY_ID];
    if (!strategy) {
      return {
        finalResult: {
          success: false,
          error: `Strategy "${strategyId}" not found and default "${DEFAULT_STRATEGY_ID}" is also unavailable.`,
          errorCode: "strategy_not_found",
        },
        blocked: { reason: "strategy-not-found" },
      };
    }

    const runtime = this.engine.getRuntime();
    const state = this.engine.getState();
    const candidates = enumerateGundamBotCandidates(
      state,
      activePlayer as PlayerId,
      this.staticResources,
    );
    const view = runtime.getFilteredView({ role: "player", playerId: activePlayer as PlayerId });
    const pendingChoice =
      runtime.getPendingChoice({ role: "player", playerId: activePlayer as PlayerId }) ?? null;
    const ctx: CandidateStrategyContext = {
      playerId: activePlayer as PlayerId,
      state,
      view,
      candidates,
      turnNumber: state.ctx.status.turn,
      pendingChoice,
      cards: runtime.getCardReadAPI(),
    };

    const ordered = strategy.selectCandidates(ctx) ?? [];
    const toTry = ordered.slice(0, 3);

    // Try each candidate via dispatch; first success wins.
    let lastFailure: DispatchResult | undefined;
    for (const candidate of toTry) {
      const dispatch = this.#dispatchCandidate(candidate, context, activePlayer);
      if (dispatch.success) {
        return {
          finalResult: dispatch,
          selectedCandidate: { family: candidate.family },
        };
      }
      lastFailure = dispatch;
    }

    // Fall back to passTurn.
    const passDispatch = this.dispatch("passTurn", activePlayer, {}, context);
    if (passDispatch.success) {
      return {
        finalResult: passDispatch,
        fallbackTaken:
          toTry.length === 0 ? "no-candidates-pass-succeeded" : "candidate-failed-pass-succeeded",
      };
    }

    // Fall back to concede.
    const concedeDispatch = this.dispatch("concede", activePlayer, {}, context);
    if (concedeDispatch.success) {
      return {
        finalResult: concedeDispatch,
        fallbackTaken:
          toTry.length === 0
            ? "no-candidates-pass-failed-conceded"
            : "candidate-failed-pass-failed-conceded",
        blocked: { reason: "all-fallbacks-required-concede" },
      };
    }

    return {
      finalResult: lastFailure ?? concedeDispatch,
      blocked: { reason: "all-fallbacks-failed" },
      fallbackTaken:
        toTry.length === 0
          ? "no-candidates-pass-failed-concede-failed"
          : "candidate-failed-pass-failed-concede-failed",
    };
  }

  /**
   * Convert a strategy-selected candidate into a `dispatch` call. Mirrors
   * the planner's `candidateToCommand` shape so attempts share the same
   * envelope structure as planner attempts in trace logs.
   */
  #dispatchCandidate(
    candidate: GundamBotCandidate,
    context: DispatchContext,
    actorId: string,
  ): DispatchResult {
    const { move, args } = candidateToCommand(candidate);
    return this.dispatch(move, actorId, args as Record<string, unknown>, context);
  }

  /**
   * Translate Gundam's {@link CommandResult} into the game-agnostic
   * {@link DispatchResult}, building the persistence records the play module
   * stores in Redis.
   */
  #toDispatchResult(
    result: CommandResult,
    context: DispatchContext,
    actorId: string,
    moveType: string,
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
    const acceptedMoveRecord: AcceptedMoveRecord = {
      gameId: context.gameId,
      stateVersion,
      turnNumber: result.state.ctx.status.turn,
      actorId,
      moveId: moveType,
      input: { args: result.processedCommand.args },
      processedCommand: result.processedCommand,
      timestamp: Date.now(),
      sourceAuthority: context.sourceAuthority,
      newStateID: stateVersion,
      transitionType: "move",
    };

    const engineLogRecords: EngineLogRecord[] = (result.moveLogs ?? []).map((log) => ({
      gameId: context.gameId,
      stateVersion,
      timestamp: log.timestamp,
      sourceAuthority: context.sourceAuthority,
      log: toCanonicalGundamMoveLog(log),
    }));

    return {
      success: true,
      stateID: stateVersion,
      state: result.state,
      patches: result.patches as readonly unknown[],
      // Gundam's animation shape differs from the shared one
      // ({id, type, duration, data} vs. {id, kind, payload}); we translate
      // here so the gateway can pass them through uniformly.
      animations: (result.animations ?? []).map((anim): PacketAnimation => {
        const a = anim as { id: string; type: string; data: unknown };
        return { id: a.id, kind: a.type, payload: a.data };
      }),
      acceptedMoveRecord,
      engineLogRecords,
      undoable: result.undoable,
      processedCommand: result.processedCommand,
    };
  }
}

function toCanonicalGundamMoveLog(log: GundamMoveLog) {
  const values = valuesWithout(log, ["type", "playerId", "timestamp", "turnNumber"]);

  return createCanonicalEngineMoveLog({
    moveType: log.type,
    playerId: log.playerId,
    timestamp: log.timestamp,
    turnNumber: log.turnNumber,
    messages: [
      createEngineLogMessage({
        key: `gundam.move.${log.type}`,
        values: { playerId: log.playerId, ...values },
      }),
    ],
  });
}

function valuesWithout(value: object, keys: readonly string[]): Record<string, unknown> {
  const ignored = new Set<string>(keys);
  const out: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (!ignored.has(key)) out[key] = entry;
  }
  return out;
}
