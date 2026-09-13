import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";

import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion, grandArchiveTestFace } from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";

/** Card-resolution "Draw a card" / "Draw a card into your memory" with Class Bonus disabled. */
export function proveDrawCardResolution({
  card,
  destination = "hand",
}: {
  readonly card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  readonly destination?: "hand" | "memory";
}): void {
  const face = grandArchiveTestFace(card);
  if (face.cost.kind !== "reserve" || typeof face.cost.amount !== "number") {
    throw new Error(`${face.name} must have a fixed reserve cost.`);
  }
  const reserveCost = face.cost.amount;

  it(`draws exactly one card into ${destination} only as the activation resolves`, () => {
    const champion = createClassBonusTestChampion(card, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [card, ...Array.from({ length: reserveCost }, () => woodlandSquirrels)],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: {
        champion,
        zones: { "main-deck": [woodlandSquirrels] },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const payment = player
      .cards(woodlandSquirrels, { zone: "hand" })
      .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
    const deck = player.zone("main-deck");
    const opponentDeck = opponent.zone("main-deck");
    player.activate(card, { reservePayment: payment });
    expect(player.zone("hand")).toHaveLength(0);
    expect(player.zone("memory")).toHaveLength(reserveCost);
    expect(player.zone("main-deck")).toEqual(deck);
    passEffectsStack(game);
    if (destination === "memory") {
      expect(player.zone("memory")).toHaveLength(reserveCost + 1);
      expect(player.zone("memory")).toContainEqual(deck[0]);
      expect(player.zone("hand")).toHaveLength(0);
    } else {
      expect(player.zone("hand")).toEqual([deck[0]!]);
      expect(player.zone("memory")).toHaveLength(reserveCost);
    }
    expect(player.zone("main-deck")).toEqual(deck.slice(1));
    expect(opponent.zone("main-deck")).toEqual(opponentDeck);
    expect(opponent.zone("hand")).toHaveLength(0);
  });
}
