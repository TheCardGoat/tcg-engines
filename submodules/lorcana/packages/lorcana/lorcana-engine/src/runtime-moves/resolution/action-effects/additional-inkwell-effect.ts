import type { AdditionalInkwellEffect } from "@tcg/lorcana-types";
import type { CardPlayedPayload } from "../../../types";
import type { PlayCardExecutionContext } from "./types";

export function isAdditionalInkwellEffect(effect: unknown): effect is AdditionalInkwellEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "additional-inkwell"
  );
}

export function resolveAdditionalInkwellEffect(
  ctx: PlayCardExecutionContext,
  _cardPlayed: CardPlayedPayload,
  effect: AdditionalInkwellEffect,
): void {
  const amount =
    typeof effect.amount === "number" && Number.isFinite(effect.amount)
      ? Math.max(0, Math.floor(effect.amount))
      : 1;

  ctx.G.turnMetadata.additionalInkwellActions =
    (ctx.G.turnMetadata.additionalInkwellActions ?? 0) + amount;
}
