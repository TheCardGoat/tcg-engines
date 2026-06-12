import type { ForEachOpponentEffect } from "@tcg/lorcana-types";
import type {
  ActionResolutionInput,
  ActionResolutionResult,
  PlayCardExecutionContext,
  CardPlayedPayload,
} from "./types";
import type { ActionEffectResolutionOptions } from "./types";
import type { PlayerId } from "#core";
import { resolveActionEffect } from "./composed-effect-resolver";
import { evaluateActionCondition } from "./action-condition-evaluator";

export function isForEachOpponentEffect(effect: unknown): effect is ForEachOpponentEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "for-each-opponent"
  );
}

const RESOLVED_ACTION_EFFECT: ActionResolutionResult = {
  status: "resolved",
};

/**
 * Build a per-opponent condition evaluation context by overriding the playerIds
 * so that `playerIdForScope("opponent")` resolves to the specific iterated opponent.
 *
 * This is needed for conditions like "opponent has more lore than you" to evaluate
 * correctly per-opponent in multiplayer games with 3+ players.
 */
function buildPerOpponentContext(
  ctx: PlayCardExecutionContext,
  controllerId: PlayerId,
  opponentId: PlayerId,
): PlayCardExecutionContext {
  if (ctx.framework.state.playerIds.length <= 2) {
    // 2-player: the existing context already resolves "opponent" correctly
    return ctx;
  }

  // For 3+ players: reorder playerIds so `opponentId` appears immediately
  // after `controllerId`, ensuring `playerIdForScope("opponent")` picks it up.
  const remainingIds = ctx.framework.state.playerIds.filter(
    (id) => id !== controllerId && id !== opponentId,
  );
  const reorderedPlayerIds = [controllerId, opponentId, ...remainingIds];

  return {
    ...ctx,
    framework: {
      ...ctx.framework,
      state: {
        ...ctx.framework.state,
        playerIds: reorderedPlayerIds,
      },
    },
  };
}

export function resolveForEachOpponentEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: ForEachOpponentEffect,
  resolutionInput: ActionResolutionInput,
  options?: ActionEffectResolutionOptions,
): ActionResolutionResult {
  const currentPlayerId = cardPlayed.playerId;
  const allPlayerIds = ctx.framework.state.playerIds;
  const opponentIds = allPlayerIds.filter((playerId) => playerId !== currentPlayerId);

  if (opponentIds.length === 0) {
    return RESOLVED_ACTION_EFFECT;
  }

  // Resolve the inner effect for each opponent sequentially
  for (const opponentId of opponentIds) {
    // Evaluate the optional per-opponent condition before applying the effect
    if (effect.condition) {
      const perOpponentCtx = buildPerOpponentContext(ctx, currentPlayerId, opponentId);
      const conditionMet = evaluateActionCondition(
        effect.condition,
        perOpponentCtx,
        cardPlayed,
        resolutionInput,
      );
      if (!conditionMet) {
        continue;
      }
    }

    const isLastOpponent = opponentId === opponentIds[opponentIds.length - 1];
    const result = resolveActionEffect(ctx, cardPlayed, effect.effect, resolutionInput, {
      ...options,
      continuation: isLastOpponent ? options?.continuation : undefined,
    });

    if (result.status === "suspended") {
      return result;
    }
  }

  return RESOLVED_ACTION_EFFECT;
}
