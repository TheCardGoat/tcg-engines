import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { naturesInsight } from "./natures-insight.ts";

/** @covers 3bS1Y9OQrF-a1 */
describe("Nature's Insight — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: naturesInsight, discount: 2 });
});

/** @covers 3bS1Y9OQrF-a2 */
describe("Nature's Insight — preserve a memory card and X deck cards", () => {
  it("uses the revealed memory card's reserve cost as X and preserves that many deck cards", () => {
    const champion = createClassBonusTestChampion(naturesInsight, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [naturesInsight, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          memory: [giantTortoise],
          "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
        },
      },
      playerTwo: { champion, zones: { memory: [giantTortoise] } },
    });
    const player = game.player("player-one");
    const revealed = player.card(giantTortoise, { zone: "memory" });
    player.activate(naturesInsight, {
      reservePayment: player.cards(woodlandSquirrels, { zone: "hand" }).map((card) => ({
        kind: "card" as const,
        cardId: card.objectId,
      })),
    });
    passEffectsStack(game);
    const beforeInvalid = game.state;
    expect(() =>
      answerDecision(game, "resolve-effect-choice", [
        game.player("player-two").card(giantTortoise, { zone: "memory" }).objectId,
      ]),
    ).toThrow();
    expect(game.state).toEqual(beforeInvalid);
    const deck = player.zone("main-deck");
    answerDecision(game, "resolve-effect-choice", [revealed.objectId]);
    passEffectsStack(game);
    if (game.state.decision?.kind === "resolve-effect-choice") {
      answerDecision(game, "resolve-effect-choice", [revealed.objectId]);
      passEffectsStack(game);
    }
    expect(game.state.objects[revealed.objectId]!.zone).toBe("material-deck");
    expect(game.state.objects[revealed.objectId]!.states.has("preserved")).toBe(true);
    for (const card of deck.slice(0, 4)) {
      expect(game.state.objects[card.objectId]!.zone).toBe("material-deck");
      expect(game.state.objects[card.objectId]!.states.has("preserved")).toBe(true);
    }
    expect(player.zone("main-deck")).toEqual(deck.slice(4));
  });
});
