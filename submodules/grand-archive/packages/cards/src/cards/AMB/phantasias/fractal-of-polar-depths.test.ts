import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { classBonusLeveledChampion } from "../../../testing/class-bonus-level.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { inundatingClash } from "../attacks/inundating-clash.ts";
import { fractalOfPolarDepths } from "./fractal-of-polar-depths.ts";

/** @covers 5fnmnpavo4-a2 */
describe("Fractal of Polar Depths — Class Bonus mill", () => {
  for (const classBonus of [false, true]) {
    it(`${classBonus ? "mills X water" : "cannot activate"} with class match=${classBonus}`, () => {
      const { starter } = classBonusLeveledChampion(fractalOfPolarDepths, classBonus, 0);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion: starter,
          zones: {
            field: [fractalOfPolarDepths],
            graveyard: [inundatingClash, inundatingClash, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion: starter,
          zones: { "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels) },
        },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const source = player.card(fractalOfPolarDepths, { zone: "field" });
      const deck = opponent.zone("main-deck");
      if (!classBonus) {
        const before = game.state;
        expect(() =>
          player.activateAbility(source, "5fnmnpavo4-a2", {
            targets: { "target-player": [opponent.id] },
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        return;
      }
      player.activateAbility(source, "5fnmnpavo4-a2", {
        targets: { "target-player": [opponent.id] },
      });
      expect(game.state.objects[source.objectId]!.zone).not.toBe("field");
      passEffectsStack(game);
      expect(opponent.zone("graveyard").length).toBeGreaterThanOrEqual(2);
      expect(opponent.zone("main-deck").length).toBe(
        deck.length - opponent.zone("graveyard").length,
      );
    });
  }
});
