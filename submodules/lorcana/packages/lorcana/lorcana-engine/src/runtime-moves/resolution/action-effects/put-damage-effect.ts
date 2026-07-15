import type { CardInstanceId } from "#core";
import type { PutDamageEffect } from "@tcg/lorcana-types";
import type { CardPlayedPayload } from "../../../types";
import type { PlayCardExecutionContext } from "./types";
import { resolvePutDamageLikeEffect } from "./deal-damage-effect";

type ResolvedPutDamageEffectInput = {
  targets: CardInstanceId[];
  amountByTarget?: Record<CardInstanceId, number>;
};

export function isPutDamageEffect(effect: unknown): effect is PutDamageEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "put-damage"
  );
}

export function resolvePutDamageEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  _effect: PutDamageEffect,
  resolvedInput: ResolvedPutDamageEffectInput,
): void {
  resolvePutDamageLikeEffect(ctx, cardPlayed, {
    amountByTarget: resolvedInput.amountByTarget,
    targets: resolvedInput.targets,
  });
}
