import { describe } from "vitest";
import { frostlornCaress } from "./frostlorn-caress.ts";

import { proveChampionActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
/** @covers 4tqbok1g9w-a1 */
describe("frostlornCaress — named champion discount", () => {
  proveChampionActivationDiscount({ card: frostlornCaress, discount: 3, lineageName: "Diao Chan" });
});

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { createLineageTestChampion } from "../../../testing/champion-lineage.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers 4tqbok1g9w-a2 */
describe("Frostlorn Caress — four wither counters", () => {
  for (const own of [false, true])
    for (const item of [false, true])
      it(`puts four counters on a non-champion object: own=${own}, item=${item}`, () => {
        const champion = enableAllTestElements(
          createLineageTestChampion(frostlornCaress, "Diao Chan"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [giantTortoise, trainingSword],
              hand: [frostlornCaress, woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: { champion, zones: { field: [giantTortoise, trainingSword] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          target = (own ? p : q).card(item ? trainingSword : giantTortoise),
          reservePayment = p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
        const before = game.state;
        for (const hero of [p.card(champion), q.card(champion)]) {
          expect(() =>
            p.activate(frostlornCaress, {
              reservePayment,
              targets: { "target-1": [hero.objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        p.activate(frostlornCaress, { reservePayment, targets: { "target-1": [target.objectId] } });
        expect(game.state.objects[target.objectId]!.counters.wither ?? 0).toBe(0);
        passEffectsStack(game);
        expect(game.state.objects[target.objectId]!.counters.wither).toBe(4);
        for (const player of [p, q])
          for (const ref of player.zone("field"))
            if (ref.objectId !== target.objectId)
              expect(game.state.objects[ref.objectId]!.counters.wither ?? 0).toBe(0);
      });
});
