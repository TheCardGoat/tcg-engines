import type { CardInstanceId, PlayerId } from "#core";
import type { RevealTopsHighestCostToHandEffect } from "@tcg/lorcana-types";
import type { CardPlayedPayload } from "../../../types/index";
import { createLorcanaLogProjection } from "../../../types/index";
import type { PlayCardExecutionContext } from "./types";

export function isRevealTopsHighestCostToHandEffect(
  effect: unknown,
): effect is RevealTopsHighestCostToHandEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "reveal-tops-highest-cost-to-hand"
  );
}

export function resolveRevealTopsHighestCostToHandEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  _effect: RevealTopsHighestCostToHandEffect,
  _resolutionInput: unknown,
): void {
  const playerIds = [...ctx.framework.state.playerIds];

  // 1. Take and reveal each player's top card.
  const revealed: { playerId: PlayerId; cardId: CardInstanceId; cost: number }[] = [];
  for (const playerId of playerIds) {
    const deck = ctx.framework.zones.getCards({ zone: "deck", playerId }) as CardInstanceId[];
    const top = deck[deck.length - 1];
    if (!top) continue;
    if (typeof ctx.framework.zones.reveal === "function") {
      ctx.framework.zones.reveal([top], [...playerIds]);
    }
    const def = ctx.cards.getDefinition(top) as { cost?: number } | undefined;
    revealed.push({ playerId, cardId: top, cost: Number(def?.cost ?? 0) });
  }
  if (revealed.length === 0) {
    return;
  }

  // 2. Highest cost among the revealed cards (ties all route to hand).
  const highest = Math.max(...revealed.map((entry) => entry.cost));
  const winners = revealed.filter((entry) => entry.cost === highest);

  // 3. Winners to their player's hand; the rest to the bottom of their decks
  // (index 0 = bottom, matching put-on-bottom semantics).
  for (const entry of revealed) {
    const isWinner = winners.some(
      (w) => w.cardId === entry.cardId && w.playerId === entry.playerId,
    );
    if (isWinner) {
      ctx.framework.zones.moveCard(entry.cardId, {
        zone: "hand",
        playerId: entry.playerId,
      });
      ctx.framework.log(
        createLorcanaLogProjection(
          "lorcana.outcome.revealedCardToHand",
          {
            playerId: cardPlayed.playerId,
            targetPlayerId: entry.playerId,
            revealedCardId: entry.cardId,
          },
          { mode: "PUBLIC" },
          "action",
        ),
      );
    } else {
      ctx.framework.zones.moveCard(
        entry.cardId,
        { zone: "deck", playerId: entry.playerId },
        { index: 0 },
      );
      ctx.framework.log(
        createLorcanaLogProjection(
          "lorcana.effect.resolve.revealTopCard.autoBottom",
          {
            playerId: cardPlayed.playerId,
            targetPlayerId: entry.playerId,
            revealedCardId: entry.cardId,
          },
          { mode: "PUBLIC" },
          "action",
        ),
      );
    }
  }
}
