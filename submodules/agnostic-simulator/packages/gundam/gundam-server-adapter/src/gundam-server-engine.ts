import { gundamAnimationPlan } from "./gundam-animation.js";
import {
  LocalEngine,
  candidateToCommand,
  checkTimeout,
  enumerateGundamBotCandidates,
  getSafeGundamAutomatedActionStrategyOption,
  resetPlayerTimeAfterSkip,
  settleClocks,
  type CandidateStrategyContext,
  type ChessClockContext,
  type CommandResult,
  type DynamicClockContext,
  type GundamMoveLog,
  type GundamBotCandidate,
  type FilteredMatchView,
  type MatchState,
  type MatchStaticResources,
  type PlayerId,
  type PacketAnimation as GundamPacketAnimation,
} from "@tcg/gundam-engine";
import {
  evaluateReserveTimeoutDrop,
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
  EvaluateOpponentTimeoutInput,
  OpponentTimeoutEvaluation,
  OpponentTimeoutSkipEvaluation,
  PacketAnimation,
  ServerGameEngine,
  SkipClockResetOptions,
  TurnSkippedLogInput,
} from "@tcg/shared/game-engine";
import { buildGundamInteractionView, gundamSubmissionToPayload } from "./interaction-protocol.js";
import {
  applyGundamPresentationToView,
  filterGundamCardsMapsForView,
  type GundamPresentation,
} from "./gundam-presentation.js";
import type { CardsMaps } from "@tcg/shared/game-adapter";

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
 * - Server-authoritative forfeits (disconnect / timeout drop) run the loser's
 *   always-legal `concede` and persist the platform terminal reason.
 *
 * `staticResources` is captured at adapter construction so the planner can
 * call `enumerateGundamBotCandidates` without re-deriving deck metadata.
 */
export class GundamServerEngine implements ServerGameEngine {
  public readonly engine: LocalEngine;
  public readonly staticResources: MatchStaticResources;
  public readonly cardsMaps: CardsMaps;

  constructor(
    engine: LocalEngine,
    staticResources: MatchStaticResources,
    cardsMaps: CardsMaps = { cardInstances: {}, owners: {} },
  ) {
    this.engine = engine;
    this.staticResources = staticResources;
    this.cardsMaps = cardsMaps;
  }

  dispatch(
    moveType: string,
    actorId: string,
    payload: Record<string, unknown>,
    context: DispatchContext,
  ): DispatchResult {
    if (moveType === "undo") {
      return this.undo(actorId, context);
    }
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

  getViewerState(
    viewer: { role: "player"; actorId: string } | { role: "spectator" } | { role: "replay" },
  ): unknown {
    return applyGundamPresentationToView(
      this.#filteredViewFor(viewer) as FilteredMatchView,
      this.presentation,
    );
  }

  getViewerResources(
    viewer: { role: "player"; actorId: string } | { role: "spectator" } | { role: "replay" },
  ): unknown {
    // Replays are post-match artifacts (replay access is participant-gated),
    // and replay playback needs the full presentation overlay from version 0 —
    // before any card is visible — so hidden-deck filtering must not apply.
    if (viewer.role === "replay") {
      return { cardsMaps: this.cardsMaps };
    }
    // The authoritative maps index every instance of the match, including the
    // opponent's face-down deck; expose only what this viewer's projection
    // already reveals so bootstrap/realtime payloads stay viewer-safe.
    return {
      cardsMaps: filterGundamCardsMapsForView(
        this.cardsMaps,
        this.#filteredViewFor(viewer) as FilteredMatchView,
      ),
    };
  }

  #filteredViewFor(
    viewer: { role: "player"; actorId: string } | { role: "spectator" } | { role: "replay" },
  ) {
    return viewer.role === "player"
      ? this.engine
          .getRuntime()
          .getFilteredView({ role: "player", playerId: viewer.actorId as PlayerId })
      : this.engine.getRuntime().getFilteredView({ role: "spectator" });
  }

