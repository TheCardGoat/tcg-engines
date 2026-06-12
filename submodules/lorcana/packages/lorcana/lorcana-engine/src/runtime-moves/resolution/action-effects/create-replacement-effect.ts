import type { CreateReplacementEffect } from "@tcg/lorcana-types";
import type { CardPlayedPayload } from "../../../types";
import type { ActionResolutionInput, PlayCardExecutionContext } from "./types";
import { registerReplacementEffect } from "../../effects/replacement-effects";

export function isCreateReplacementEffect(effect: unknown): effect is CreateReplacementEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "create-replacement-effect"
  );
}

export function resolveCreateReplacementEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: CreateReplacementEffect,
  resolutionInput: ActionResolutionInput,
): void {
  registerReplacementEffect(ctx, cardPlayed, effect.replacement, effect.duration, resolutionInput);
}
