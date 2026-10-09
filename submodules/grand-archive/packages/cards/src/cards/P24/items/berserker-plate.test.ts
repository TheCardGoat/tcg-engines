import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { berserkerPlate } from "./berserker-plate.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { breakApart } from "../../P26/actions/break-apart.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers ci00l7pqcx-a1 */
describe("Berserker Plate life", () => {
  for (const classBonus of [false, true])
    it(`adds life only to its matching controller's champion and stops when destroyed, Class Bonus=${classBonus}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(berserkerPlate, classBonus, "floating-memory"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        phase: "materialize",
        playerOne: {
          champion,
          zones: {
            "material-deck": [berserkerPlate],
            memory: [woodlandSquirrels],
            hand: [breakApart, ...Array.from({ length: 5 }, () => woodlandSquirrels)],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: { champion },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(berserkerPlate);
      const life = (id: string) => {
        const player = game.player(id),
          hero = player.card(champion);
        return deriveGrandArchiveNumericProperty(game.state.objects[hero.objectId]!, "life", {
          program: game.program,
          state: game.state,
          controllerId: player.id,
          bindings: {},
        });
      };
      expect(life(p.id)).toBe(15);
      p.materialize(source);
      passEffectsStack(game);
      advanceToMain(game, p.id);
      expect(life(p.id)).toBe(classBonus ? 22 : 15);
      expect(life(q.id)).toBe(15);
      p.activate(breakApart, {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 5)
          .map((ref) => ({ kind: "card", cardId: ref.objectId })),
        targets: { "target-1": [source.objectId] },
      });
      passEffectsStack(game);
      expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
      expect(life(p.id)).toBe(15);
      expect(life(q.id)).toBe(15);
    });
});