  private get presentation(): GundamPresentation | undefined {
    return this.cardsMaps.presentation;
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

  forfeit(winnerId: string, reason: string, context: DispatchContext): DispatchResult {
    const state = this.engine.getState() as MatchState;
    const playerIds = state.ctx.playerIds.map(String);
    const winnerSeated = playerIds.includes(winnerId);
    const loserId = playerIds.find((playerId) => playerId !== winnerId);
    if (!winnerSeated || !loserId) {
      return {
        success: false,
        error: `Cannot forfeit Gundam game to unknown winner ${winnerId}.`,
        errorCode: "invalid_forfeit_winner",
        stateID: this.getStateID(),
      };
    }

    const prevStateID = this.engine.getStateID();
    const result = this.engine.executeCommand(
      {
        commandID: `${context.gameId}:${winnerId}:forfeit:${prevStateID}`,
        move: "concede",
        prevStateID,
        actorRole: "player",
        args: {},
      },
      loserId as PlayerId,
    );
    if (result.success) preserveGundamForfeitReason(result, reason);
    return this.#toDispatchResult(result, context, winnerId, "forfeitGame");
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

    return { skip: gundamSkipEvaluation(time, opponent, input, settled), drop };
  }

  resetPlayerTimeAfterSkip(playerId: string, options: SkipClockResetOptions): void {
    const runtime = this.engine.getRuntime();
    const state = runtime.state;
    const time = state.ctx.time;
    const currentTimeoutCount =
      time.mode === "chess" || time.mode === "dynamic"
        ? (time.players[playerId]?.timeoutCount ?? 0)
        : 0;
    runtime.state = resetPlayerTimeAfterSkip(state, playerId, options.resetMs, {
      incrementTimeoutCount: currentTimeoutCount <= options.previousTimeoutCount,
    });
  }

  createTurnSkippedLog(input: TurnSkippedLogInput): EngineLogRecord {
    const timestamp = Date.now();
    return {
      gameId: input.gameId,
      stateVersion: input.stateVersion,
      timestamp,
      sourceAuthority: input.sourceAuthority,
      log: createCanonicalEngineMoveLog({
        moveType: "turnSkipped",
        playerId: input.skipperPlayerId,
        timestamp,
        messages: [
          createEngineLogMessage({
            key: "gundam.system.turnSkipped",
            values: {
              skipperPlayerId: input.skipperPlayerId,
              stallerPlayerId: input.stallerPlayerId,
            },
          }),
        ],
      }),
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
      publicPendingChoice: this.engine.getRuntime().getPendingChoice({ role: "judge" }),
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

  undo(playerId: string, context: DispatchContext): DispatchResult {
    const currentStateID = this.engine.getStateID();
    const result = this.engine.undo(playerId as never);
    if (!result) {
      return {
        success: false,
        error: "No undoable move is available.",
        errorCode: "UNDO_NOT_AVAILABLE",
        stateID: currentStateID,
      };
    }
    return this.#toDispatchResult(result, context, playerId, "undo");
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

    const strategy = getSafeGundamAutomatedActionStrategyOption(options.strategyId).strategy;

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
      transitionType: moveType === "undo" ? "undo" : "move",
      ...(moveType === "undo" ? { undoneStateID: result.processedCommand.prevStateID } : {}),
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
      animations: (result.animations ?? []).map(gundamPacketAnimation),
      animationPlan:
        (result.animations?.length ?? 0) === 0
          ? null
          : gundamAnimationPlan(
              `${context.gameId}:${actorId}:${stateVersion}`,
              result.animations ?? [],
              actorId,
              this.engine.getRuntime().getFilteredView({ role: "spectator" }),
            ),
      transition: "move",
      acceptedMoveRecord,
      engineLogRecords,
      undoable: result.undoable,
      processedCommand: result.processedCommand,
    };
  }
}

/** Preserve native animation data; viewer safety is enforced by simulator rendering. */
export function gundamPacketAnimation(animation: GundamPacketAnimation): PacketAnimation {
  return {
    id: animation.id,
    kind: animation.type,
    durationMs: animation.duration,
    payload: animation.data,
  };
}

function gundamSkipEvaluation(
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

function preserveGundamForfeitReason(
  result: Extract<CommandResult, { success: true }>,
  reason: string,
): void {
  result.state.ctx.status.winReason = reason;
  result.undoable = false;

  const patches = result.patches as Array<{ op?: string; path?: unknown; value?: unknown }>;
  const existing = patches.find(
    (patch) =>
      Array.isArray(patch.path) &&
      patch.path[0] === "ctx" &&
      patch.path[1] === "status" &&
      patch.path[2] === "winReason",
  );
  if (existing && existing.op !== "remove") existing.value = reason;
  else patches.push({ op: "replace", path: ["ctx", "status", "winReason"], value: reason });
}

function valuesWithout(value: object, keys: readonly string[]): Record<string, unknown> {
  const ignored = new Set<string>(keys);
  const out: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (!ignored.has(key)) out[key] = entry;
  }
  return out;
}
