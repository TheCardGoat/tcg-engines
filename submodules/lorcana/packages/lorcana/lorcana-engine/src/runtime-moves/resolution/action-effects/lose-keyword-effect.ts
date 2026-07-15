import type { PlayerId } from "#core";
import type { LoseKeywordEffect } from "@tcg/lorcana-types";
import type { CardPlayedPayload } from "../../../types";
import type { LorcanaCardMeta } from "../../../types";
import {
  addTemporaryLostKeyword,
  resolveTemporaryEffectWindow,
} from "../../effects/temporary-effects";
import type { ActionResolutionInput, PlayCardExecutionContext } from "./types";
import { resolveEffectTargets } from "../../../targeting/runtime";
import { getEffectTargetSelectionInput } from "./selection-state";

export function isLoseKeywordEffect(effect: unknown): effect is LoseKeywordEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "lose-keyword"
  );
}

export function resolveLoseKeywordEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: LoseKeywordEffect,
  resolutionInput: ActionResolutionInput,
): void {
  const keyword =
    typeof effect.keyword === "string" && effect.keyword.trim().length > 0
      ? effect.keyword.trim()
      : undefined;
  if (!keyword) {
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
      effect.duration,
      {
        currentPlayerId,
        targetOwnerId,
      },
    );
    const currentMeta = (ctx.cards.require(targetId).meta ?? {}) as LorcanaCardMeta;
    ctx.cards.patchMeta(
      targetId,
      addTemporaryLostKeyword(currentMeta, keyword, expiresAtTurn, startsAtTurn),
    );
  }
}
