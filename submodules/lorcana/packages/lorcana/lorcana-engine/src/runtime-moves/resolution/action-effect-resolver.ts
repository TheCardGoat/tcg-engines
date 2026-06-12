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
    resolveRecordedVanishTargets(ctx, cardPlayed, effectiveResolutionInput);
  }
}
