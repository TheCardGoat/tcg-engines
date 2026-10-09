import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { seasonsEnd } from "./seasons-end.ts";
import { frostlornCaress } from "./frostlorn-caress.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { createLineageTestChampion } from "../../../testing/champion-lineage.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers ddggqvxw8f-a1
 * @covers ddggqvxw8f-a2 */
describe("Season's End", () => {
  for (const matching of [false, true])
    for (const marked of [0, 1, 2, 3])
      it(`counts wither on both fields and destroys only marked objects, matching=${matching}, marked=${marked}`, () => {
        const champion = enableAllTestElements(
          createLineageTestChampion(seasonsEnd, matching ? "Diao Chan" : "Other"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [giantTortoise, woodlandSquirrels],
              hand: [
                seasonsEnd,
                ...Array.from({ length: marked }, () => frostlornCaress),
                ...Array.from({ length: 25 }, () => woodlandSquirrels),
              ],
            },
          },
          playerTwo: {
            champion,
            zones: { field: [giantTortoise, trainingSword, woodlandSquirrels] },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          objects = [p.card(giantTortoise), q.card(giantTortoise), q.card(trainingSword)];
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
        const caresses = p.cards(frostlornCaress, { zone: "hand" });
        for (let i = 0; i < marked; i++) {
          p.activate(caresses[i]!, {
            reservePayment: pay(matching ? 2 : 5),
            targets: { "target-1": [objects[i]!.objectId] },
          });
          passEffectsStack(game);
          expect(game.state.objects[objects[i]!.objectId]!.counters.wither).toBe(4);
        }
        const cost = matching ? Math.max(0, 10 - marked * 4) : 10,
          before = game.state;
        if (cost) {
          expect(() => p.activate(seasonsEnd, { reservePayment: pay(cost - 1) })).toThrow();
          expect(game.state).toEqual(before);
        }
        const memory = p.zone("memory").length;
        p.activate(seasonsEnd, { reservePayment: pay(cost) });
        expect(p.zone("memory")).toHaveLength(memory + cost);
        passEffectsStack(game);
        for (let i = 0; i < objects.length; i++)
          expect(game.state.objects[objects[i]!.objectId]!.zone).toBe(
            i < marked ? (i === 2 ? "banishment" : "graveyard") : "field",
          );
        expect(p.cards(woodlandSquirrels, { zone: "field" })).toHaveLength(1);
        expect(q.cards(woodlandSquirrels, { zone: "field" })).toHaveLength(1);
        expect(p.cards(seasonsEnd, { zone: "graveyard" })).toHaveLength(1);
      });
});
