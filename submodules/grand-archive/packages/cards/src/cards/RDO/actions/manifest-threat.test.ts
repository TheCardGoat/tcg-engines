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
import { manifestThreat } from "./manifest-threat.ts";

/** @covers jK7LRuTSPh-a1 */
describe("Manifest Threat — debuff or destruction", () => {
  for (const matching of [false, true])
    for (const own of [false, true])
      for (const buffed of [false, true])
        for (const rescue of [false, true]) {
          it(`class=${matching}, own=${own}, initially buffed=${buffed}, response=${rescue}`, () => {
            const champion = enableAllTestElements(
              createClassBonusTestChampion(manifestThreat, matching, "activation-discount"),
            );
            const game = GrandArchiveTestEngine.startFixture({
              playerOne: {
                champion,
                zones: {
                  field: [giantTortoise, exquisiteDessert, exquisiteDessert],
                  hand: [
                    ...Array.from({ length: 4 }, () => manifestThreat),
                    ...Array.from({ length: 16 }, () => woodlandSquirrels),
                  ],
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
            const buff = () =>
              p.activateAbility(p.cards(exquisiteDessert, { zone: "field" })[0]!, "5HPvGPjsD9-a2", {
                targets: { "target-1": [target.objectId] },
                reservePayment: pay(1),
              });
            const cast = () =>
              p.activate(p.cards(manifestThreat, { zone: "hand" })[0]!, {
                targets: { "target-1": [target.objectId] },
                reservePayment: pay(3),
              });
            for (const invalid of [
              p.card(champion),
              p.cards(exquisiteDessert, { zone: "field" })[0]!,
            ]) {
              const before = game.state;
              expect(() =>
                p.activate(p.cards(manifestThreat, { zone: "hand" })[0]!, {
                  targets: { "target-1": [invalid.objectId] },
                  reservePayment: pay(3),
                }),
              ).toThrow();
              expect(game.state).toEqual(before);
            }
            if (buffed) {
              buff();
              passEffectsStack(game);
              cast();
              passEffectsStack(game);
              expect(game.state.objects[target.objectId]!.counters.buff ?? 0).toBe(0);
              expect(game.state.objects[target.objectId]!.counters.debuff ?? 0).toBe(0);
            }
            cast();
            expect(game.state.objects[target.objectId]!.counters.debuff ?? 0).toBe(0);
            passEffectsStack(game);
            expect(game.state.objects[target.objectId]!.counters.debuff).toBe(1);
            cast();
            expect(game.state.objects[target.objectId]!.zone).toBe("field");
            if (rescue) buff();
            passEffectsStack(game);
            if (rescue) {
              expect(game.state.objects[target.objectId]!.zone).toBe("field");
              expect(game.state.objects[target.objectId]!.counters.debuff).toBe(1);
              cast();
              passEffectsStack(game);
            }
            expect(game.state.objects[target.objectId]!.zone).toBe("graveyard");
            expect(game.state.objects[other.objectId]!.zone).toBe("field");
            expect(game.state.objects[other.objectId]!.counters.debuff ?? 0).toBe(0);
          });
        }
});
