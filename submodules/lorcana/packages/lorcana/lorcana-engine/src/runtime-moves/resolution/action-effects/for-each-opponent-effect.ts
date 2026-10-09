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
function buildPerOpponentContext<T extends { framework: { state: { playerIds: PlayerId[] } } }>(
  ctx: T,
  controllerId: PlayerId,
  opponentId: PlayerId,
): T {
  if (ctx.framework.state.playerIds.length <= 2) {
    // 2-player: the existing context already resolves "opponent" correctly
    return ctx;
  }

  // For 3+ players: reorder playerIds so `opponentId` appears immediately
  // after `controllerId`, ensuring `playerIdForScope("opponent")` picks it up.
  const reorderedPlayerIds = [controllerId, opponentId];

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
  const originalSeats = resolutionInput.eventSnapshot?.opponentIterationPlayerIds;
  if (originalSeats) {
    ctx = {
      ...ctx,
      framework: {
        ...ctx.framework,
        state: { ...ctx.framework.state, playerIds: [...originalSeats] },
      },
    };
  }
  const currentPlayerId = cardPlayed.playerId;
  const opponentIds = effect.remainingOpponentIds
    ? effect.remainingOpponentIds.filter(
        (id) => ctx.framework.state.playerIds.includes(id as PlayerId) && id !== currentPlayerId,
      )
    : (() => {
        const seats = ctx.framework.state.playerIds;
        const active = seats.indexOf(ctx.framework.state.currentPlayer ?? currentPlayerId);
        const ordered = [...seats.slice(active), ...seats.slice(0, active)];
        return ordered.filter((playerId) => playerId !== currentPlayerId);
      })();
  resolutionInput.eventSnapshot ??= {};
  resolutionInput.eventSnapshot.opponentIterationPlayerIds ??= [...ctx.framework.state.playerIds];
  if (opponentIds.length === 0) {
    delete resolutionInput.eventSnapshot.iteratedOpponentId;
    return RESOLVED_ACTION_EFFECT;
  }

  for (let index = 0; index < opponentIds.length; index++) {
    const opponentId = opponentIds[index] as PlayerId;
    const perOpponentCtx = buildPerOpponentContext(ctx, currentPlayerId, opponentId);
    resolutionInput.eventSnapshot.iteratedOpponentId = opponentId;
    resolutionInput.eventSnapshot.lastEffectPerformed = undefined;
    resolutionInput.eventSnapshot.discardResolvedPlayerIds = undefined;
    if (index > 0 || effect.remainingOpponentIds !== undefined) {
      resolutionInput.resolveOptional = undefined;
      resolutionInput.choiceIndex = undefined;
      resolutionInput.chooserPlayerId = undefined;
      resolutionInput.targets = undefined;
      resolutionInput.currentTargets = undefined;
      resolutionInput.targetSelectionResolved = undefined;
    }
    if (
      effect.condition &&
      !evaluateActionCondition(effect.condition, perOpponentCtx, cardPlayed, resolutionInput)
    )
      continue;

    // Encode all later opponents in a serialized cursor. The empty cursor also
    // clears this iteration's scope before an outer sequence resumes.
    const continuation = {
      ...options?.continuation,
      remainingEffects: [
        { ...effect, remainingOpponentIds: opponentIds.slice(index + 1) },
        ...(options?.continuation?.remainingEffects ?? []),
      ],
    };
    const result = resolveActionEffect(perOpponentCtx, cardPlayed, effect.effect, resolutionInput, {
      ...options,
      originatesFromOptional: undefined,
      continuation,
    });
    if (result.status === "suspended") return result;
  }
  delete resolutionInput.eventSnapshot.iteratedOpponentId;
  return RESOLVED_ACTION_EFFECT;
}

/** Reapply the serialized opponent scope when a pending child effect resumes. */
export function scopeResolutionToOpponent<
  T extends { framework: { state: { playerIds: PlayerId[] } } },
>(ctx: T, cardPlayed: CardPlayedPayload, resolutionInput: ActionResolutionInput): T {
  const opponentId = resolutionInput.eventSnapshot?.iteratedOpponentId;
  const originalPlayerIds = resolutionInput.eventSnapshot?.opponentIterationPlayerIds;
  const originalCtx = originalPlayerIds
    ? {
        ...ctx,
        framework: {
          ...ctx.framework,
          state: { ...ctx.framework.state, playerIds: [...originalPlayerIds] },
        },
      }
    : ctx;
  return opponentId
    ? buildPerOpponentContext(originalCtx, cardPlayed.playerId, opponentId)
    : originalCtx;
}
