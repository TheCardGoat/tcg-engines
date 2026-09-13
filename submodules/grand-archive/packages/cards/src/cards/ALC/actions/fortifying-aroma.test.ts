import { describe, expect, it } from "vitest";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "../items/potion-of-healing.ts";
import { springleaf } from "../tokens/springleaf.ts";
import { fortifyingAroma } from "./fortifying-aroma.ts";

/** @covers doo4sk9q9e-a1 @covers doo4sk9q9e-a2 */
describe("Fortifying Aroma — controlled-Herb discount and ally buff", () => {
  for (const herbs of [0, 2, 5]) {
    it(`costs ${5 - herbs} with ${herbs} controlled Herbs and adds two buff counters`, () => {
      const champion = createClassBonusTestChampion(fortifyingAroma, false, "activation-discount");
      const cost = 5 - herbs;
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: Array.from({ length: herbs }, () => springleaf),
            hand: [
              fortifyingAroma,
              giantTortoise,
              ...Array.from({ length: 5 }, () => woodlandSquirrels),
            ],
          },
        },
        playerTwo: {
          champion,
          zones: { field: [giantTortoise, springleaf, springleaf, potionOfHealing] },
        },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const target = opponent.card(giantTortoise, { zone: "field" });
      const payment = player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, cost)
        .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
      if (cost > 0) {
        const before = game.state;
        expect(() =>
          player.activate(fortifyingAroma, {
            reservePayment: payment.slice(1),
            targets: { "target-1": [target.objectId] },
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
      }
      if (herbs === 0) {
        for (const invalid of [
          player.card(champion, { zone: "field" }),
          opponent.card(potionOfHealing, { zone: "field" }),
          player.card(giantTortoise, { zone: "hand" }),
        ]) {
          const before = game.state;
          expect(() =>
            player.activate(fortifyingAroma, {
              reservePayment: payment,
              targets: { "target-1": [invalid.objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
      }

      player.activate(fortifyingAroma, {
        reservePayment: payment,
        targets: { "target-1": [target.objectId] },
      });
      expect(player.zone("memory")).toHaveLength(cost);
      expect(game.state.objects[target.objectId]!.counters.buff ?? 0).toBe(0);
      passEffectsStack(game);

      expect(game.state.objects[target.objectId]!.counters.buff).toBe(2);
      expect(
        deriveGrandArchiveNumericProperty(game.state.objects[target.objectId]!, "power", {
          program: game.program,
          state: game.state,
          controllerId: opponent.id,
          bindings: {},
        }),
      ).toBe(3);
      expect(
        deriveGrandArchiveNumericProperty(game.state.objects[target.objectId]!, "life", {
          program: game.program,
          state: game.state,
          controllerId: opponent.id,
          bindings: {},
        }),
      ).toBe(8);
      expect(opponent.cards(springleaf, { zone: "field" })).toHaveLength(2);
    });
  }
});
