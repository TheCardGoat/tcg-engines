import type { CardInstanceId, PlayerId } from "#core";
import type { LorcanaCardMeta } from "../types";
import { moveCardOutOfPlayWithStack } from "../runtime-moves/state/shift-stack";
import {
  emitTriggeredLorcanaEvent,
  snapshotTriggeredCandidatesForCard,
} from "../runtime-moves/effects/triggered-abilities";
import { getKeywordsBeforeBanish } from "../runtime-moves/shared/banish-snapshot";

type Ctx = Parameters<typeof moveCardOutOfPlayWithStack>[0] &
  Parameters<typeof emitTriggeredLorcanaEvent>[0] & {
    cards: {
      require: (id: CardInstanceId) => { meta?: Record<string, unknown> };
    };
  };

/**
 * Standardizes the "banish a card as part of an activated-ability cost" flow:
 * snapshot keywords + trigger candidates, move card out of play, then emit
 * `cardBanished` + a `banish` triggered-event. Mirrors the original three
 * inline copies in activate-ability.ts (banish-item, banish-character,
 * banish-self) so payloads remain byte-identical.
 *
 * Pass `strengthBeforeBanish` when banishing a character (the snapshot is used
 * by triggers like Sudden Chill).
 */
export function banishAsAbilityCost(
  ctx: Ctx,
  params: {
    cardId: CardInstanceId;
    sourceId: CardInstanceId;
    playerId: PlayerId;
    strengthBeforeBanish?: number;
  },
): void {
  const { cardId, sourceId, playerId, strengthBeforeBanish } = params;
  const meta = (ctx.cards.require(cardId).meta ?? {}) as LorcanaCardMeta;
  const subjectAtLocationId = meta.atLocationId as CardInstanceId | undefined;
  const keywordsBeforeBanish = getKeywordsBeforeBanish(ctx, cardId, playerId);
  const triggerCandidates = snapshotTriggeredCandidatesForCard(ctx, cardId);

  moveCardOutOfPlayWithStack(ctx, cardId, {
    zone: "discard",
    playerId,
  });

  const snapshot: Record<string, unknown> = {
    keywordsBeforeBanish,
    subjectAtLocationId,
  };
  if (strengthBeforeBanish !== undefined) {
    snapshot.strengthBeforeBanish = strengthBeforeBanish;
  }

  emitTriggeredLorcanaEvent(
    ctx,
    "cardBanished",
    {
      cardId,
      sourceId,
      snapshot,
      reason: "activated ability cost",
    },
    {
      event: "banish",
      playerId,
      subjectCardId: cardId,
      triggerSourceCardId: cardId,
      triggerCandidates,
      eventSnapshot: snapshot,
    },
  );
}
