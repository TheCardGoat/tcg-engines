import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "./woodland-squirrels.ts";
import { blackmarketBroker } from "./blackmarket-broker.ts";
/** @covers hHVf5xyjob-a1 @covers hHVf5xyjob-a2 */
describe("Blackmarket Broker preparation and stealth", () => {
  it("adds one preparation on each entry and gains stealth at exactly three counters", () => {
    const champion = createClassBonusTestChampion(blackmarketBroker, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [
            blackmarketBroker,
            blackmarketBroker,
            blackmarketBroker,
            ...Array.from({ length: 12 }, () => woodlandSquirrels),
          ],
          "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion,
        zones: {
          field: [woodlandSquirrels],
          "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
        },
      },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      championId = p.card(champion).objectId;
    for (const expected of [1, 2, 3]) {
      const card = p.cards(blackmarketBroker, { zone: "hand" })[0]!;
      p.activate(card, {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 4)
          .map((c) => ({ kind: "card", cardId: c.objectId })),
      });
      expect(game.state.objects[championId]!.counters.preparation ?? 0).toBe(expected - 1);
      passEffectsStack(game);
      expect(game.state.objects[championId]!.counters.preparation).toBe(expected);
      advanceToMain(game, q.id);
      if (expected < 3) {
        q.declareAttack(woodlandSquirrels, card);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[card.objectId]!.damage).toBe(1);
      } else {
        const before = game.state;
        expect(() => q.declareAttack(woodlandSquirrels, card)).toThrow();
        expect(game.state).toEqual(before);
      }
      advanceToMain(game, p.id);
    }
    expect(game.state.objects[q.card(champion).objectId]!.counters.preparation ?? 0).toBe(0);
  });
});
