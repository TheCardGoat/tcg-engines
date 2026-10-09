import { describe } from "vitest";
import { shatteringDischarge } from "./shattering-discharge.ts";
import { proveChargedBanishmentActivation } from "../../../testing/charged-banishment-action.ts";
/** @covers uutqo9hm33-a1 @covers uutqo9hm33-a2 */
describe("Shattering Discharge — charged banishment activation", () =>
  proveChargedBanishmentActivation(shatteringDischarge, 1, true));

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { imperialCountermeasure } from "../../RDO/actions/imperial-countermeasure.ts";
/** @covers uutqo9hm33-a3 */
describe("Shattering Discharge — unpreventable champion damage", () => {
  for (const matching of [false, true])
    for (const own of [false, true])
      for (const shield of [false, true])
        it(`class=${matching}, own target=${own}, shield=${shield}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(shatteringDischarge, matching, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
                hand: [
                  shatteringDischarge,
                  fireball,
                  imperialCountermeasure,
                  ...Array.from({ length: 6 }, () => woodlandSquirrels),
                ],
                field: [woodlandSquirrels],
              },
            },
            playerTwo: { champion, zones: { field: [woodlandSquirrels] } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            target = (own ? p : q).card(champion),
            source = p.card(shatteringDischarge);
          const pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          if (shield) {
            p.activate(imperialCountermeasure, {
              reservePayment: pay(1),
              targets: { "target-1": [target.objectId] },
            });
            passEffectsStack(game);
          }
          for (const player of [p, q]) {
            const before = game.state;
            expect(() =>
              p.activate(source, {
                reservePayment: pay(1),
                targets: {
                  "target-1": [player.card(woodlandSquirrels, { zone: "field" }).objectId],
                },
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          p.activate(source, {
            reservePayment: pay(1),
            targets: { "target-1": [target.objectId] },
          });
          expect(game.state.objects[target.objectId]!.damage).toBe(0);
          passEffectsStack(game);
          expect(game.state.objects[target.objectId]!.damage).toBe(2);
          expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
          expect(game.state.objects[source.objectId]!.counters["named:charge"] ?? 0).toBe(0);
          p.activate(fireball, {
            reservePayment: pay(matching ? 2 : 4),
            targets: { "target-1": [target.objectId] },
          });
          passEffectsStack(game);
          expect(game.state.objects[target.objectId]!.damage).toBe(shield ? 2 : 3);
        });
});
