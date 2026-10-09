import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { heftyHammering } from "./hefty-hammering.ts";

/** @covers ceqDwfTzFI-a2 */
describe("Hefty Hammering — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: heftyHammering });
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { curvedDagger } from "../../DOA/weapons/curved-dagger.ts";
import { temperedSteel } from "../../DOA/actions/tempered-steel.ts";
import { stockedOutpost } from "../../RDO/domains/stocked-outpost.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import {
  passEffectsStack,
  advanceToMain,
  declareResolvedAttack,
} from "../../../testing/decisions.ts";
/** @covers ceqDwfTzFI-a1 */
describe("Hefty Hammering — maximum weapon durability discount", () => {
  for (const matching of [false, true])
    for (const mode of ["none", "opponent", "one", "split", "tie", "seven", "eight", "spent"])
      it(`uses the greatest own weapon count: class=${matching}, mode=${mode}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(heftyHammering, matching, "activation-discount"),
        );
        const hasWeapon = !["none", "opponent"].includes(mode);
        const additions = mode === "seven" ? 5 : mode === "eight" ? 6 : mode === "tie" ? 1 : 0;
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [
                stockedOutpost,
                ...(hasWeapon ? [trainingSword] : []),
                ...(["split", "tie"].includes(mode) ? [curvedDagger] : []),
              ],
              hand: [
                heftyHammering,
                ...Array.from({ length: additions }, () => temperedSteel),
                ...Array.from({ length: 18 }, () => woodlandSquirrels),
              ],
              banishment: [trainingSword],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: mode === "none" ? [] : [trainingSword, curvedDagger],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(champion),
          foe = q.card(champion);
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
        for (const source of p.cards(temperedSteel, { zone: "hand" })) {
          p.activate(source, {
            reservePayment: pay(1),
            targets: {
              "target-1": [
                p.card(mode === "tie" ? curvedDagger : trainingSword, { zone: "field" }).objectId,
              ],
            },
          });
          passEffectsStack(game);
        }
        if (mode === "spent") {
          p.declareAttack(hero, foe, {
            weaponIds: [p.card(trainingSword, { zone: "field" }).objectId],
          });
          game.resolveCombatWithoutRetaliation();
          advanceToMain(game, p.id, game.state.turn.number);
        }
        const max = !hasWeapon
          ? 0
          : mode === "seven"
            ? 7
            : mode === "eight"
              ? 8
              : mode === "spent"
                ? 1
                : 2;
        if (hasWeapon)
          expect(
            game.state.objects[p.card(trainingSword, { zone: "field" }).objectId]!.counters
              .durability,
          ).toBe(mode === "tie" ? 2 : max);
        const expected = matching ? Math.max(0, 7 - max) : 7;
        const options = { attackAttackerId: hero.objectId };
        const before = game.state;
        if (expected > 0) {
          expect(() =>
            p.activate(heftyHammering, { ...options, reservePayment: pay(expected - 1) }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        expect(() =>
          p.activate(heftyHammering, { ...options, reservePayment: pay(expected + 1) }),
        ).toThrow();
        expect(game.state).toEqual(before);
        const memory = p.zone("memory").length;
        p.activate(heftyHammering, { ...options, reservePayment: pay(expected) });
        expect(p.zone("memory")).toHaveLength(memory + expected);
        passEffectsStack(game);
        declareResolvedAttack(game, hero.objectId, foe.objectId, "Attack with Hefty Hammering");
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[foe.objectId]!.damage).toBe(4 + (mode === "spent" ? 1 : 0));
        expect(p.cards(heftyHammering, { zone: "graveyard" })).toHaveLength(1);
      });
});
