import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { classBonusLeveledChampion } from "../../../testing/class-bonus-level.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { fractalOfMana } from "./fractal-of-mana.ts";

/** @covers szeb8zzj86-a2 */
describe("Fractal of Mana — Class Bonus Empower", () => {
  for (const classBonus of [false, true]) {
    it(`${classBonus ? "empowers 1" : "cannot rest"} with class match=${classBonus}`, () => {
      const { starter } = classBonusLeveledChampion(fractalOfMana, classBonus, 0);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: { champion: starter, zones: { field: [fractalOfMana] } },
        playerTwo: { champion: starter },
      });
      const player = game.player("player-one");
      const source = player.card(fractalOfMana, { zone: "field" });
      if (!classBonus) {
        const before = game.state;
        expect(() => player.activateAbility(source, "szeb8zzj86-a2")).toThrow();
        expect(game.state).toEqual(before);
        return;
      }
      player.activateAbility(source, "szeb8zzj86-a2");
      expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
      expect(game.state.players[player.id]?.states.empower ?? 0).toBe(0);
      passEffectsStack(game);
      expect(game.state.players[player.id]?.states.empower).toBe(1);
    });
  }
});
