import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { tombSweep } from "./tomb-sweep.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers uLuofHw9os-a1
 * @covers uLuofHw9os-a2 */
describe("Tomb Sweep", () => {
  for (const level of [0, 1, 2])
    for (const own of [false, true])
      for (const targetCard of [woodlandSquirrels, fireball])
        it(`banishes ${targetCard.slug} with level=${level}, own=${own}`, () => {
          const champion = grantTestChampionLevel(
              createClassBonusTestChampion(tombSweep, false, "activation-discount"),
              level,
            ),
            cost = level >= 1 ? 1 : 2;
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [tombSweep, woodlandSquirrels, woodlandSquirrels],
                graveyard: [targetCard],
              },
            },
            playerTwo: { champion, zones: { graveyard: [targetCard] } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            owner = own ? p : q,
            target = owner.card(targetCard, { zone: "graveyard" });
          const reservePayment = p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, cost)
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
          const options = { reservePayment, targets: { "target-card": [target.objectId] } },
            before = game.state;
          expect(() =>
            p.activate(tombSweep, { ...options, reservePayment: reservePayment.slice(1) }),
          ).toThrow();
          expect(game.state).toEqual(before);
          expect(() =>
            p.activate(tombSweep, {
              reservePayment,
              targets: { "target-card": [p.card(champion).objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
          p.activate(tombSweep, options);
          expect(p.zone("memory")).toHaveLength(cost);
          expect(game.state.objects[target.objectId]!.zone).toBe("graveyard");
          passEffectsStack(game);
          expect(
            owner.cards(targetCard, { zone: "banishment" }).map((ref) => ref.objectId),
          ).toEqual([target.objectId]);
          expect((own ? q : p).cards(targetCard, { zone: "graveyard" })).toHaveLength(1);
          expect(p.cards(tombSweep, { zone: "graveyard" })).toHaveLength(1);
        });
});
