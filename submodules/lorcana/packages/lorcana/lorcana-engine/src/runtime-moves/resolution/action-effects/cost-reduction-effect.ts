import type { CostReductionEffect } from "@tcg/lorcana-types";
import type { PlayerId } from "#core";
import type { CardPlayedPayload } from "../../../types";
import { resolveTemporaryEffectExpiryTurn } from "../../effects/temporary-effects";
import { resolveTargetPlayerIds } from "./player-target-resolver";
import type { ActionResolutionInput, PlayCardExecutionContext } from "./types";

type ResolvedCostReductionEffectInput = {
  reductionAmount?: number;
};

export function isCostReductionEffect(effect: unknown): effect is CostReductionEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "cost-reduction"
  );
}

function resolveCostReductionAmount(
  effect: CostReductionEffect,
  resolvedAmount: number | undefined,
): number {
  if (typeof resolvedAmount === "number" && Number.isFinite(resolvedAmount)) {
    return Math.max(0, resolvedAmount);
  }

  if (typeof effect.amount === "number" && Number.isFinite(effect.amount)) {
    return Math.max(0, effect.amount);
  }

  const reduction = effect.reduction;
  if (
    reduction &&
    typeof reduction === "object" &&
    typeof reduction.ink === "number" &&
    Number.isFinite(reduction.ink)
  ) {
    return Math.max(0, reduction.ink);
  }

  return 0;
}

type NormalizedCardType = "character" | "item" | "location" | "action" | "song";

function normalizeCardType(
  cardType: CostReductionEffect["cardType"],
): NormalizedCardType | NormalizedCardType[] | undefined {
  if (Array.isArray(cardType)) {
    const normalized = cardType.filter(
      (value): value is NormalizedCardType =>
        value === "character" ||
        value === "item" ||
        value === "location" ||
        value === "action" ||
        value === "song",
    );
    return normalized.length > 0 ? normalized : undefined;
  }

  switch (cardType) {
    case "character":
    case "item":
    case "location":
    case "action":
    case "song":
      return cardType;
    default:
      return undefined;
  }
}

export function resolveCostReductionEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: CostReductionEffect,
  _resolutionInput: ActionResolutionInput,
  resolvedInput: ResolvedCostReductionEffectInput = {},
): void {
  const amount = resolveCostReductionAmount(effect, resolvedInput.reductionAmount);
  if (amount <= 0) {
    return;
  }

  const currentTurn = ctx.framework.state.status.turn ?? 1;
  const expiresAtTurn = resolveTemporaryEffectExpiryTurn(currentTurn, effect.duration);
  const consumeOnUse = effect.duration === "next-play-this-turn";
  const normalizedCardType = normalizeCardType(effect.cardType);
  const normalizedClassification = effect.classification;

  const targetPlayerIds = resolveTargetPlayerIds(
    ctx,
    cardPlayed,
    effect.target,
    _resolutionInput.targets,
  );
  const recipients = targetPlayerIds.length > 0 ? targetPlayerIds : [cardPlayed.playerId];
  const reductionsByPlayer =
    ctx.G.turnMetadata.pendingCostReductionsByPlayer ??
    (ctx.G.turnMetadata.pendingCostReductionsByPlayer = {});

  for (const recipientId of recipients) {
    const playerId = recipientId as PlayerId;
    const playerReductions = reductionsByPlayer[playerId] ?? [];
    playerReductions.push({
      amount,
      sourceId: cardPlayed.cardId,
      cardType: normalizedCardType,
      classification: normalizedClassification,
      consumeOnUse,
      expiresAtTurn,
    });
    reductionsByPlayer[playerId] = playerReductions;
  }
}
