import {
  AIPlayer,
  DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
  LocalEngine,
  getSafeAutomatedActionStrategyOption,
  withDeckProfile,
  type CommandResult,
  type AnimationScript,
  type DecisionDiagnostics,
  type DeckStrategyProfile,
  type MatchState,
  type MoveLog,
} from "@tcg/cyberpunk-engine";
import { resolveDeckProfile } from "@tcg/cyberpunk-utils";
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
  BotDecisionDiagnostics,
  DispatchContext,
  DispatchResult,
  EngineLogRecord,
  EvaluateOpponentTimeoutInput,
  OpponentTimeoutEvaluation,
  PacketAnimation,
  PublicGameEndSummary,
  ServerGameEngine,
} from "@tcg/shared/game-engine";
import { cyberpunkAnimationPlan } from "./animation";
import {
  buildCyberpunkInteractionView,
  cyberpunkSubmissionToPayload,
} from "./interaction-protocol";

/**
 * Wraps a Cyberpunk {@link LocalEngine} into the game-agnostic
 * {@link ServerGameEngine} contract.
 *
 * Translation notes:
 * - `dispatch(moveType, actorId, payload)` → `processCommand({ commandID, move, input }, actorId)`
 * - `getActivePlayerId` reads `state.G.turnMetadata.activePlayerId`
 * - `getGameEndResult` reads `state.G.gameEnded` / `winnerId` / `winReason`
 * - `takeAutomatedAction` resolves a named Cyberpunk strategy through the
 *   engine registry and drives it through {@link AIPlayer}, so server-side bot
 *   moves use the same prompt/candidate harness as simulator practice bots.
 * - Last-action and turn-start undo are server-authoritative transitions whose
 *   consent policy is enforced by the platform proposal handler.
 * - Server-authoritative forfeits reuse the engine's always-legal concede
 *   transition and preserve the platform terminal reason.
 */

export class CyberpunkServerEngine implements ServerGameEngine {
  constructor(public readonly engine: LocalEngine) {}

  dispatch(
    moveType: string,
    actorId: string,
    payload: Record<string, unknown>,
    context: DispatchContext,
  ): DispatchResult {
    if (moveType === "undo") {
      return this.undo(actorId, context);
    }
    if (moveType === "rewindToTurnStart") {
      return this.rewindToTurnStart(actorId, context);
    }
    if (moveType === "undoToTurnStart") {
      return this.undoToTurnStart(actorId, context);
    }

    const result = this.engine.processCommand(
      {
        commandID: `${context.gameId}:${actorId}:${crypto.randomUUID()}`,
        move: moveType,
        input: { args: payload } as never,
      },
      actorId as never,
    );
    return this.#toDispatchResult(result, context, actorId, moveType, payload);
  }

  getStateID(): number {
    return this.engine.getState().ctx.stateID;
  }

  getState(): unknown {
    return this.engine.getState();
  }

  getViewerState(
    viewer: { role: "player"; actorId: string } | { role: "spectator" } | { role: "replay" },
  ): unknown {
    const viewerId = viewer.role === "player" ? viewer.actorId : "__public_spectator__";
    return this.engine.getFilteredView(viewerId as never);
  }

  getActivePlayerId(): string | undefined {
    // Delegates to the engine's effective-active-player helper so the
    // SETUP-phase parallel-decision carve-out (both players mulligan
    // independently; canonical `turnMetadata.activePlayerId` doesn't
    // advance between their picks) is handled in one place that both
    // the server-side gameplay inbox consumes.
    return this.engine.getEffectiveActivePlayerId();
  }

  hasGameEnded(): boolean {
    return this.engine.getState().G.gameEnded;
  }

  getGameEndResult(): { winnerId?: string; reason?: string } | undefined {
    const g = this.engine.getState().G;
    if (!g.gameEnded) return undefined;
    return {
      winnerId: g.winnerId ?? undefined,
      reason: g.winReason ?? undefined,
    };
  }

