import {
  AIPlayer,
  DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
  LocalEngine,
  getSafeAutomatedActionStrategyOption,
  type CommandResult,
  type AnimationScript,
  type MatchState,
  type MoveLog,
} from "@tcg/cyberpunk-engine";
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
  PublicGameEndSummary,
  ServerGameEngine,
} from "@tcg/shared/game-engine";
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
 * - Undo and forfeit remain unsupported; omitting them keeps the move
 *   processor's "not supported" gateway error intact for those paths.
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

  getActivePlayerId(): string | undefined {
    // Delegates to the engine's effective-active-player helper so the
    // SETUP-phase parallel-decision carve-out (both players mulligan
    // independently; canonical `turnMetadata.activePlayerId` doesn't
    // advance between their picks) is handled in one place that both
    // the legacy ws-route handlers and the new inbox handlers consume.
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

  getInteractionView(actorId: string): EngineInteractionView {
    return buildCyberpunkInteractionView({
      actorId,
      stateVersion: this.getStateID(),
      prompt: this.engine.getPrompt(actorId as never),
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
    const bot = new AIPlayer(this.engine, actorId as never, strategyOption.strategy, {
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
          selectedCandidate: { family: step.decision.move },
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
          selectedCandidate: { family: step.decision.move },
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

    return {
      success: true,
      stateID: stateVersion,
      state: result.state,
      patches: result.patches as readonly unknown[],
      animations: animationPacketsFromResult({
        gameId: context.gameId,
        actorId,
        stateVersion,
        moveType,
        result,
      }),
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
