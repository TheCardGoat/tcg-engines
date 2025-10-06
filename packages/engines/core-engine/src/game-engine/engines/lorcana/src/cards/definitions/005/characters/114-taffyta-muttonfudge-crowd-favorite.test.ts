/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { taffytaMuttonfudgeCrowdFavorite } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";
import { rapunzelsTowerSecludedPrison } from "~/game-engine/engines/lorcana/src/cards/definitions/005/locations/locations";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Taffyta Muttonfudge - Crowd Favorite", () => {
  describe("**SHOWSTOPPER** When you play this character, if you have a location in play, each opponent loses 1 lore.", () => {
    it("Has location in play", () => {
      const testStore = new TestStore({
        inkwell: taffytaMuttonfudgeCrowdFavorite.cost,
        hand: [taffytaMuttonfudgeCrowdFavorite],
        play: [rapunzelsTowerSecludedPrison],
      });

      testStore.store.tableStore.getTable("player_two").lore = 5;
      const cardUnderTest = testStore.getCard(taffytaMuttonfudgeCrowdFavorite);
      cardUnderTest.playFromHand();
      testStore.resolveTopOfStack({});
      expect(testStore.getPlayerLore("player_two")).toBe(4);
    });

    it("Doesn't have location in play", () => {
      const testStore = new TestStore({
        inkwell: taffytaMuttonfudgeCrowdFavorite.cost,
        hand: [taffytaMuttonfudgeCrowdFavorite],
      });

      testStore.store.tableStore.getTable("player_two").lore = 5;
      const cardUnderTest = testStore.getCard(taffytaMuttonfudgeCrowdFavorite);
      cardUnderTest.playFromHand();
      testStore.resolveTopOfStack({});
      expect(testStore.getPlayerLore("player_two")).toBe(5);
    });
  });
});
