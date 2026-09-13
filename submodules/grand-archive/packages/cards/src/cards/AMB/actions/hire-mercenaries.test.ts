import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { galesMare } from "../../RDO/allies/gales-mare.ts";
import { hireMercenaries } from "./hire-mercenaries.ts";

function setup(opponentHasAlly: boolean) {
  const champion = createClassBonusTestChampion(hireMercenaries, false, "activation-discount");
  return GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: {
        hand: [hireMercenaries, woodlandSquirrels, woodlandSquirrels],
        field: [galesMare],
        "main-deck": [woodlandSquirrels, galesMare, woodlandSquirrels],
      },
    },
    playerTwo: {
      champion,
      zones: opponentHasAlly ? { field: [woodlandSquirrels] } : undefined,
    },
  });
}

/** @covers 8swok9u930-a1 */
describe("Hire Mercenaries — opposing-ally discount", () => {
  for (const opponentHasAlly of [false, true]) {
    it(`${opponentHasAlly ? "costs 1" : "costs 2"} when the opponent ${opponentHasAlly ? "controls" : "controls no"} allies`, () => {
      const cost = opponentHasAlly ? 1 : 2;
      const game = setup(opponentHasAlly);
      const player = game.player("player-one");
      const payment = player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, cost)
        .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
      const before = game.state;
      expect(() =>
        player.activate(hireMercenaries, { reservePayment: payment.slice(0, cost - 1) }),
      ).toThrow();
      expect(game.state).toEqual(before);
      player.activate(hireMercenaries, { reservePayment: payment });
      expect(player.zone("memory")).toHaveLength(cost);
    });
  }
});

/** @covers 8swok9u930-a2 */
describe("Hire Mercenaries — look at the top two", () => {
  it("puts one looked-at card into memory and the other on the bottom", () => {
    const game = setup(true);
    const player = game.player("player-one");
    const deck = player.zone("main-deck");
    player.activate(hireMercenaries, {
      reservePayment: [
        {
          kind: "card",
          cardId: player.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId,
        },
      ],
    });
    passEffectsStack(game);
    const beforeInvalid = game.state;
    expect(() => answerDecision(game, "resolve-effect-choice", [deck[2]!.objectId])).toThrow();
    expect(game.state).toEqual(beforeInvalid);
    answerDecision(game, "resolve-effect-choice", [deck[1]!.objectId]);
    passEffectsStack(game);
    expect(player.zone("memory")).toContainEqual(deck[1]);
    expect(player.zone("main-deck")[player.zone("main-deck").length - 1]).toEqual(deck[0]);
  });
});
