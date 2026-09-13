import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { galesMare } from "../../RDO/allies/gales-mare.ts";
import { shuFrontliner } from "./shu-frontliner.ts";

/** @covers uhaao91ee1-a2 */
describe("Shu Frontliner — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: shuFrontliner });
});

/** @covers uhaao91ee1-a1 */
describe("Shu Frontliner — Equestrian activation discount", () => {
  for (const horse of [false, true]) {
    it(`requires ${horse ? 1 : 2} reserve while a Horse ally is ${horse ? "present" : "absent"}`, () => {
      const champion = createClassBonusTestChampion(shuFrontliner, false, "activation-discount");
      const cost = horse ? 1 : 2;
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [shuFrontliner, woodlandSquirrels, woodlandSquirrels],
            field: horse ? [galesMare] : [],
          },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      const payment = player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, cost)
        .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
      if (cost > 0) {
        const before = game.state;
        expect(() =>
          player.activate(shuFrontliner, { reservePayment: payment.slice(0, cost - 1) }),
        ).toThrow();
        expect(game.state).toEqual(before);
      }
      player.activate(shuFrontliner, { reservePayment: payment });
      player.pass();
      game.player("player-two").pass();
      expect(player.cards(shuFrontliner, { zone: "field" })).toHaveLength(1);
    });
  }
});
