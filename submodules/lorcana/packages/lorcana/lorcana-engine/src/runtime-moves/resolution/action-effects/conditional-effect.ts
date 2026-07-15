import type { ConditionalEffect, Condition } from "@tcg/lorcana-types";
import type { CardPlayedPayload } from "../../../types";
import type {
  ActionEffectResolutionOptions,
  ActionResolutionInput,
  ActionResolutionResult,
  PlayCardExecutionContext,
} from "./types";
import { evaluateActionCondition } from "./action-condition-evaluator";

function isIfYouDoCondition(condition: Condition | undefined): boolean {
  return (
    typeof condition === "object" &&
    condition !== null &&
    "type" in condition &&
    (condition as { type?: unknown }).type === "if-you-do"
  );
}

export function isConditionalEffect(effect: unknown): effect is ConditionalEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "conditional"
  );
}

export function resolveConditionalEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: ConditionalEffect,
  resolutionInput: ActionResolutionInput,
  resolveNestedEffect: (
    ctx: PlayCardExecutionContext,
    cardPlayed: CardPlayedPayload,
    effect: unknown,
    resolutionInput: ActionResolutionInput,
    options?: ActionEffectResolutionOptions,
  ) => ActionResolutionResult,
  options?: ActionEffectResolutionOptions,
): ActionResolutionResult {
  const conditionMet = evaluateActionCondition(effect.condition, ctx, cardPlayed, resolutionInput);
  const thenEffect = effect.then ?? effect.effect ?? effect.ifTrue;
  const elseEffect = effect.else ?? effect.ifFalse;
  const nextEffect = conditionMet ? thenEffect : elseEffect;

  if (nextEffect) {
    // Nested resolution (e.g. play-card) overwrites eventSnapshot.lastEffectPerformed.
    // For "if you do" branches that depend on the prior step's outcome (banish, return-to-hand),
    // restore the snapshot after the branch so chosenCardId / chosenCardCost from that step
    // stay valid for filters like maxCost: { type: "chosen-card-cost", offset: 2 }.
    if (conditionMet && isIfYouDoCondition(effect.condition)) {
      resolutionInput.eventSnapshot ??= {};
      const priorLastEffectPerformed = resolutionInput.eventSnapshot.lastEffectPerformed;
      const result = resolveNestedEffect(ctx, cardPlayed, nextEffect, resolutionInput, options);
      resolutionInput.eventSnapshot.lastEffectPerformed = priorLastEffectPerformed;
      return result;
    }

    return resolveNestedEffect(ctx, cardPlayed, nextEffect, resolutionInput, options);
  }

  return { status: "resolved" };
}
