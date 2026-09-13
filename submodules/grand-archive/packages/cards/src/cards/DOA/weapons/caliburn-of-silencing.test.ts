import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { eagerPage } from "../allies/eager-page.ts";
import { caliburnOfSilencing } from "./caliburn-of-silencing.ts";
import { silvieLovedByAll } from "../champions/silvie-loved-by-all.ts";
/** @covers bA3tRrJr2T-a1 */
describe("Caliburn silences the hit champion through the opponent turn even after its last durability", () => {
  for (const bonus of [false, true])
    for (const championHit of [false, true])
      it(`class=${bonus}, champion hit=${championHit}`, () => {
        const champion = createClassBonusTestChampion(
            caliburnOfSilencing,
            bonus,
            "activation-discount",
          ),
          starter = lineageTestChampion("Silvie", 0);
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [caliburnOfSilencing, woodlandSquirrels],
              "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion: starter,
            lineage: [
              lineageTestChampion("Silvie", 1),
              lineageTestChampion("Silvie", 2),
              silvieLovedByAll,
            ],
            zones: {
              field: [woodlandSquirrels, eagerPage],
              "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(champion),
          foe = q.card(starter),
          sword = p.card(caliburnOfSilencing),
          guard = q.card(woodlandSquirrels, { zone: "field" }),
          attacker = p.card(woodlandSquirrels, { zone: "field" });
        const life = () =>
          deriveGrandArchiveNumericProperty(game.state.objects[guard.objectId]!, "life", {
            program: game.program,
            state: game.state,
            controllerId: q.id,
            bindings: {},
          });
        expect(life()).toBe(2);
        p.declareAttack(hero, championHit ? foe : q.card(eagerPage), {
          weaponIds: [sword.objectId],
        });
        passEffectsStack(game);
        if (championHit) {
          answerDecision(game, "resolve-optional-effect", false);
          passEffectsStack(game);
        }
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[sword.objectId]!.zone).toBe("banishment");
        const silenced = bonus && championHit;
        expect(life()).toBe(silenced ? 1 : 2);
        p.declareAttack(attacker, foe);
        passEffectsStack(game);
        if (!silenced) {
          answerDecision(game, "resolve-optional-effect", true);
          passEffectsStack(game);
          expect(game.state.combat?.targetIds).toEqual([guard.objectId]);
        }
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[foe.objectId]!.damage).toBe(
          (championHit ? 1 : 0) + (silenced ? 1 : 0),
        );
        advanceToMain(game, q.id);
        expect(life()).toBe(silenced ? 1 : 2);
        advanceToMain(game, p.id);
        expect(life()).toBe(2);
        p.declareAttack(attacker, foe);
        passEffectsStack(game);
        answerDecision(game, "resolve-optional-effect", true);
        passEffectsStack(game);
        expect(game.state.combat?.targetIds).toEqual([guard.objectId]);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[guard.objectId]!.zone).toBe("field");
        expect(game.state.objects[guard.objectId]!.damage).toBe(1);
      });
});