  getPublicGameEndSummary(): PublicGameEndSummary | undefined {
    const state = this.engine.getState();
    if (!state.G.gameEnded) return undefined;

    const players = state.ctx.playerIds.slice(0, 2).map((playerId, index) => {
      const player = state.G.players[playerId as string];
      let streetCred = 0;
      let gigCount = 0;
      for (const dieId of player?.gigArea ?? []) {
        const die = state.G.gigDice[dieId as string];
        if (!die) continue;
        streetCred += die.faceValue;
        gigCount++;
      }
      return {
        playerId: playerId as string,
        seat: (index + 1) as 1 | 2,
        streetCred,
        gigCount,
      };
    });

    if (players.length !== 2) return undefined;
    return {
      game: "cyberpunk",
      endReason: state.G.winReason ?? undefined,
      overtimeActive: state.G.overtime === true || state.G.turnMetadata.overtimeActive === true,
      players: players as PublicGameEndSummary["players"],
    };
  }

  forfeit(winnerId: string, reason: string, context: DispatchContext): DispatchResult {
    const state = this.engine.getState();
    const winnerIsSeated = state.ctx.playerIds.some(
      (playerId) => (playerId as string) === winnerId,
    );
    const loserId = state.ctx.playerIds.find((playerId) => (playerId as string) !== winnerId);
    if (!winnerIsSeated || !loserId) {
      return {
        success: false,
        error: `Cannot forfeit Cyberpunk game to unknown winner ${winnerId}.`,
        errorCode: "invalid_forfeit_winner",
        stateID: state.ctx.stateID,
      };
    }

    const result = this.engine.processCommand(
      {
        commandID: `${context.gameId}:${winnerId}:forfeit:${state.ctx.stateID}`,
        move: "concede",
        input: { args: {} },
      },
      loserId,
    );
    if (result.success) preserveForfeitReason(result, reason);
    return this.#toDispatchResult(result, context, winnerId, "forfeitGame", {
      winnerId,
      reason,
    });
  }

  evaluateOpponentTimeout(input: EvaluateOpponentTimeoutInput): OpponentTimeoutEvaluation {
    return evaluateClockStateTimeout(this.engine.getState(), input);
  }

  getInteractionView(actorId: string): EngineInteractionView {
    return buildCyberpunkInteractionView({
      actorId,
      stateVersion: this.getStateID(),
      prompt: this.engine.getPrompt(actorId as never),
      state: this.engine.getState(),
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
      const translated = cyberpunkSubmissionToPayload(submission);
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

  canUndo(_playerId: string): boolean {
    return this.engine.canUndo();
  }

  canUndoToTurnStart(_playerId: string): boolean {
    return this.engine.canUndoToTurnStart();
  }

  undoToTurnStart(
    playerId: string,
    context: DispatchContext,
    prevStateID?: number,
  ): DispatchResult {
    const previousStateID = prevStateID ?? this.getStateID();
    if (!this.engine.canUndoToTurnStart()) {
      return {
        success: false,
        error: "No clean turn-start checkpoint is available.",
        errorCode: "turn_start_undo_unavailable",
        stateID: previousStateID,
      };
    }
    return this.rewindToTurnStart(playerId, context, "undoToTurnStart");
  }

  undo(playerId: string, context: DispatchContext, prevStateID?: number): DispatchResult {
    const previousStateID = prevStateID ?? this.getStateID();
    if (!this.engine.canUndo()) {
      return {
        success: false,
        error: "No undoable move is available.",
        errorCode: "undo_unavailable",
        stateID: previousStateID,
      };
    }

    if (!this.engine.undo()) {
      return {
        success: false,
        error: "No undoable move is available.",
        errorCode: "undo_unavailable",
        stateID: previousStateID,
      };
    }

    const state = this.engine.getState();
    state.ctx.stateID = previousStateID + 1;
    const stateVersion = state.ctx.stateID;
    const timestamp = Date.now();

    return {
      success: true,
      stateID: stateVersion,
      state,
      patches: [],
      animations: [],
      transition: "move",
      acceptedMoveRecord: {
        gameId: context.gameId,
        stateVersion,
        turnNumber: state.G.turnMetadata.turnNumber ?? 0,
        actorId: playerId,
        moveId: "undo",
        input: { args: {} },
        processedCommand: {
          commandID: `${context.gameId}:${playerId}:${stateVersion}`,
          move: "undo",
        },
        timestamp,
        sourceAuthority: context.sourceAuthority,
        newStateID: stateVersion,
        transitionType: "undo",
        undoneStateID: previousStateID,
      },
      engineLogRecords: [
        {
          gameId: context.gameId,
          stateVersion,
          timestamp,
          sourceAuthority: context.sourceAuthority,
          log: createCanonicalEngineMoveLog({
            moveType: "undo",
            playerId,
            timestamp,
            turnNumber: state.G.turnMetadata.turnNumber,
            messages: [
              createEngineLogMessage({
                key: "cyberpunk.move.undo",
                values: { playerId, scope: "lastMove" },
              }),
            ],
          }),
        },
      ],
      undoable: false,
      processedCommand: {
        commandID: `${context.gameId}:${playerId}:${stateVersion}`,
        move: "undo",
      },
    };
  }

  /**
   * Restore the engine-private start-of-turn checkpoint. The lifecycle adapter
   * persists this checkpoint as snapshot continuation metadata, separate from
   * the public match state, so it survives an authoritative worker restore.
   */
  rewindToTurnStart(
    playerId: string,
    context: DispatchContext,
    moveId: "rewindToTurnStart" | "undoToTurnStart" = "rewindToTurnStart",
  ): DispatchResult {
    const previousStateID = this.getStateID();
    const outcome = this.engine.restoreToTurnStart();
    if (!outcome.success) {
      return {
        success: false,
        error: outcome.error,
        errorCode: outcome.errorCode,
        stateID: previousStateID,
      };
    }

    const state = this.engine.getState();
    const stateVersion = state.ctx.stateID;
    const timestamp = Date.now();

    return {
      success: true,
      stateID: stateVersion,
      state,
      patches: [],
      animations: [],
      transition: "move",
      acceptedMoveRecord: {
        gameId: context.gameId,
        stateVersion,
        turnNumber: state.G.turnMetadata.turnNumber ?? 0,
        actorId: playerId,
        moveId,
        input: { args: {} },
        processedCommand: {
          commandID: `${context.gameId}:${playerId}:${stateVersion}`,
          move: moveId,
        },
        timestamp,
        sourceAuthority: context.sourceAuthority,
        newStateID: stateVersion,
        transitionType: "undo",
        undoneStateID: previousStateID,
      },
      engineLogRecords: [
        {
          gameId: context.gameId,
          stateVersion,
          timestamp,
          sourceAuthority: context.sourceAuthority,
          log: createCanonicalEngineMoveLog({
            moveType: moveId,
            playerId,
            timestamp,
            turnNumber: state.G.turnMetadata.turnNumber,
            messages: [
              createEngineLogMessage({
                key: "cyberpunk.move.rewindToTurnStart",
                values: { playerId, scope: "turnStart" },
              }),
            ],
          }),
        },
      ],
      undoable: false,
      processedCommand: {
        commandID: `${context.gameId}:${playerId}:${stateVersion}`,
        move: moveId,
      },
    };
  }

  takeAutomatedAction(options: BotActionOptions, context: DispatchContext): BotActionResult {
    const state = this.engine.getState();
    if (state.G.gameEnded) {
      return {
        finalResult: {
          success: false,
          error: "Game has already ended.",
          errorCode: "game_ended",
        },
        blocked: { reason: "game-ended" },
      };
    }
    const actorId = this.engine.getEffectiveActivePlayerId();
    if (!actorId) {
      return {
        finalResult: {
          success: false,
          error: "No active player; cannot run automated action.",
          errorCode: "no_active_player",
        },
        blocked: { reason: "no-active-player" },
      };
    }

    const strategyOption = getSafeAutomatedActionStrategyOption(
      options.strategyId ?? DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
    );
    const profile = resolveDeckProfile({ cards: ownerCardTokens(state, actorId as string) });
    const strategy = profile
      ? withDeckProfile(strategyOption.strategy, profile as DeckStrategyProfile)
      : strategyOption.strategy;
    const bot = new AIPlayer(this.engine, actorId as never, strategy, {
      rngSeed: `${context.gameId}:${actorId}:${this.getStateID()}:${strategyOption.id}`,
      commandIdFor: (stepIndex) =>
        `${context.gameId}:${actorId}:bot:${this.getStateID()}:${stepIndex}`,
    });
    const step = bot.step();

    switch (step.kind) {
      case "acted": {
        const payload = (step.decision.args ?? {}) as Record<string, unknown>;
        const dispatch = this.#toDispatchResult(
          step.result,
          context,
          actorId,
          step.decision.move,
          payload,
        );
        return {
          finalResult: dispatch,
          strategyId: strategyOption.id,
          selectedCandidate: { family: step.decision.move },
          decisionDiagnostics: toBotDecisionDiagnostics(step.decision.diagnostics),
          decisionDurationMs: step.decisionDurationMs,
        };
      }
      case "idle":
        return {
          finalResult: {
            success: false,
            error: `Automated strategy "${strategyOption.id}" is idle: ${step.reason}.`,
            errorCode: "bot_idle",
            stateID: this.getStateID(),
          },
          strategyId: strategyOption.id,
          blocked: { reason: step.reason },
        };
      case "stuck":
        return {
          finalResult: {
            success: false,
            error: step.reason,
            errorCode: "bot_stuck",
            stateID: this.getStateID(),
          },
          strategyId: strategyOption.id,
          blocked: { reason: step.pendingType ?? "strategy-stuck" },
        };
      case "illegal":
        return {
          finalResult: {
            success: false,
            error: step.error,
            errorCode: step.errorCode,
            stateID: this.getStateID(),
          },
          strategyId: strategyOption.id,
          selectedCandidate: { family: step.decision.move },
          decisionDiagnostics: toBotDecisionDiagnostics(step.decision.diagnostics),
          decisionDurationMs: step.decisionDurationMs,
          blocked: { reason: "illegal-command" },
        };
    }
  }

  /**
   * Translate a Cyberpunk {@link CommandResult} into the game-agnostic
   * {@link DispatchResult}, building the persistence records the play module
   * stores in Redis.
   */
  #toDispatchResult(
    result: CommandResult,
    context: DispatchContext,
    actorId: string,
    moveType: string,
    payload: Record<string, unknown>,
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
    const timestamp = Date.now();
    const acceptedMoveRecord: AcceptedMoveRecord = {
      gameId: context.gameId,
      stateVersion,
      turnNumber: result.state.G.turnMetadata.turnNumber ?? 0,
      actorId,
      moveId: moveType,
      input: { args: payload },
      processedCommand: {
        commandID: `${context.gameId}:${actorId}:${stateVersion}`,
        move: moveType,
      },
      timestamp,
      sourceAuthority: context.sourceAuthority,
      newStateID: stateVersion,
      transitionType: "move",
    };
    const engineLogRecords: EngineLogRecord[] = result.moveLogs.map((log) => ({
      gameId: context.gameId,
      stateVersion,
      timestamp: log.timestamp,
      sourceAuthority: context.sourceAuthority,
      log: toCanonicalCyberpunkMoveLog(log),
    }));
    const nativeAnimations = animationPacketsFromResult({
      gameId: context.gameId,
      actorId,
      stateVersion,
      moveType,
      result,
    });

    return {
      success: true,
      stateID: stateVersion,
      state: result.state,
      patches: result.patches as readonly unknown[],
      animations: nativeAnimations,
      animationPlan: cyberpunkAnimationPlan(
        `${context.gameId}:${actorId}:${stateVersion}`,
        result.animationScript,
      ),
      transition: "move",
      acceptedMoveRecord,
      engineLogRecords,
      undoable: result.undoable ?? false,
      processedCommand: {
        commandID: `${context.gameId}:${actorId}:${stateVersion}`,
        move: moveType,
      },
    };
  }

  /** Expose the raw state so the lifecycle helpers can serialise it. */
  getRawState(): MatchState {
    return this.engine.getState();
  }
}

