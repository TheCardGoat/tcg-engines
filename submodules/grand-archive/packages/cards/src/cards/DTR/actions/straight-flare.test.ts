import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { straightFlare } from "./straight-flare.ts";
import { wonderlandsReign } from "../phantasias/wonderlands-reign.ts";
import { twoOfHearts } from "../allies/two-of-hearts.ts";
import { threeOfSpades } from "../allies/three-of-spades.ts";
import { fiveOfSpades } from "../allies/five-of-spades.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 28bjn8g50v-a1 */
describe("Straight Flare — distinct controlled Suited costs", () => {
  for (const variety of ["none", "duplicates", "distinct", "zero"] as const)
    for (const own of [false, true])
      for (const ally of [false, true])
        it(`${variety} costs deal damage to ${own ? "own" : "opposing"} ${ally ? "ally" : "champion"}`, () => {
          const champion = createClassBonusTestChampion(
            straightFlare,
            false,
            "activation-discount",
          );
          const suited =
            variety === "none"
              ? []
              : variety === "duplicates"
                ? [twoOfHearts, twoOfHearts, twoOfHearts]
                : variety === "zero"
                  ? [wonderlandsReign, twoOfHearts]
                  : [twoOfHearts, threeOfSpades, fiveOfSpades];
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [...suited, giantTortoise, trainingSword],
                hand: [straightFlare, fiveOfSpades, woodlandSquirrels, woodlandSquirrels],
                graveyard: [threeOfSpades],
                banishment: [fiveOfSpades],
              },
            },
            playerTwo: {
              champion,
              zones: { field: [twoOfHearts, threeOfSpades, fiveOfSpades, giantTortoise] },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            owner = own ? p : q;
          const target = owner.card(ally ? giantTortoise : champion);
          const payment = p
            .cards(woodlandSquirrels)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          for (const invalid of [
            p.card(trainingSword),
            p.card(threeOfSpades, { zone: "graveyard" }),
            p.card(fiveOfSpades, { zone: "hand" }),
          ]) {
            const before = game.state;
            expect(() =>
              p.activate(straightFlare, {
                targets: { "target-1": [invalid.objectId] },
                reservePayment: payment,
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          const before = game.state;
          expect(() =>
            p.activate(straightFlare, {
              targets: { "target-1": [target.objectId] },
              reservePayment: payment.slice(1),
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
          p.activate(straightFlare, {
            targets: { "target-1": [target.objectId] },
            reservePayment: payment,
          });
          expect(game.state.objects[target.objectId]!.damage).toBe(0);
          passEffectsStack(game);
          expect(game.state.objects[target.objectId]!.damage).toBe(
            variety === "none" ? 1 : variety === "duplicates" ? 2 : variety === "zero" ? 3 : 4,
          );
          expect(p.zone("memory")).toHaveLength(2);
          expect(p.card(straightFlare, { zone: "graveyard" })).toBeDefined();
        });
});
