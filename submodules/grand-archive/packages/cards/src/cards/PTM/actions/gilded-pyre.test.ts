import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { exquisiteDessert } from "../../PRD/items/exquisite-dessert.ts";
import { gildedPyre } from "./gilded-pyre.ts";

/** @covers eAoEELWtHi-a1 */
describe("Gilded Pyre — buff-dependent damage", () => {
  for (const matching of [false, true])
    for (const own of [false, true])
      for (const buffs of [0, 1, 2])
        for (const response of buffs ? [false, true] : [false]) {
          it(`class=${matching}, own=${own}, buffs=${buffs}, response=${response}`, () => {
            const champion = enableAllTestElements(
              createClassBonusTestChampion(gildedPyre, matching, "activation-discount"),
            );
            const game = GrandArchiveTestEngine.startFixture({
              playerOne: {
                champion,
                zones: {
                  field: [giantTortoise, exquisiteDessert, exquisiteDessert],
                  hand: [gildedPyre, ...Array.from({ length: 5 }, () => woodlandSquirrels)],
                },
              },
              playerTwo: { champion, zones: { field: [giantTortoise] } },
            });
            const p = game.player("player-one"),
              q = game.player("player-two"),
              target = (own ? p : q).card(giantTortoise),
              other = (own ? q : p).card(giantTortoise);
            const pay = (amount: number) =>
              p
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, amount)
                .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
            const buff = () => {
              p.activateAbility(p.cards(exquisiteDessert, { zone: "field" })[0]!, "5HPvGPjsD9-a2", {
                targets: { "target-1": [target.objectId] },
                reservePayment: pay(1),
              });
            };
            if (!response)
              for (let n = 0; n < buffs; n++) {
                buff();
                passEffectsStack(game);
              }
            const before = game.state;
            expect(() =>
              p.activate(gildedPyre, {
                targets: {
                  "target-1": [
                    p.cards(exquisiteDessert, { zone: "field" })[0]?.objectId ??
                      p.card(gildedPyre).objectId,
                  ],
                },
                reservePayment: pay(2),
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
            p.activate(gildedPyre, {
              targets: { "target-1": [target.objectId] },
              reservePayment: pay(2),
            });
            expect(game.state.objects[target.objectId]!.damage).toBe(0);
            if (response) for (let n = 0; n < buffs; n++) buff();
            passEffectsStack(game);
            expect(game.state.objects[target.objectId]!.damage).toBe(buffs ? 4 : 2);
            expect(game.state.objects[target.objectId]!.counters.buff ?? 0).toBe(buffs);
            expect(game.state.objects[other.objectId]!.damage).toBe(0);
          });
        }
  for (const own of [false, true])
    it(`deals two to an unbuffed champion, own=${own}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(gildedPyre, false, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: { hand: [gildedPyre, woodlandSquirrels, woodlandSquirrels] },
        },
        playerTwo: { champion },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        target = (own ? p : q).card(champion);
      p.activate(gildedPyre, {
        targets: { "target-1": [target.objectId] },
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card", cardId: c.objectId })),
      });
      passEffectsStack(game);
      expect(game.state.objects[target.objectId]!.damage).toBe(2);
    });
});