function evaluateClockStateTimeout(
  state: MatchState,
  input: EvaluateOpponentTimeoutInput,
): OpponentTimeoutEvaluation {
  const ctx = state.ctx as {
    timeControl?: { mode?: string; config?: { graceMs?: number } };
    clockState?: Record<
      string,
      { reserveMsRemaining?: number; lastUpdatedAtMs?: number; isOnClock?: boolean }
    >;
  };
  const timeControl = ctx.timeControl;
  if (!timeControl || timeControl.mode === "none") {
    return {
      skip: { allowed: false, reason: "no_time_control" },
      drop: { allowed: false, reason: "no_time_control", facts: { mode: timeControl?.mode } },
    };
  }
  const clock = ctx.clockState?.[input.opponentPlayerId];
  if (!clock || typeof clock.reserveMsRemaining !== "number") {
    return {
      skip: { allowed: false, reason: "skip_unsupported" },
      drop: { allowed: false, reason: "clock_unavailable", facts: { mode: timeControl.mode } },
    };
  }
  const isActive = clock.isOnClock === true;
  const elapsedMs =
    isActive && typeof clock.lastUpdatedAtMs === "number"
      ? Math.max(0, input.nowMs - clock.lastUpdatedAtMs)
      : 0;
  return {
    skip: { allowed: false, reason: "skip_unsupported" },
    drop: evaluateReserveTimeoutDrop({
      nowMs: input.nowMs,
      mode: timeControl.mode,
      graceMs: timeControl.config?.graceMs ?? 0,
      effectiveReserveMs: clock.reserveMsRemaining - elapsedMs,
      isActive,
      skipSupported: false,
    }),
  };
}

