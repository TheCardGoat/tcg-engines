import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { evanescentWinds } from "./evanescent-winds.ts";

/** @covers 90i1prp63s-a2 */
describe("Evanescent Winds — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: evanescentWinds });
});
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { deepSeaFractal } from "../../FTC/phantasias/deep-sea-fractal.ts";
import { scepterOfAwakening } from "../items/scepter-of-awakening.ts";
/** @covers 90i1prp63s-a1 */
describe("Evanescent Winds — existing Phantasia allies only", () => {
  for (const matching of [false, true])
    for (const copies of [1, 2])
      it(`class=${matching}, copies=${copies}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(evanescentWinds, matching, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [
                woodlandSquirrels,
                ...Array.from({ length: 3 }, () => deepSeaFractal),
                ...Array.from({ length: 3 }, () => scepterOfAwakening),
              ],
              hand: [
                ...Array.from({ length: copies }, () => evanescentWinds),
                ...Array.from({ length: 14 }, () => woodlandSquirrels),
              ],
              "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [deepSeaFractal, scepterOfAwakening, woodlandSquirrels],
              hand: [woodlandSquirrels, woodlandSquirrels],
              "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const [early, late, last] = p.cards(deepSeaFractal),
          scepters = p.cards(scepterOfAwakening);
        if (!early || !late || !last) throw new Error("Missing phantasias");
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const life = (id: typeof early.objectId) =>
          deriveGrandArchiveNumericProperty(game.state.objects[id]!, "life", {
            program: game.program,
            state: game.state,
            controllerId: p.id,
            bindings: {},
          });
        const animate = (index: number, target: typeof early) => {
          p.activateAbility(scepters[index]!, "2zh208013h-a2", {
            reservePayment: pay(2),
            targets: { "target-phantasia": [target.objectId] },
          });
          passEffectsStack(game);
        };
        p.pass();
        q.activateAbility(scepterOfAwakening, "2zh208013h-a2", {
          reservePayment: q
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          targets: { "target-phantasia": [q.card(deepSeaFractal).objectId] },
        });
        passEffectsStack(game);
        animate(0, early);
        expect(life(early.objectId)).toBe(3);
        p.activate(p.cards(evanescentWinds, { zone: "hand" })[0]!, { reservePayment: pay(2) });
        passEffectsStack(game);
        expect(life(early.objectId)).toBe(5);
        expect(life(q.card(deepSeaFractal).objectId)).toBe(3);
        expect(life(p.card(woodlandSquirrels, { zone: "field" }).objectId)).toBe(1);
        animate(1, late);
        expect(life(late.objectId)).toBe(3);
        if (copies === 2) {
          p.activate(p.cards(evanescentWinds, { zone: "hand" })[0]!, { reservePayment: pay(2) });
          passEffectsStack(game);
        }
        expect(life(early.objectId)).toBe(3 + 2 * copies);
        expect(life(late.objectId)).toBe(copies === 2 ? 5 : 3);
        animate(2, last);
        expect(life(last.objectId)).toBe(3);
        advanceToMain(game, p.id, game.state.turn.number);
        animate(0, early);
        expect(life(early.objectId)).toBe(4);
      });
});
