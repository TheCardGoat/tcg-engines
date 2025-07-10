import { describe, expect, it } from "@jest/globals";
import {
  aladdinBraveRescuer,
  pegasusCloudRacer,
  pegasusGiftForHercules,
} from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import {
  kronkHeadOfSecurity,
  liloJuniorCakeDecorator,
} from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Continuous Effect Store", () => {
  it("Should serialize and deserialize correctly", async () => {
    const cardsInPlay = [aladdinBraveRescuer, kronkHeadOfSecurity];
    const testEngine = new TestEngine({
      inkwell: pegasusCloudRacer.cost + liloJuniorCakeDecorator.cost,
      hand: [pegasusCloudRacer, liloJuniorCakeDecorator],
      play: [...cardsInPlay, pegasusGiftForHercules],
    });

    cardsInPlay.forEach((card) => {
      expect(testEngine.getCardModel(card).hasEvasive).toBe(false);
    });

    await testEngine.shiftCard({
      shifter: pegasusCloudRacer,
      shifted: pegasusGiftForHercules,
    });

    cardsInPlay.forEach((card) => {
      expect(testEngine.getCardModel(card).hasEvasive).toBe(true);
    });

    await testEngine.playCard(liloJuniorCakeDecorator);

    cardsInPlay.forEach((card) => {
      expect(testEngine.getCardModel(card).hasEvasive).toBe(true);
    });

    const serialized = testEngine.store.toJSON();

    testEngine.store.sync(serialized);

    cardsInPlay.forEach((card) => {
      expect(testEngine.getCardModel(card).hasEvasive).toBe(true);
    });
  });
});
