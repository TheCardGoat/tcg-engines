import { describe, expect, it } from "bun:test";
import { PLAYER_ONE, LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import {
  arielOnHumanLegs,
  friendsOnTheOtherSide,
  stitchNewDog,
} from "@tcg/lorcana-cards/cards/001";

describe("#### 7. ZONES", () => {
  describe("7.2. Deck", () => {
    it("7.2.1. / 7.2.2. A player's deck is where they draw from, and only the count matters while it stays private.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [friendsOnTheOtherSide],
        inkwell: friendsOnTheOtherSide.cost,
        deck: [arielOnHumanLegs, stitchNewDog],
      });

      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
      expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(2);

      expect(testEngine.asPlayerOne().playCard(friendsOnTheOtherSide)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);
      expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(0);
      expect(testEngine.getCardDefinitionIdsInZone("hand", PLAYER_ONE)).toEqual(
        expect.arrayContaining([arielOnHumanLegs.id, stitchNewDog.id]),
      );
    });

    it.skip("7.2.3. / 7.2.3.1. Top-or-bottom reordering of faceup cards needs a tighter real-card harness than this section file has today.", () => {});
  });
});
