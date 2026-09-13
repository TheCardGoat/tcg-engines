import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { enchainingGale } from "./enchaining-gale.ts";
import { galestreamInsight } from "./galestream-insight.ts";

/** @covers usa6qyq3ka-a1 */
describe("galestream-insight — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: galestreamInsight, discount: 1 });
});

/** @covers usa6qyq3ka-a2 @covers usa6qyq3ka-a3 */
describe("Galestream Insight — Memory discount and selection", () => {
  it("costs one less at Memory 4 and puts a looked-at Spell into memory", () => {
    const champion = createClassBonusTestChampion(galestreamInsight, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          memory: Array.from({ length: 4 }, () => woodlandSquirrels),
          hand: [galestreamInsight, ...Array.from({ length: 3 }, () => woodlandSquirrels)],
          "main-deck": [enchainingGale, ...Array.from({ length: 5 }, () => woodlandSquirrels)],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const chosen = player.card(enchainingGale, { zone: "main-deck" });
    const originalDeck = player.zone("main-deck");
    player.activate(galestreamInsight, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card", cardId: card.objectId })),
    });
    passEffectsStack(game);
    answerDecision(game, "resolve-effect-choice", [chosen.objectId]);
    passEffectsStack(game);
    const remainder = originalDeck.filter((card) => card.objectId !== chosen.objectId);
    answerDecision(
      game,
      "resolve-effect-choice",
      remainder.map((card) => card.objectId),
    );
    passEffectsStack(game);
    expect(player.zone("memory")).toContainEqual(chosen);
    expect(player.zone("main-deck")).toEqual(remainder);
  });
});
