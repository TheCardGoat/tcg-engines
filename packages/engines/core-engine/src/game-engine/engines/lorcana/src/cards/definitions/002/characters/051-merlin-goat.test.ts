/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { smash } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions";
import { merlinGoat } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Merlin - Goat", () => {
  describe("**HERE I COME!** When you play this character and when he leaves play, gain 1 lore.", () => {
    it("When you play", () => {
      const testStore = new TestStore({
        inkwell: merlinGoat.cost,
        hand: [merlinGoat],
      });

      const cardUnderTest = testStore.getByZoneAndId("hand", merlinGoat.id);

      expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(0);

      cardUnderTest.playFromHand();

      expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(1);
    });

    it("When he leaves play", async () => {
      const testEngine = new TestEngine({
        inkwell: smash.cost,
        hand: [smash],
        play: [merlinGoat],
      });

      await testEngine.playCard(smash);
      await testEngine.resolveTopOfStack({
        targets: [merlinGoat],
      });

      expect(testEngine.getLoreForPlayer()).toEqual(1);
    });
  });
});
