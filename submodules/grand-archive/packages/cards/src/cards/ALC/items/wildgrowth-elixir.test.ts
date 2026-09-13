import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToRecollection, proveAgingPotion } from "../../../testing/aging-potion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";

import { proveBrewPotion } from "../../../testing/brew-potion.ts";
import { fraysia } from "../tokens/fraysia.ts";
import { manaroot } from "../tokens/manaroot.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { wildgrowthElixir } from "./wildgrowth-elixir.ts";

/** @covers tjot4nmxqs-a1 */
describe("wildgrowth-elixir — Brew", () => {
  proveBrewPotion({
    card: wildgrowthElixir,
    reserveCost: 3,
    ingredients: [fraysia, manaroot],
    wrongIngredients: [fraysia, woodlandSquirrels],
  });
});

/** @covers tjot4nmxqs-a2 */
describe("Wildgrowth Elixir — aging", () => {
  proveAgingPotion({ card: wildgrowthElixir });
});

/** @covers tjot4nmxqs-a3 */
describe("Wildgrowth Elixir — sacrifice for buff counters", () => {
  for (const age of [0, 2]) {
    it(`uses the ${age} age counters that existed before the sacrifice`, () => {
      const champion = createClassBonusTestChampion(wildgrowthElixir, true, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [wildgrowthElixir, woodlandSquirrels],
            "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: { "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels) },
        },
      });
      const player = game.player("player-one");
      const potion = player.card(wildgrowthElixir, { zone: "field" });
      const ally = player.card(woodlandSquirrels, { zone: "field" });
      for (let turn = 0; turn < age; turn++) {
        advanceToRecollection(game, "player-one");
        passEffectsStack(game);
      }
      expect(game.state.objects[potion.objectId]?.counters["named:age"] ?? 0).toBe(age);
      player.activateAbility(potion, "tjot4nmxqs-a3", { targets: { "target-1": [ally.objectId] } });
      expect(player.cards(wildgrowthElixir, { zone: "field" })).toHaveLength(0);
      expect(game.state.objects[ally.objectId]?.counters.buff ?? 0).toBe(0);
      passEffectsStack(game);
      expect(game.state.objects[ally.objectId]?.counters.buff ?? 0).toBe(age);
      expect(
        game.state.objects[player.card(champion, { zone: "field" }).objectId]?.counters.buff ?? 0,
      ).toBe(0);
    });
  }
});
