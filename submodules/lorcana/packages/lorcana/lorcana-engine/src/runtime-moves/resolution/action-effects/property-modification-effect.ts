import type { PlayerId } from "#core";
import type { PropertyModificationEffect } from "@tcg/lorcana-types";
import type { CardPlayedPayload } from "../../../types";
import type { LorcanaCardMeta } from "../../../types";
import {
  addTemporaryClassification,
  resolveTemporaryEffectWindow,
} from "../../effects/temporary-effects";
import type { ActionResolutionInput, PlayCardExecutionContext } from "./types";
import { resolveEffectTargets } from "../../../targeting/runtime";
import { getEffectTargetSelectionInput } from "./selection-state";

export function isPropertyModificationEffect(
  effect: unknown,
): effect is PropertyModificationEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "property-modification"
  );
}

export function resolvePropertyModificationEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: PropertyModificationEffect,
  resolutionInput: ActionResolutionInput,
): void {
  if (effect.property !== "classification" || effect.operation !== "add") {
    return;
  }

  const classification =
    typeof effect.value === "string" && effect.value.trim().length > 0
      ? effect.value.trim()
      : undefined;
  if (!classification) {
    return;
  }

  const resolvedTargets =
    resolveEffectTargets(
      ctx,
      cardPlayed,
      effect.target,
      getEffectTargetSelectionInput(effect.target, resolutionInput),
      resolutionInput.eventSnapshot,
    ) ?? [];
  if (resolvedTargets.length === 0) {
    return;
  }

  const currentTurn = ctx.framework.state.status.turn ?? 1;
  const currentPlayerId = ctx.framework.state.currentPlayer;

  for (const targetId of resolvedTargets) {
    const targetOwnerId = ctx.framework.zones.getCardOwner(targetId) as PlayerId | undefined;
    const { startsAtTurn, expiresAtTurn } = resolveTemporaryEffectWindow(
      currentTurn,
      "until-start-of-next-turn",
      {
        currentPlayerId,
        targetOwnerId,
      },
    );
    const currentMeta = (ctx.cards.require(targetId).meta ?? {}) as LorcanaCardMeta;
    ctx.cards.patchMeta(
      targetId,
      addTemporaryClassification(currentMeta, classification, expiresAtTurn, startsAtTurn),
    );
  }
}
