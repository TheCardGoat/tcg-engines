import type { PlayerId } from "#core";
import type { ExertEffect } from "@tcg/lorcana-types";
import type { CardPlayedPayload } from "../../../types";
import type { ActionResolutionInput, PlayCardExecutionContext } from "./types";
import {
  normalizeSelectedTargets,
  normalizeTargetDescriptor,
  resolveCandidateTargets,
  selectTargets,
} from "../../../targeting/runtime";
import { emitTriggeredLorcanaEvent } from "../../effects/triggered-abilities";
import { markLastEffectPerformed } from "./event-snapshot-utils";

export function isExertEffect(effect: unknown): effect is ExertEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "exert"
  );
}

export function resolveExertEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: ExertEffect,
  resolutionInput: ActionResolutionInput,
): void {
  const descriptor = normalizeTargetDescriptor(effect.target);
  const selectedTargets = normalizeSelectedTargets(resolutionInput.targets);
  const candidates = resolveCandidateTargets(ctx, cardPlayed, descriptor, {
    eventSnapshot: resolutionInput.eventSnapshot,
    selectedTargets,
    sourceCardId: cardPlayed.cardId,
  });
  const targets = selectTargets(candidates, descriptor, selectedTargets);

  let exertedAny = false;

  for (const targetId of targets) {
    if (ctx.cards.require(targetId).meta?.state === "exerted") {
      continue;
    }

    ctx.cards.patchMeta(targetId, { state: "exerted" });
    exertedAny = true;
    emitTriggeredLorcanaEvent(
      ctx,
      "cardExerted",
      {
        cardId: targetId,
        source: "effect",
      },
      {
        event: "exert",
        subjectCardId: targetId,
        triggerSourceCardId: cardPlayed.cardId,
        playerId: ctx.framework.zones.getCardOwner(targetId) as PlayerId | undefined,
      },
    );

    // Record the first exerted target's cost in the event snapshot so subsequent
    // effects (e.g. "play a song with cost ≤ exerted character's cost") can reference it.
    if (resolutionInput.eventSnapshot) {
      if (!resolutionInput.eventSnapshot.chosenCardId) {
        resolutionInput.eventSnapshot.chosenCardId = targetId;
      }
      if (resolutionInput.eventSnapshot.chosenCardCost === undefined) {
        const chosenDefinition = ctx.cards.getDefinition(targetId) as
          | { cost?: unknown }
          | undefined;
        const targetCost =
          typeof chosenDefinition?.cost === "number" ? chosenDefinition.cost : undefined;
        if (typeof targetCost === "number") {
          resolutionInput.eventSnapshot.chosenCardCost = targetCost;
        }
      }
    }
  }

  markLastEffectPerformed(resolutionInput.eventSnapshot, exertedAny);
}
