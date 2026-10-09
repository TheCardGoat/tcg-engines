import type { GrandArchiveObjectId } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import { polishingFlourish } from "./polishing-flourish.ts";
import { soultraceTessellation } from "../../PTM/actions/soultrace-tessellation.ts";
import { rainwovenCrysalis } from "../../PTM/actions/rainwoven-crysalis.ts";
import { ordainedCharisma } from "../../RDO/actions/ordained-charisma.ts";
import { markTheTarget } from "../../DOA/actions/mark-the-target.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { fracturedMemoriesFixture } from "../../../testing/fractured-memories-fixture.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { proveFloatingMemory } from "../../../testing/floating-memory.ts";
/** @covers D79VKF2uOg-a1 */
describe("Polishing Flourish — all sheen on currently controlled units", () => {
  for (const applications of [0, 1, 2])
    for (const borrowed of [false, true])
      for (const response of [false, true])
        it(`own sheen=${applications * 3}, borrowed ally=${borrowed}, response adds sheen=${response}`, () => {
          const { game, p, q, hero, foe, pay } = fracturedMemoriesFixture([
            polishingFlourish,
            rainwovenCrysalis,
            ordainedCharisma,
            markTheTarget,
            ...Array.from({ length: 7 }, () => soultraceTessellation),
            ...Array.from({ length: 6 }, () => woodlandSquirrels),
          ]);
          const ally = p.card(giantTortoise),
            opposingAlly = q.card(giantTortoise);
          p.activate(markTheTarget, {
            reservePayment: pay(1),
            targets: { "target-1": [hero.objectId] },
          });
          passEffectsStack(game);
          p.activate(rainwovenCrysalis, { reservePayment: pay(2) });
          passEffectsStack(game);
          for (const target of [
            foe,
            opposingAlly,
            ...Array.from({ length: applications }, () => [hero, ally]).flat(),
          ]) {
            p.activate(p.cards(soultraceTessellation, { zone: "hand" })[0]!, {
              reservePayment: pay(2),
              targets: { "target-unit": [target.objectId] },
            });
            passEffectsStack(game);
          }
          if (borrowed) {
            p.activate(ordainedCharisma, {
              reservePayment: pay(3),
              targets: { "target-1": [opposingAlly.objectId] },
            });
            passEffectsStack(game);
          }
          const sheen = (id: GrandArchiveObjectId) =>
            game.state.objects[id]?.counters["named:sheen"] ?? 0;
          expect(sheen(hero.objectId)).toBe(applications * 3);
          expect(sheen(ally.objectId)).toBe(applications * 3);
          expect(sheen(foe.objectId)).toBe(3);
          expect(sheen(opposingAlly.objectId)).toBe(3);
          expect(game.state.players[p.id]!.mastery?.counters["named:sheen"]).toBe(2);
          expect(game.state.objects[hero.objectId]?.counters.preparation).toBe(1);
          expect(game.state.objects[hero.objectId]?.damage).toBe(1);
          const before = game.state;
          for (const wrong of [1, 3]) {
            expect(() => p.activate(polishingFlourish, { reservePayment: pay(wrong) })).toThrow();
            expect(game.state).toEqual(before);
          }
          p.activate(polishingFlourish, { reservePayment: pay(2) });
          expect(sheen(hero.objectId)).toBe(applications * 3);
          if (response)
            p.activate(p.cards(soultraceTessellation, { zone: "hand" })[0]!, {
              reservePayment: pay(2),
              targets: { "target-unit": [hero.objectId] },
            });
          passEffectsStack(game);
          expect(sheen(hero.objectId)).toBe(0);
          expect(sheen(ally.objectId)).toBe(0);
          expect(sheen(foe.objectId)).toBe(3);
          expect(sheen(opposingAlly.objectId)).toBe(borrowed ? 0 : 3);
          expect(game.state.players[p.id]!.mastery?.counters["named:sheen"]).toBe(2);
          expect(game.state.objects[hero.objectId]?.counters.preparation).toBe(1);
          expect(game.state.objects[hero.objectId]?.damage).toBe(1);
          expect(game.state.objects[opposingAlly.objectId]?.ownerId).toBe(q.id);
          expect(p.card(polishingFlourish, { zone: "graveyard" })).toBeDefined();
          expect(game.state.decision).toBeNull();
          expect(game.state.stack).toHaveLength(0);
          expect(game.state.winnerIds).toEqual([]);
        });
});
/** @covers D79VKF2uOg-a2 */
describe("Polishing Flourish — Floating Memory", () => proveFloatingMemory(polishingFlourish));
