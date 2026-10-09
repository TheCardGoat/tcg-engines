import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { demolition } from "./demolition.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { stockedOutpost } from "../../RDO/domains/stocked-outpost.ts";
import { prismaticSanctuary } from "../../FTC/domains/prismatic-sanctuary.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers 7iak6hyh6b-a1
 * @covers 7iak6hyh6b-a2
 */
describe("Demolition", () => {
  for (const matching of [false, true])
    for (const owner of ["player-one", "player-two"])
      for (const kind of ["ally", "champion", "domain"] as const) {
        it(`damages ${owner}'s ${kind}, Class Bonus=${matching}`, () => {
          const champion = createClassBonusTestChampion(
              demolition,
              matching,
              "activation-discount",
            ),
            cost = matching ? 2 : 3;
          const field = [giantTortoise, trainingSword, stockedOutpost, prismaticSanctuary];
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field,
                hand: [demolition, ...Array.from({ length: cost }, () => woodlandSquirrels)],
              },
            },
            playerTwo: { champion, zones: { field } },
          });
          const p = game.player("player-one"),
            defender = game.player(owner),
            target = defender.card(
              kind === "ally" ? giantTortoise : kind === "domain" ? stockedOutpost : champion,
            );
          const reservePayment = p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
          for (const invalid of [defender.card(prismaticSanctuary), defender.card(trainingSword)]) {
            const before = game.state;
            expect(() =>
              p.activate(demolition, {
                reservePayment,
                targets: { "target-1": [invalid.objectId] },
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          const before = game.state;
          expect(() =>
            p.activate(demolition, {
              reservePayment: reservePayment.slice(1),
              targets: { "target-1": [target.objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
          p.activate(demolition, { reservePayment, targets: { "target-1": [target.objectId] } });
          expect(game.state.objects[target.objectId]!.damage).toBe(0);
          passEffectsStack(game);
          expect(game.state.objects[target.objectId]!.damage).toBe(kind === "domain" ? 0 : 3);
          if (kind === "domain")
            expect(game.state.objects[target.objectId]!.counters.durability).toBe(1);
          expect(p.zone("memory")).toHaveLength(cost);
        });
      }
});
