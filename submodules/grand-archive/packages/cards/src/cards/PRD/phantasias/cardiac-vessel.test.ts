import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { cardiacVessel } from "./cardiac-vessel.ts";

/** @covers 5xjzPh6l2M-a1 */
describe("Cardiac Vessel — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: cardiacVessel, discount: 3 });
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { singeingLeap } from "../../PTM/actions/singeing-leap.ts";
import { soothingDisillusion } from "../../AMB/actions/soothing-disillusion.ts";

/** @covers 5xjzPh6l2M-a2
 * @covers 5xjzPh6l2M-a3
 */
describe("Cardiac Vessel — move all damage on entry and restore departure counters", () => {
  for (const matching of [false, true])
    for (const damage of [0, 1, 14, 15, 16]) {
      it(`moves ${damage} damage, applies the draw threshold, and restores counters after destruction: class=${matching}`, () => {
        const base = enableAllTestElements(
          grantTestChampionLevel(
            createClassBonusTestChampion(cardiacVessel, matching, "activation-discount"),
            Math.max(0, damage - 1),
          ),
        );
        const champion = {
          ...base,
          layout: {
            kind: "single-faced" as const,
            face: {
              ...requireSingleFace(base),
              stats: { ...requireSingleFace(base).stats, life: 40 },
            },
          },
        };
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [
                cardiacVessel,
                fireball,
                singeingLeap,
                soothingDisillusion,
                ...Array.from({ length: 15 }, () => woodlandSquirrels),
              ],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: { champion },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(champion),
          vessel = p.card(cardiacVessel);
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        if (damage > 0) {
          p.activate(fireball, {
            targets: { "target-1": [hero.objectId] },
            reservePayment: pay(matching ? 2 : 4),
          });
          passEffectsStack(game);
        }
        expect(game.state.objects[hero.objectId]!.damage).toBe(damage);
        const deck = p.zone("main-deck");
        p.activate(vessel, { reservePayment: pay(matching ? 3 : 6) });
        p.pass();
        q.pass();
        expect(game.state.objects[vessel.objectId]!.zone).toBe("field");
        expect(game.state.objects[hero.objectId]!.damage).toBe(damage);
        passEffectsStack(game);
        expect(game.state.objects[hero.objectId]!.damage).toBe(0);
        expect(game.state.objects[vessel.objectId]!.damage).toBe(damage);
        expect(p.zone("main-deck")).toEqual(damage >= 15 ? deck.slice(1) : deck);
        p.activate(singeingLeap, { reservePayment: pay(1) });
        passEffectsStack(game);
        expect(game.state.objects[hero.objectId]!.damage).toBe(1);
        p.activate(soothingDisillusion, {
          modeIds: ["mode-1"],
          targets: { "target-1": [vessel.objectId] },
          reservePayment: pay(2),
        });
        p.pass();
        q.pass();
        expect(game.state.objects[vessel.objectId]!.zone).toBe("graveyard");
        expect(game.state.objects[vessel.objectId]!.damage).toBe(0);
        expect(game.state.objects[hero.objectId]!.damage).toBe(1);
        passEffectsStack(game);
        expect(game.state.objects[hero.objectId]!.damage).toBe(1 + damage);
        expect(game.state.objects[vessel.objectId]!.damage).toBe(0);
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(0);
        expect(game.state.decision).toBeNull();
        expect(game.state.winnerIds).toEqual([]);
      });
    }
});
