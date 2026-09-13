import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { tidalLock } from "./tidal-lock.ts";

function setup(waterInGraveyard: number) {
  const champion = createClassBonusTestChampion(tidalLock, false, "activation-discount");
  return GrandArchiveTestEngine.startFixture({
    firstPlayer: "playerTwo",
    playerOne: {
      champion,
      zones: {
        hand: [tidalLock, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        graveyard: Array.from({ length: waterInGraveyard }, () => giantTortoise),
      },
    },
    playerTwo: {
      champion,
      zones: { hand: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels] },
    },
  });
}

/** @covers c4poa10ezw-a1 */
describe("Tidal Lock — water graveyard discount", () => {
  for (const water of [2, 3]) {
    it(`${water >= 3 ? "costs 1" : "costs 3"} with ${water} water cards in graveyard`, () => {
      const cost = water >= 3 ? 1 : 3;
      const game = setup(water);
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      opponent.activate(opponent.cards(woodlandSquirrels, { zone: "hand" })[0]!);
      opponent.pass();
      const stackItem = game.state.stack.at(-1);
      if (!stackItem) throw new Error("Expected an activation on the stack");
      const payment = player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, cost)
        .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
      const before = game.state;
      expect(() =>
        player.activate(tidalLock, {
          reservePayment: payment.slice(0, cost - 1),
          targets: { "target-stack-item": [stackItem.id] },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
      player.activate(tidalLock, {
        reservePayment: payment,
        targets: { "target-stack-item": [stackItem.id] },
      });
      expect(player.zone("memory")).toHaveLength(cost);
    });
  }
});

/** @covers c4poa10ezw-a2 */
describe("Tidal Lock — negate unless paid, then banish", () => {
  it("banishes the negated activation and leaves it if the cost is paid", () => {
    for (const pay of [false, true]) {
      const game = setup(3);
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      opponent.activate(opponent.cards(woodlandSquirrels, { zone: "hand" })[0]!);
      opponent.pass();
      const squirrel = opponent.cards(woodlandSquirrels, { zone: "effects-stack" })[0]!;
      const stackItem = game.state.stack.at(-1);
      if (!stackItem) throw new Error("Expected an activation on the stack");
      player.activate(tidalLock, {
        reservePayment: [
          { kind: "card", cardId: player.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
        ],
        targets: { "target-stack-item": [stackItem.id] },
      });
      passEffectsStack(game);
      expect(game.state.decision?.kind).toBe("resolve-effect-payment");
      if (pay) {
        answerDecision(game, "resolve-effect-payment", {
          reservePayment: opponent
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 2)
            .map((card) => ({
              kind: "card" as const,
              cardId: card.objectId,
            })),
        });
        passEffectsStack(game);
        expect(game.state.objects[squirrel.objectId]!.zone).toBe("field");
      } else {
        answerDecision(game, "resolve-effect-payment", false);
        passEffectsStack(game);
        expect(game.state.objects[squirrel.objectId]!.zone).toBe("banishment");
      }
    }
  });
});
