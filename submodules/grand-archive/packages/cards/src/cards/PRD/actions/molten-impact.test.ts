import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { moltenImpact } from "./molten-impact.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { refurbish } from "../../DOA/actions/refurbish.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 7Pc1aiu3Bq-a1 */
/** @covers 7Pc1aiu3Bq-a2 */
describe("Molten Impact uses the sacrificed weapon's last durability", () => {
  for (const repaired of [false, true])
    for (const used of [false, true])
      for (const ownTarget of [false, true])
        it(`repaired=${repaired}, used=${used}, own target=${ownTarget}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(moltenImpact, false, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [trainingSword, woodlandSquirrels],
                graveyard: [trainingSword],
                hand: [
                  moltenImpact,
                  refurbish,
                  ...Array.from({ length: 7 }, () => woodlandSquirrels),
                ],
              },
            },
            playerTwo: { champion, zones: { field: [trainingSword] } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          const sword = p.card(trainingSword, { zone: "field" });
          const pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          if (repaired) {
            p.activate(refurbish, {
              reservePayment: pay(4),
              targets: { "target-1": [sword.objectId] },
            });
            passEffectsStack(game);
          }
          if (used) {
            p.declareAttack(p.card(champion), q.card(champion), { weaponIds: [sword.objectId] });
            game.resolveCombatWithoutRetaliation();
          }
          const durability = 2 + (repaired ? 2 : 0) - (used ? 1 : 0);
          expect(game.state.objects[sword.objectId]!.counters.durability).toBe(durability);
          const target = (ownTarget ? p : q).card(champion);
          const priorDamage = game.state.objects[target.objectId]!.damage;
          for (const ids of [
            [],
            [q.card(trainingSword).objectId],
            [p.card(woodlandSquirrels, { zone: "field" }).objectId],
            [p.card(trainingSword, { zone: "graveyard" }).objectId],
            [sword.objectId, sword.objectId],
          ]) {
            const before = game.state;
            expect(() =>
              p.activate(moltenImpact, {
                reservePayment: pay(2),
                targets: { "target-1": [target.objectId] },
                costSelections: [ids],
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          p.activate(moltenImpact, {
            reservePayment: pay(2),
            targets: { "target-1": [target.objectId] },
            costSelections: [[sword.objectId]],
          });
          expect(game.state.objects[sword.objectId]!.zone).toBe("banishment");
          expect(game.state.objects[sword.objectId]!.counters.durability ?? 0).toBe(0);
          expect(game.state.objects[target.objectId]!.damage).toBe(priorDamage);
          passEffectsStack(game);
          expect(game.state.objects[target.objectId]!.damage).toBe(priorDamage + 2 + durability);
          expect(game.state.objects[q.card(trainingSword).objectId]!.counters.durability).toBe(2);
        });
});
