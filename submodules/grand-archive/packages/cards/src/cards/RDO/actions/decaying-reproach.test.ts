import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { decayingReproach } from "./decaying-reproach.ts";
import { frostlornCaress } from "../../P25/actions/frostlorn-caress.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";

/** @covers qXIKFip2t4-a1 */
/** @covers qXIKFip2t4-a2 */
describe("Decaying Reproach pays opposing wither counters and deals 3 plus twice the payment", () => {
  for (const count of [0, 1, 2, 3, 4])
    for (const split of [false, true])
      for (const ownTarget of [false, true])
        it(`counters=${count}, split=${split}, own target=${ownTarget}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(decayingReproach, false, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [giantTortoise],
                hand: [
                  decayingReproach,
                  ...Array.from({ length: 3 }, () => frostlornCaress),
                  ...Array.from({ length: 18 }, () => woodlandSquirrels),
                ],
              },
            },
            playerTwo: {
              champion,
              zones: { field: [giantTortoise, trainingSword, woodlandSquirrels] },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          const own = p.card(giantTortoise),
            ally = q.card(giantTortoise),
            weapon = q.card(trainingSword);
          const pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          for (const object of [own, ally, weapon]) {
            p.activate(p.cards(frostlornCaress, { zone: "hand" })[0]!, {
              reservePayment: pay(5),
              targets: { "target-1": [object.objectId] },
            });
            passEffectsStack(game);
            expect(game.state.objects[object.objectId]!.counters.wither).toBe(4);
          }
          const target = (ownTarget ? p : q).card(champion);
          const targets = { "target-1": [target.objectId] };
          for (const ids of [
            [own.objectId],
            [q.card(woodlandSquirrels).objectId],
            Array.from({ length: 5 }, () => ally.objectId),
          ]) {
            const before = game.state;
            expect(() =>
              p.activate(decayingReproach, {
                reservePayment: pay(2),
                targets,
                costSelections: [ids],
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          const ids = Array.from({ length: count }, (_, i) =>
            split && i % 2 ? weapon.objectId : ally.objectId,
          );
          p.activate(decayingReproach, { reservePayment: pay(2), targets, costSelections: [ids] });
          expect(game.state.objects[own.objectId]!.counters.wither).toBe(4);
          expect(game.state.objects[ally.objectId]!.counters.wither ?? 0).toBe(
            4 - ids.filter((id) => id === ally.objectId).length,
          );
          expect(game.state.objects[weapon.objectId]!.counters.wither ?? 0).toBe(
            4 - ids.filter((id) => id === weapon.objectId).length,
          );
          expect(game.state.objects[target.objectId]!.damage).toBe(0);
          passEffectsStack(game);
          expect(game.state.objects[target.objectId]!.damage).toBe(3 + 2 * count);
          expect(game.state.objects[(ownTarget ? q : p).card(champion).objectId]!.damage).toBe(0);
        });
});
