import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { dormantSacrificialAltar } from "../domains/dormant-sacrificial-altar.ts";
import { aurousteelGreatsword } from "./aurousteel-greatsword.ts";
import { obeliskOfArmaments } from "./obelisk-of-armaments.ts";

/** @covers wk0pw0y6is-a1 */
describe("Obelisk of Armaments — Domain discount and Greatsword summoning", () => {
  for (const additionalDomains of [0, 2]) {
    it(`pays ${4 - additionalDomains} with ${additionalDomains + 1} controlled Domains`, () => {
      const champion = createClassBonusTestChampion(
        obeliskOfArmaments,
        false,
        "activation-discount",
      );
      const cost = 4 - additionalDomains;
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [
              obeliskOfArmaments,
              ...Array.from({ length: additionalDomains }, () => dormantSacrificialAltar),
            ],
            hand: Array.from({ length: 5 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: { field: [dormantSacrificialAltar, dormantSacrificialAltar] },
        },
        definitions: [aurousteelGreatsword],
      });
      const player = game.player("player-one");
      const source = player.card(obeliskOfArmaments, { zone: "field" });
      const payment = player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, cost)
        .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
      const before = game.state;
      expect(() =>
        player.activateAbility(source, "wk0pw0y6is-a1", {
          reservePayment: payment.slice(1),
        }),
      ).toThrow();
      expect(game.state).toEqual(before);

      player.activateAbility(source, "wk0pw0y6is-a1", { reservePayment: payment });
      expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
      expect(player.cards(aurousteelGreatsword, { zone: "field" })).toHaveLength(0);
      passEffectsStack(game);

      const token = player.card(aurousteelGreatsword, { zone: "field" });
      expect(game.state.objects[token.objectId]!.isToken).toBe(true);
      expect(game.state.objects[token.objectId]!.counters.durability).toBe(1);
      expect(game.state.objects[token.objectId]!.states.has("rested")).toBe(false);
      expect(game.player("player-two").cards(aurousteelGreatsword, { zone: "field" })).toHaveLength(
        0,
      );
    });
  }
});
