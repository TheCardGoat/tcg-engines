import type { LorcanaCard } from "@tcg/lorcana-types";
import {
  type ActionResolutionInput,
  type CardPlayedPayload,
  type PlayCardExecutionContext,
} from "./action-effects/types";
import { resolveActionEffect } from "./action-effects/composed-effect-resolver";
import { evaluateActionCondition } from "./action-effects/action-condition-evaluator";
import { resolveRecordedVanishTargets } from "./action-effects/vanish";
import { emitBeChosenEvents } from "../effects/be-chosen";
import { createLorcanaLogProjection } from "../../types";

export function resolveActionCardEffects(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  actionCard: Extract<LorcanaCard, { cardType: "action" }>,
  resolutionInput: ActionResolutionInput = {},
): void {
  if (actionCard.missingImplementation === true) {
    return;
  }

  // Emit be-chosen events for all pre-determined targets of this action
  emitBeChosenEvents(ctx, cardPlayed, resolutionInput);

  const effectiveResolutionInput = resolutionInput.eventSnapshot
    ? resolutionInput
    : { ...resolutionInput, eventSnapshot: {} };

  for (const ability of actionCard.abilities ?? []) {
    if (ability.type !== "action") {
      continue;
    }
    if (
      ability.condition &&
      !evaluateActionCondition(ability.condition, ctx, cardPlayed, effectiveResolutionInput)
    ) {
      continue;
    }
    const result = resolveActionEffect(ctx, cardPlayed, ability.effect, effectiveResolutionInput, {
      allowPromptForExistingChosenTargets: true,
    });
    if (result.status === "suspended") {
      return;
    }
    // A mandatory single chosen banishment can legally complete with no
    // candidates. Explain that no-op using the existing public effect log.
    // Successful and deferred selections keep their normal resolution logs.
    if (
      ability.effect.type === "banish" &&
      typeof ability.effect.target === "object" &&
      ability.effect.target !== null &&
      "selector" in ability.effect.target &&
      ability.effect.target.selector === "chosen" &&
      ability.effect.target.count === 1 &&
      effectiveResolutionInput.eventSnapshot?.lastEffectPerformed === false
    ) {
      ctx.framework.log(
        createLorcanaLogProjection(
          "lorcana.effect.cancelled",
          {
            playerId: cardPlayed.playerId,
            sourceCardId: cardPlayed.cardId,
            cause: "no-valid-targets",
          },
          { mode: "PUBLIC" },
          "action",
        ),
      );
    }
    resolveRecordedVanishTargets(ctx, cardPlayed, effectiveResolutionInput);
  }
}
