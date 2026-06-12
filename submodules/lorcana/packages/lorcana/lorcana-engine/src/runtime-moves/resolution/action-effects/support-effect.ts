import type { CardInstanceId } from "#core";
import type { SupportEffect } from "@tcg/lorcana-types";
import type { CardPlayedPayload } from "../../../types";
import {
  addStatModifierEffect,
  cleanupDanglingTargetEffects,
  cleanupExpiredEffects,
} from "../../effects/continuous-effects";
import { createProjectionState, getEffectiveStrength } from "../../../rules/derived-state";
import { getOrBuildMoveRegistry } from "../../rules/move-registry-cache";
import { emitTriggeredLorcanaEvent } from "../../effects/triggered-abilities";
import { markLastEffectPerformed } from "./event-snapshot-utils";
import { resolveEffectTargets } from "../../../targeting/runtime";
import type { ActionResolutionInput, PlayCardExecutionContext } from "./types";

export function isSupportEffect(effect: unknown): effect is SupportEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "support"
  );
}

export function resolveSupportEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: SupportEffect,
  resolutionInput: ActionResolutionInput,
): void {
  const targets =
    resolveEffectTargets(ctx, cardPlayed, effect.target, resolutionInput.targets) ?? [];
  const targetId = targets[0] as CardInstanceId | undefined;
  if (!targetId) {
    markLastEffectPerformed(resolutionInput.eventSnapshot, false);
    return;
  }

  const registry = getOrBuildMoveRegistry(ctx);
  const supportAmount = getEffectiveStrength(
    ctx.cards.getDefinition(cardPlayed.cardId) as any,
    createProjectionState(ctx.framework.state, ctx.G),
    cardPlayed.cardId,
    (id) => ctx.cards.getDefinition(id) as any,
    registry,
  );
  if (!Number.isFinite(supportAmount) || supportAmount <= 0) {
    markLastEffectPerformed(resolutionInput.eventSnapshot, false);
    return;
  }

  const currentTurn = ctx.framework.state.status.turn ?? 1;
  cleanupExpiredEffects(ctx, currentTurn);
  cleanupDanglingTargetEffects(ctx);
  addStatModifierEffect(ctx, {
    sourceId: cardPlayed.cardId,
    targetId,
    stat: "strength",
    modifier: supportAmount,
    duration: "this-turn",
    currentTurn,
  });

  resolutionInput.eventSnapshot ??= {};
  resolutionInput.eventSnapshot.chosenCardId = targetId;
  markLastEffectPerformed(resolutionInput.eventSnapshot, true);

  emitTriggeredLorcanaEvent(
    ctx,
    "abilityActivated",
    {
      playerId: cardPlayed.playerId,
      cardId: cardPlayed.cardId,
      abilityName: "Support",
      abilityIndex: 0,
    },
    {
      event: "support",
      playerId: cardPlayed.playerId,
      subjectCardId: targetId,
      triggerSourceCardId: cardPlayed.cardId,
      eventSnapshot: { chosenCardId: targetId },
    },
  );
}
