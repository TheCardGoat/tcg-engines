import type { CardInstanceId, PlayerId } from "#core";
import type { CardPlayedPayload } from "../../../types/index";
import type { RemoveDamageEffect } from "@tcg/lorcana-types";
import { isUpToAmount } from "@tcg/lorcana-types";
import type { PlayCardExecutionContext } from "./types";
import type { DynamicAmountEventSnapshot } from "../../../types/domain-events";

import { queueTriggeredEvent } from "../../../triggered-abilities";
import { emitTriggeredLorcanaEvent } from "../../effects/triggered-abilities";
import { markLastEffectPerformed } from "./event-snapshot-utils";
import { recordDamageRemovedThisTurn } from "../../state/turn-metrics";

type ResolvedRemoveDamageEffectInput = {
  targets: CardInstanceId[];
  amountByTarget?: Record<CardInstanceId, number>;
  selectedAmount?: number;
  eventSnapshot?: DynamicAmountEventSnapshot;
};

export function isRemoveDamageEffect(effect: unknown): effect is RemoveDamageEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "remove-damage"
  );
}

export function resolveRemoveDamageEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: RemoveDamageEffect,
  resolvedInput: ResolvedRemoveDamageEffectInput,
): void {
  const selectedAmount =
    typeof resolvedInput.selectedAmount === "number" &&
    Number.isFinite(resolvedInput.selectedAmount)
      ? Math.max(0, resolvedInput.selectedAmount)
      : undefined;

  let healedAmount = 0;
  for (const targetId of resolvedInput.targets) {
    const meta = ctx.cards.require(targetId).meta ?? {};
    const currentDamage = Number(meta.damage ?? 0);
    const resolvedAmount = resolvedInput.amountByTarget?.[targetId];
    const amountCap =
      typeof resolvedAmount === "number" && Number.isFinite(resolvedAmount)
        ? Math.max(0, resolvedAmount)
        : 0;
    const maxByEffect = Math.max(0, Math.min(amountCap, currentDamage));
    const allowsUpTo = isUpToAmount(effect.amount);
    const requestedAmount = allowsUpTo ? (selectedAmount ?? maxByEffect) : maxByEffect;
    const resolvedHealAmount = Math.max(0, Math.min(requestedAmount, maxByEffect, currentDamage));
    const nextDamage = Math.max(0, currentDamage - resolvedHealAmount);
    healedAmount += resolvedHealAmount;

    const shouldReady = effect.thenReady && resolvedHealAmount > 0;

    ctx.cards.patchMeta(targetId, {
      ...meta,
      damage: nextDamage,
      ...(shouldReady ? { state: "ready" as const } : {}),
    });

    if (resolvedHealAmount > 0) {
      queueTriggeredEvent(ctx, {
        event: "remove-damage",
        playerId: ctx.framework.state.currentPlayer,
        subjectCardId: targetId,
        triggerSourceCardId: cardPlayed.cardId,
        eventSnapshot: {
          healedAmount: resolvedHealAmount,
          triggerAmount: resolvedHealAmount,
        },
      });

      if (shouldReady) {
        const playerId = ctx.framework.zones.getCardOwner(targetId) as PlayerId | undefined;
        if (playerId) {
          emitTriggeredLorcanaEvent(
            ctx,
            "cardReadied",
            { cardId: targetId },
            { event: "ready", playerId, subjectCardId: targetId },
          );
        }
      }
    }
  }

  recordDamageRemovedThisTurn(ctx, cardPlayed.playerId, healedAmount);

  if (resolvedInput.eventSnapshot) {
    resolvedInput.eventSnapshot.healedAmount = healedAmount;
    markLastEffectPerformed(resolvedInput.eventSnapshot, healedAmount > 0);
  }
}
