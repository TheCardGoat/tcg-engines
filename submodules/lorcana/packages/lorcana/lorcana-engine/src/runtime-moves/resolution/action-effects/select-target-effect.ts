import type { SelectTargetEffect } from "@tcg/lorcana-types";
import type { CardPlayedPayload } from "../../../types";
import type { ActionResolutionInput, PlayCardExecutionContext } from "./types";
import { resolveEffectTargets } from "../../../targeting/runtime";
import { resolveTargetPlayerIds } from "./player-target-resolver";
import { markLastEffectPerformed } from "./event-snapshot-utils";
import { getEffectTargetSelectionInput } from "./selection-state";

export function isSelectTargetEffect(effect: unknown): effect is SelectTargetEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "select-target"
  );
}

export function resolveSelectTargetEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: SelectTargetEffect,
  resolutionInput: ActionResolutionInput,
): void {
  const selectionInput = getEffectTargetSelectionInput(effect.target, resolutionInput);
  const selectedCards =
    resolveEffectTargets(
      ctx,
      cardPlayed,
      effect.target,
      selectionInput,
      resolutionInput.eventSnapshot,
    ) ?? [];
  const selectedPlayers = resolveTargetPlayerIds(
    ctx,
    cardPlayed,
    effect.target,
    selectionInput,
    resolutionInput.eventSnapshot,
  );

  markLastEffectPerformed(
    resolutionInput.eventSnapshot,
    selectedCards.length > 0 || selectedPlayers.length > 0,
  );
}
