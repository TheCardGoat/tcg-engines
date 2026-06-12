import type { CardInstanceId, PlayerId } from "#core";
import type { LorcanaCardDefinition } from "@tcg/lorcana-types";
import type { PlayCardExecutionContext } from "../resolution/action-effects/types";
import { attachShiftStack, moveCardOutOfPlayWithStack } from "../state/shift-stack";
import { retargetContinuousEffects } from "../effects/continuous-effects";
import { getEntersWithDamageAmount } from "../resolution/action-effects/play-card-effect";
import { createProjectionState, getEffectiveWillpower } from "../../rules/derived-state";
import { getOrBuildMoveRegistry } from "../rules/move-registry-cache";
import {
  emitTriggeredLorcanaEvent,
  flushTriggeredEventsToBag,
  snapshotTriggeredCandidatesForCard,
} from "../effects/triggered-abilities";
import { recordBanishedCharacterThisTurn } from "../state/turn-metrics";
import { getKeywordsBeforeBanish } from "./banish-snapshot";

export interface ExecuteShiftPlayOptions {
  entersExerted?: boolean;
}

/**
 * Executes the Shift stacking mechanic for a card that has just been moved to
 * the play zone. Handles damage inheritance, enters-play state, and the GSC
 * lethal-damage banish check.
 *
 * Returns `true` when the card was immediately banished by GSC (lethal
 * inherited damage), in which case no "cardPlayed" event should be emitted.
 */
export function executeShiftPlay(
  ctx: PlayCardExecutionContext,
  cardId: CardInstanceId,
  shiftTarget: CardInstanceId,
  playerId: PlayerId,
  cardDef: LorcanaCardDefinition,
  options?: ExecuteShiftPlayOptions,
): boolean {
  const targetMeta = ctx.cards.require(shiftTarget).meta;
  attachShiftStack(ctx, cardId, shiftTarget, playerId, targetMeta);
  retargetContinuousEffects(ctx, shiftTarget, cardId);

  const shiftedMeta = ctx.cards.require(cardId).meta;
  const entersWithDamage = getEntersWithDamageAmount(
    cardDef as Parameters<typeof getEntersWithDamageAmount>[0],
  );
  const inheritedDamage = Number(shiftedMeta?.damage ?? 0) + entersWithDamage;
  ctx.cards.setMeta(cardId, {
    ...shiftedMeta,
    state: options?.entersExerted ? "exerted" : shiftedMeta?.state,
    damage: inheritedDamage,
    playedViaShift: true,
    playedCostType: "shift",
  });

  // GSC: if inherited damage is lethal, banish immediately before triggered
  // abilities resolve (per Lorcana rules §1.8.1.4).
  const derivedState = createProjectionState(ctx.framework.state, ctx.G);
  const registry = getOrBuildMoveRegistry(ctx);
  const getDef = (id: CardInstanceId) =>
    ctx.cards.getDefinition(id) as LorcanaCardDefinition | undefined;
  const effectiveWillpower = getEffectiveWillpower(cardDef, derivedState, cardId, getDef, registry);

  if (effectiveWillpower > 0 && inheritedDamage >= effectiveWillpower) {
    const triggerCandidates = snapshotTriggeredCandidatesForCard(ctx, cardId);
    const keywordsBeforeBanish = getKeywordsBeforeBanish(ctx, cardId, playerId);
    moveCardOutOfPlayWithStack(ctx, cardId, { zone: "discard", playerId });
    emitTriggeredLorcanaEvent(
      ctx,
      "cardBanished",
      {
        cardId,
        sourceId: null,
        snapshot: {
          damageDealt: 0,
          keywordsBeforeBanish,
        },
        reason: "lethal damage",
      },
      {
        event: "banish",
        playerId,
        subjectCardId: cardId,
        triggerSourceCardId: cardId,
        triggerCandidates,
      },
    );
    recordBanishedCharacterThisTurn(ctx, cardId);
    flushTriggeredEventsToBag(ctx);
    return true;
  }

  return false;
}