function preserveForfeitReason(
  result: Extract<CommandResult, { success: true }>,
  reason: string,
): void {
  result.state.G.winReason = reason;
  result.undoable = false;

  const reasonPatch = result.patches.find(
    (patch) => patch.path.length === 2 && patch.path[0] === "G" && patch.path[1] === "winReason",
  );
  if (reasonPatch && reasonPatch.op !== "remove") reasonPatch.value = reason;
  else result.patches.push({ op: "replace", path: ["G", "winReason"], value: reason });

  for (const event of result.gameEvents) {
    if (event.type === "gameEnded") event.reason = reason;
  }
  for (const log of result.moveLogs) {
    if (log.type === "gameEnded") log.reason = reason;
  }
}

function ownerCardTokens(state: MatchState, actorId: string): string[] {
  const tokens: string[] = [];
  for (const card of Object.values(state.G.cardIndex)) {
    if ((card.ownerId as string) === actorId) tokens.push(card.definitionId);
  }
  return tokens;
}

function toBotDecisionDiagnostics(
  diagnostics: DecisionDiagnostics | undefined,
): BotDecisionDiagnostics | undefined {
  if (!diagnostics) return undefined;
  return {
    kind: "search",
    strategyId: diagnostics.strategy,
    candidateCount: diagnostics.candidateCount,
    nodesEvaluated: diagnostics.nodesEvaluated,
    depthReached: diagnostics.depthReached,
    scoreGap: diagnostics.scoreGap,
    cutoffReason: diagnostics.cutoffReason,
  };
}

