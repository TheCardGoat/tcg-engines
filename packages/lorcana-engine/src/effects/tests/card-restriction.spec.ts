/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { visionSlab } from "@lorcanito/lorcana-engine/cards/004/items/items";
import {
  luisaMadrigalEntertainingMuscle,
  whiteRabbitRoyalHerald,
} from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Card Restriction Effect", () => {
  describe("Damage Removal Restriction", async () => {
    it("Damage Removal Restriction", async () => {
      const testEngine = new TestEngine(
        {
          play: [whiteRabbitRoyalHerald],
          hand: [visionSlab],
          inkwell: visionSlab.cost,
        },
        {
          play: [luisaMadrigalEntertainingMuscle],
        },
      );

      const ownCharacter = testEngine.getCardModel(whiteRabbitRoyalHerald);
      const opponentsCard = testEngine.getCardModel(
        luisaMadrigalEntertainingMuscle,
      );

      expect(
        testEngine.store.effectStore.getAbilitiesForCard(ownCharacter),
      ).toHaveLength(0);
      expect(
        testEngine.store.effectStore.getAbilitiesForCard(opponentsCard),
      ).toHaveLength(0);

      await testEngine.playCard(visionSlab);

      expect(
        testEngine.store.effectStore.getAbilitiesForCard(ownCharacter).at(0)
          ?.name,
      ).toEqual("TRAPPED!");
      expect(ownCharacter.hasDamageRemovalRestriction).toBeTruthy();
      expect(
        testEngine.store.effectStore.getAbilitiesForCard(opponentsCard).at(0)
          ?.name,
      ).toEqual("TRAPPED!");
      expect(opponentsCard.hasDamageRemovalRestriction).toBeTruthy();
    });
  });
});
