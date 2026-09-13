import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { classBonusLeveledChampion } from "../../../testing/class-bonus-level.ts";
import { advanceToMain } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "../../ALC/allies/automated-gardener.ts";
import { eventideSpear } from "./eventide-spear.ts";

/** @covers xjkdokzfd9-a1 */
describe("Eventide Spear — Class Bonus material-deck activation", () => {
  for (const classBonus of [false, true]) {
    it(`${classBonus ? "activates" : "cannot activate"} from the material deck after two rested opponents`, () => {
      const { starter } = classBonusLeveledChampion(eventideSpear, classBonus, 0);
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion: starter,
          zones: {
            "material-deck": [eventideSpear],
            "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion: starter,
          zones: {
            field: [woodlandSquirrels, automatedGardener],
            "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
          },
        },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const own = player.card(starter, { zone: "field" });
      opponent.declareAttack(woodlandSquirrels, own);
      game.resolveCombatWithoutRetaliation();
      opponent.declareAttack(automatedGardener, own);
      game.resolveCombatWithoutRetaliation();
      advanceToMain(game, player.id);
      const card = player.card(eventideSpear, { zone: "material-deck" });
      if (!classBonus) {
        const before = game.state;
        expect(() => player.execute({ move: "activate-card", cardId: card.objectId })).toThrow();
        expect(game.state).toEqual(before);
        return;
      }
      player.execute({ move: "activate-card", cardId: card.objectId });
      expect(game.state.objects[card.objectId]!.zone).toBe("effects-stack");
    });
  }
});
