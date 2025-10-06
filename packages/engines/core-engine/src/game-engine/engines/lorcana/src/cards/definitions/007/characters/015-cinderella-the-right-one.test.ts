/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { testCharacterCard } from "@lorcanito/lorcana-engine/__mocks__/createGameMock";
import {
  cinderellaTheRightOne,
  theGlassSlipper,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Cinderella - The Right One", () => {
  describe("IF THE SLIPPER FITS When you play this character, you may put an item card named The Glass Slipper from your discard on the bottom of your deck to gain 3 lore.", () => {
    it("Returning The Glass Slipper", async () => {
      const testEngine = new TestEngine({
        inkwell: cinderellaTheRightOne.cost,
        hand: [cinderellaTheRightOne],
        deck: [testCharacterCard],
        discard: [theGlassSlipper],
      });

      await testEngine.playCard(cinderellaTheRightOne);
      await testEngine.acceptOptionalLayer();
      await testEngine.resolveTopOfStack({
        targets: [theGlassSlipper],
      });

      expect(testEngine.getCardModel(theGlassSlipper).zone).toBe("deck");
      expect(testEngine.getLoreForPlayer()).toBe(3);

      // Asserting it was not added to the top
      await testEngine.drawCard();
      expect(testEngine.getCardModel(theGlassSlipper).zone).toBe("deck");
    });

    it("Not Returning The Glass Slipper", async () => {
      const testEngine = new TestEngine({
        inkwell: cinderellaTheRightOne.cost,
        hand: [cinderellaTheRightOne],
        deck: [testCharacterCard],
        discard: [theGlassSlipper],
      });

      await testEngine.playCard(cinderellaTheRightOne);
      await testEngine.skipTopOfStack();

      expect(testEngine.getCardModel(theGlassSlipper).zone).toBe("discard");
      expect(testEngine.getLoreForPlayer()).toBe(0);

      // Asserting it was not added to the top
      await testEngine.drawCard();
      expect(testEngine.getCardModel(theGlassSlipper).zone).toBe("discard");
    });
  });
});
