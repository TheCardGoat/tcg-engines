import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { dichroicScorch } from "./dichroic-scorch.ts";
import { soultraceTessellation } from "./soultrace-tessellation.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers TlhsnnRhGK-a1 @covers TlhsnnRhGK-a2 */
describe("Dichroic Scorch — additional discard and all-unit sheen removal", () => {
  for (const matching of [false, true])
    for (const distributed of [0, 1, 2, 3])
      it(`class=${matching}, units with sheen=${distributed}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(dichroicScorch, matching, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [
                dichroicScorch,
                fireball,
                ...Array.from({ length: 3 }, () => soultraceTessellation),
                ...Array.from({ length: 12 }, () => woodlandSquirrels),
              ],
              field: [giantTortoise],
              memory: [fireball],
              graveyard: [fireball],
            },
          },
          playerTwo: { champion, zones: { field: [giantTortoise], hand: [fireball] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(champion),
          enemy = q.card(champion),
          ownAlly = p.card(giantTortoise),
          otherAlly = q.card(giantTortoise),
          source = p.card(dichroicScorch),
          discard = p.card(fireball, { zone: "hand" });
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        for (const target of [hero, enemy, ownAlly].slice(0, distributed)) {
          p.activate(p.cards(soultraceTessellation, { zone: "hand" })[0]!, {
            reservePayment: pay(2),
            targets: { "target-unit": [target.objectId] },
          });
          passEffectsStack(game);
          expect(game.state.objects[target.objectId]!.counters["named:sheen"]).toBe(3);
        }
        const before = game.state;
        for (const ids of [
          [],
          [source.objectId],
          [p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId],
          [q.card(fireball).objectId],
          [p.card(fireball, { zone: "graveyard" }).objectId],
          [p.card(fireball, { zone: "memory" }).objectId],
          [discard.objectId, discard.objectId],
        ]) {
          expect(() =>
            p.activate(source, { reservePayment: pay(3), costSelections: [ids] }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        expect(() =>
          p.activate(source, { reservePayment: pay(2), costSelections: [[discard.objectId]] }),
        ).toThrow();
        expect(game.state).toEqual(before);
        p.activate(source, { reservePayment: pay(3), costSelections: [[discard.objectId]] });
        expect(game.state.objects[discard.objectId]!.zone).toBe("graveyard");
        passEffectsStack(game);
        const damage = distributed * 3;
        expect(game.state.objects[hero.objectId]!.damage).toBe(0);
        expect(game.state.objects[enemy.objectId]!.damage).toBe(damage);
        for (const unit of [hero, enemy, ownAlly, otherAlly])
          expect(game.state.objects[unit.objectId]!.counters["named:sheen"] ?? 0).toBe(0);
        for (const ally of [ownAlly, otherAlly]) {
          expect(game.state.objects[ally.objectId]!.zone).toBe(damage >= 6 ? "graveyard" : "field");
          expect(game.state.objects[ally.objectId]!.damage).toBe(damage >= 6 ? 0 : damage);
        }
      });
});