function animationPacketsFromResult(params: {
  gameId: string;
  actorId: string;
  stateVersion: number;
  moveType: string;
  result: Extract<CommandResult, { success: true }>;
}): readonly PacketAnimation<"cyberpunk.animationScript", CyberpunkAnimationScriptPayload>[] {
  if (params.result.animationScript.steps.length === 0) {
    return [];
  }

  return [
    {
      id: `${params.gameId}:${params.actorId}:${params.stateVersion}:animation-script`,
      kind: "cyberpunk.animationScript",
      payload: {
        actorId: params.actorId,
        moveType: params.moveType,
        stateID: params.stateVersion,
        animationScript: params.result.animationScript,
      },
    },
  ];
}

interface CyberpunkAnimationScriptPayload {
  actorId: string;
  moveType: string;
  stateID: number;
  animationScript: AnimationScript;
}

function toCanonicalCyberpunkMoveLog(log: MoveLog) {
  const values = valuesWithout(log, ["type", "playerId", "timestamp", "turnNumber"]);
  const isActionLog = log.type === "action";
  const key =
    isActionLog && typeof values.messageKey === "string"
      ? `cyberpunk.${values.messageKey}`
      : `cyberpunk.move.${log.type}`;

  return createCanonicalEngineMoveLog({
    moveType: log.type,
    playerId: log.playerId,
    timestamp: log.timestamp,
    turnNumber: log.turnNumber,
    messages: [
      createEngineLogMessage({
        key,
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
