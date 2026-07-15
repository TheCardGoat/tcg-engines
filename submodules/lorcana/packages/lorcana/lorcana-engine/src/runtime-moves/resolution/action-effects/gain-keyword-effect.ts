import type { PlayerId } from "#core";
import type { GainKeywordEffect } from "@tcg/lorcana-types";
import type { CardPlayedPayload } from "../../../types";
import type { LorcanaCardMeta } from "../../../types";
import { addTemporaryKeyword, resolveTemporaryEffectWindow } from "../../effects/temporary-effects";
import type { ActionResolutionInput, PlayCardExecutionContext } from "./types";
import { resolveEffectTargets } from "../../../targeting/runtime";
import { getEffectTargetSelectionInput } from "./selection-state";

export function isGainKeywordEffect(effect: unknown): effect is GainKeywordEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "gain-keyword"
  );
}

export function resolveGainKeywordEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: GainKeywordEffect,
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
  const keywordValue =
    typeof effect.value === "number" && Number.isFinite(effect.value) && effect.value > 0
      ? effect.value
      : undefined;

  const isWhileInPlay = effect.duration === "while-in-play";

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
    const payload = {
      type: "gain-keyword",
      sourceId: cardPlayed.cardId,
      duration: effect.duration,
      ...(isWhileInPlay ? { activeWhileSourceInPlay: true } : {}),
    };
    ctx.cards.patchMeta(
      targetId,
      addTemporaryKeyword(currentMeta, keyword, expiresAtTurn, keywordValue, startsAtTurn, payload),
    );
  }
}
