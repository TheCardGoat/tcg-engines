import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { grayWolf } from "../allies/gray-wolf.ts";
import { eagerPage } from "../allies/eager-page.ts";
import { cryForHelp } from "./cry-for-help.ts";
/** @covers nIKhHFa0rK-a1 */
describe("Cry for Help redirects only an attack on its controller's champion", () => {
  for (const bonus of [false, true])
    for (const target of ["champion", "ally", "none"] as const)
      it(`class=${bonus}, attacked=${target}`, () => {
        const champion = createClassBonusTestChampion(cryForHelp, bonus, "activation-discount");
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion,
            zones: {
              field: [woodlandSquirrels, giantTortoise],
              hand: [cryForHelp, woodlandSquirrels],
              "main-deck": [woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: { field: [giantTortoise], "main-deck": [woodlandSquirrels] },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(champion),
          rescuer = p.card(woodlandSquirrels, { zone: "field" }),
          other = p.card(giantTortoise),
          attacker = q.card(giantTortoise);
        if (target !== "none") q.declareAttack(attacker, target === "champion" ? hero : other);
        q.pass();
        p.activate(cryForHelp, {
          reservePayment: [
            { kind: "card", cardId: p.card(woodlandSquirrels, { zone: "hand" }).objectId },
          ],
        });
        passEffectsStack(game);
        if (target === "champion") {
          for (const bad of [hero, attacker])
            expect(() => answerDecision(game, "resolve-effect-choice", [bad.objectId])).toThrow();
          answerDecision(game, "resolve-effect-choice", [rescuer.objectId]);
          passEffectsStack(game);
          expect(game.state.combat?.targetIds).toEqual([rescuer.objectId]);
        } else expect(game.state.decision).toBeNull();
        const life = () =>
          deriveGrandArchiveNumericProperty(game.state.objects[rescuer.objectId]!, "life", {
            program: game.program,
            state: game.state,
            controllerId: p.id,
            bindings: {},
          });
        expect(life()).toBe(bonus && target === "champion" ? 2 : 1);
        if (target !== "none") game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[hero.objectId]!.damage).toBe(0);
        expect(game.state.objects[rescuer.objectId]!.zone).toBe(
          target === "champion" && !bonus ? "graveyard" : "field",
        );
        if (bonus && target === "champion") {
          advanceToMain(game, p.id);
          expect(life()).toBe(1);
        }
      });
});
