/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { liloMakingAWish } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { theSorcerersHat } from "~/game-engine/engines/lorcana/src/cards/definitions/003/items/items";
import {
  brunoMadrigalUndetectedUncle,
  luisaMadrigalMagicallyStrongOne,
} from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("The Sorcerer's Hat", () => {
  describe("**INCREDIBLE ENERGY** {E}, 1 {I} − Name a card, then reveal the top card of your deck. If it's the named card, put that card into your hand. Otherwise, put it on the top of your deck.", () => {
    it("Hit", async () => {
      const testEngine = new TestEngine({
        inkwell: 1,
        play: [theSorcerersHat],
        deck: [
          luisaMadrigalMagicallyStrongOne,
          liloMakingAWish,
          brunoMadrigalUndetectedUncle,
        ],
      });

      const bottomCard = testEngine.getCardModel(
        luisaMadrigalMagicallyStrongOne,
      );
      const topCard = testEngine.getCardModel(brunoMadrigalUndetectedUncle);

      await testEngine.activateCard(theSorcerersHat);
      await testEngine.resolveTopOfStack({
        nameACard: topCard.name,
      });

      expect(topCard.zone).toBe("hand");
      expect(bottomCard.zone).toBe("deck");
    });

    it("Miss", async () => {
      const testEngine = new TestEngine({
        inkwell: 1,
        play: [theSorcerersHat],
        deck: [
          luisaMadrigalMagicallyStrongOne,
          liloMakingAWish,
          brunoMadrigalUndetectedUncle,
        ],
      });

      const bottomCard = testEngine.getCardModel(
        luisaMadrigalMagicallyStrongOne,
      );
      const topCard = testEngine.getCardModel(brunoMadrigalUndetectedUncle);

      await testEngine.activateCard(theSorcerersHat);
      await testEngine.resolveTopOfStack({
        nameACard: bottomCard.name,
      });

      expect(topCard.isRevealed).toBe(true);
      expect(topCard.zone).toBe("deck");
      expect(bottomCard.zone).toBe("deck");
    });
  });
});
