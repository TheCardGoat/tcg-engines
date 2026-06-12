import type { CardInstanceId, PlayerId } from "#core";
import { emitTriggeredLorcanaEvent } from "../runtime-moves/effects/triggered-abilities";

type ExertCtx = Parameters<typeof emitTriggeredLorcanaEvent>[0] & {
  cards: { patchMeta: (id: CardInstanceId, patch: Record<string, unknown>) => void };
  framework: { zones: { getCardOwner: (id: CardInstanceId) => string | undefined } };
};

/**
 * Sets a card's `state` meta to `"exerted"`. Pass `emitEvent: true` (with a
 * `source` describing what caused the exert) to also emit the standard
 * `cardExerted` triggered event used by activated-ability cost payment.
 *
 * The plain (no-event) form is used by challenge.ts and quest.ts where the
 * surrounding move emits its own composite event.
 */
export function exertCard(
  ctx: ExertCtx,
  cardId: CardInstanceId,
  options:
    | { emitEvent?: false }
    | { emitEvent: true; source: string; triggerSourceCardId?: CardInstanceId } = {},
): void {
  ctx.cards.patchMeta(cardId, { state: "exerted" });

  if ("emitEvent" in options && options.emitEvent) {
    emitTriggeredLorcanaEvent(
      ctx,
      "cardExerted",
      { cardId, source: options.source },
      {
        event: "exert",
        subjectCardId: cardId,
        triggerSourceCardId: options.triggerSourceCardId ?? cardId,
        playerId: ctx.framework.zones.getCardOwner(cardId) as PlayerId | undefined,
      },
    );
  }
}
