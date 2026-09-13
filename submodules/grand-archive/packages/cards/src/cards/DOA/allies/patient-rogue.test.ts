import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import { patientRogue } from "./patient-rogue.ts";
import { woodlandSquirrels } from "./woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain } from "../../../testing/decisions.ts";
/** @covers CvvgJR4fNa-a1 @covers CvvgJR4fNa-a2 */
describe("Patient Rogue's awake stealth and recollection power", () => {
  for (const classBonus of [false, true])
    it(`class=${classBonus}: only awake grants stealth, only own recollection grants power`, () => {
      const champion = createClassBonusTestChampion(
        patientRogue,
        classBonus,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          zones: { field: [patientRogue], "main-deck": [woodlandSquirrels, woodlandSquirrels] },
        },
        playerTwo: {
          champion,
          zones: {
            field: [woodlandSquirrels],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        rogue = p.card(patientRogue);
      const power = () =>
        deriveGrandArchiveNumericProperty(game.state.objects[rogue.objectId]!, "power", {
          program: game.program,
          state: game.state,
          controllerId: p.id,
          bindings: {},
        });
      expect(power()).toBe(0);
      if (classBonus) {
        const before = game.state;
        expect(() => q.declareAttack(woodlandSquirrels, rogue)).toThrow();
        expect(game.state).toEqual(before);
      } else {
        q.declareAttack(woodlandSquirrels, rogue);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[rogue.objectId]!.damage).toBe(1);
      }
      advanceToMain(game, p.id);
      expect(power()).toBe(3);
      p.declareAttack(rogue, q.card(champion));
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(3);
      expect(game.state.objects[rogue.objectId]!.states.has("rested")).toBe(true);
      advanceToMain(game, q.id);
      expect(power()).toBe(0);
      q.declareAttack(woodlandSquirrels, rogue);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[rogue.objectId]!.damage).toBe(1);
      advanceToMain(game, p.id);
      expect(power()).toBe(3);
    });
});
