import type { CardInstanceId } from "#core";
import type { ModifyStatEffect } from "@tcg/lorcana-types";
import type { CardPlayedPayload } from "../../../types";
import {
  addStatModifierEffect,
  cleanupDanglingTargetEffects,
  cleanupExpiredEffects,
} from "../../effects/continuous-effects";
import type { PlayCardExecutionContext } from "./types";

type ResolvedModifyStatEffectInput = {
  targets: CardInstanceId[];
  modifierByTarget?: Record<CardInstanceId, number>;
};

function isSupportedStat(
  value: unknown,
): value is "strength" | "willpower" | "lore" | "singer-threshold" {
  return (
    value === "strength" ||
    value === "willpower" ||
    value === "lore" ||
    value === "singer-threshold"
  );
}

export function isModifyStatEffect(effect: unknown): effect is ModifyStatEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "modify-stat"
  );
}

export function resolveModifyStatEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: ModifyStatEffect,
  resolvedInput: ResolvedModifyStatEffectInput,
): void {
  const stat = effect.stat;
  if (!isSupportedStat(stat)) {
    return;
  }

  const duration = effect.duration ?? "this-turn";
  if (duration !== "this-turn" && duration !== "until-start-of-next-turn") {
    return;
  }

  const targets = resolvedInput.targets;
  if (targets.length === 0) {
    return;
  }

  const currentTurn = ctx.framework.state.status.turn ?? 1;
  cleanupExpiredEffects(ctx, currentTurn);
  cleanupDanglingTargetEffects(ctx);

  for (const targetId of targets) {
    const resolvedModifier = resolvedInput.modifierByTarget?.[targetId];
    const modifier =
      typeof resolvedModifier === "number" && Number.isFinite(resolvedModifier)
        ? resolvedModifier
        : undefined;
    if (modifier === undefined) {
      continue;
    }

    addStatModifierEffect(ctx, {
      sourceId: cardPlayed.cardId,
      targetId,
      controllerId: cardPlayed.playerId,
      stat,
      modifier,
      condition: effect.condition,
      duration,
      currentTurn,
      nonStacking: effect.nonStacking === true,
    });
  }
}
