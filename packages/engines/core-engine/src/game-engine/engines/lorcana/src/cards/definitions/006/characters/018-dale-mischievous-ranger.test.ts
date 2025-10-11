import { describe, expect, it } from "bun:test";
import {
  liloMakingAWish,
  mauiDemiGod,
  stichtNewDog,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { daleMischievousRanger } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Dale - Mischievous Ranger", () => {
  describe("**NUTS ABOUT PRANKS** When you play this character, you may put the top 3 cards of your deck into your discard to give chosen character -3 {S} until the start of your next turn.", () => {
    it("should put the top 3 cards of your deck into your discard to give chosen character -3 {S} until the start of your next turn", async () => {
      const testEngine = new TestEngine({
        inkwell: daleMischievousRanger.cost,
        deck: [liloMakingAWish, stichtNewDog, mauiDemiGod],
        hand: [daleMischievousRanger],
      });

      const cardUnderTest = testEngine.getCardModel(daleMischievousRanger);
      const topOfDeck = [
        testEngine.getCardModel(liloMakingAWish),
        testEngine.getCardModel(stichtNewDog),
        testEngine.getCardModel(mauiDemiGod),
      ];

      await testEngine.playCard(cardUnderTest);
      await testEngine.resolveOptionalAbility();
      await testEngine.resolveTopOfStack({ targets: [daleMischievousRanger] });

      topOfDeck.forEach((card) => {
        expect(card.zone).toEqual("discard");
      });
      expect(cardUnderTest.strength).toEqual(
        daleMischievousRanger.strength - 3,
      );
    });
  });
});
