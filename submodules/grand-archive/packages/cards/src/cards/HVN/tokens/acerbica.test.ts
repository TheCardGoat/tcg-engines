import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import { acerbica } from "./acerbica.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { disenchant } from "../../P25/actions/disenchant.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 7ax4ywyv19-a1 */
describe("Acerbica lowers only controlled champions and permits negative LV", () => {
  for (const level of [0, 1, 3])
    for (const count of [1, 3])
      it(`level=${level}, own tokens=${count}`, () => {
        const champion = grantTestChampionLevel(
          enableAllTestElements(
            createClassBonusTestChampion(acerbica, false, "activation-discount"),
          ),
          level,
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: Array.from({ length: count }, () => acerbica),
              hand: [
                fireball,
                fireball,
                disenchant,
                ...Array.from({ length: 10 }, () => woodlandSquirrels),
              ],
            },
          },
          playerTwo: { champion, zones: { field: [acerbica, acerbica] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const own = p.card(champion),
          foe = q.card(champion);
        const lv = (id: typeof own.objectId) =>
          deriveGrandArchiveNumericProperty(game.state.objects[id]!, "level", {
            program: game.program,
            state: game.state,
            controllerId: p.id,
            bindings: {},
          });
        expect(lv(own.objectId)).toBe(level - count);
        expect(lv(foe.objectId)).toBe(level - 2);
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const cast = () => {
          p.activate(p.cards(fireball, { zone: "hand" })[0]!, {
            reservePayment: pay(4),
            targets: { "target-1": [foe.objectId] },
          });
          passEffectsStack(game);
        };
        cast();
        expect(game.state.objects[foe.objectId]!.damage).toBe(Math.max(0, 1 + level - count));
        p.activate(disenchant, {
          reservePayment: pay(2),
          targets: { "target-1": [p.cards(acerbica, { zone: "field" })[0]!.objectId] },
        });
        passEffectsStack(game);
        expect(p.cards(acerbica, { zone: "field" })).toHaveLength(count - 1);
        expect(lv(own.objectId)).toBe(level - count + 1);
        expect(lv(foe.objectId)).toBe(level - 2);
        cast();
        expect(game.state.objects[foe.objectId]!.damage).toBe(
          Math.max(0, 1 + level - count) + Math.max(0, 2 + level - count),
        );
      });
});
