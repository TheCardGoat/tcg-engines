import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { trumpSet } from "./trump-set.ts";

/** @covers w7g91ru45w-a1 */
describe("Trump Set — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: trumpSet, discount: 1 });
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { threeOfDiamonds } from "../../RDO/allies/three-of-diamonds.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";

/** @covers w7g91ru45w-a2 */
describe("Trump Set — chosen Suited ally receives conditional turn bonuses", () => {
  for (const matching of [false, true])
    for (const attack of [false, true]) {
      it(`class=${matching}, active attack=${attack}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(trumpSet, matching, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: attack ? "playerTwo" : "playerOne",
          playerOne: {
            champion,
            zones: {
              field: [threeOfDiamonds, giantTortoise],
              hand: [trumpSet, woodlandSquirrels, woodlandSquirrels],
              "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [threeOfDiamonds, giantTortoise],
              "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          ally = p.card(threeOfDiamonds),
          hero = p.card(champion);
        const stat = (property: "power" | "life") =>
          deriveGrandArchiveNumericProperty(game.state.objects[ally.objectId]!, property, {
            program: game.program,
            state: game.state,
            controllerId: p.id,
            bindings: {},
          });
        const beforePower = stat("power"),
          beforeLife = stat("life");
        if (beforePower === undefined || beforeLife === undefined)
          throw new Error("Suited ally must have power and life");
        if (attack) {
          q.declareAttack(q.card(giantTortoise), hero);
          q.pass();
        }
        p.activate(trumpSet, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, matching ? 1 : 2)
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        passEffectsStack(game);
        const before = game.state;
        for (const ids of [
          [],
          [hero.objectId],
          [p.card(giantTortoise).objectId],
          [q.card(threeOfDiamonds).objectId],
        ]) {
          expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
          expect(game.state).toEqual(before);
        }
        answerDecision(game, "resolve-effect-choice", [ally.objectId]);
        passEffectsStack(game);
        expect(stat("power")).toBe(beforePower + (attack ? 3 : 0));
        expect(stat("life")).toBe(beforeLife + (attack ? 3 : 0));
        if (attack) {
          expect(game.state.combat!.targetIds).toEqual([ally.objectId]);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[hero.objectId]!.damage).toBe(0);
          expect(game.state.objects[ally.objectId]!.damage).toBe(1);
        }
        advanceToMain(game, attack ? p.id : q.id);
        expect(stat("power")).toBe(beforePower);
        expect(stat("life")).toBe(beforeLife);
      });
    }
});
