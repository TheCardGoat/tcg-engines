/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  stichtCarefreeSurfer,
  stichtNewDog,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import {
  aladdinBraveRescuer,
  pegasusCloudRacer,
  pegasusGiftForHercules,
} from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";
import {
  kronkHeadOfSecurity,
  liloJuniorCakeDecorator,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Pegasus - Cloud Racer", () => {
  describe("Regression", () => {
    it("Playing a new character should not cancel the effect on existing characters", async () => {
      const cardsInPlay = [aladdinBraveRescuer, kronkHeadOfSecurity];
      const testEngine = new TestEngine(
        {
          inkwell: pegasusCloudRacer.cost + liloJuniorCakeDecorator.cost,
          hand: [pegasusCloudRacer, liloJuniorCakeDecorator],
          play: [...cardsInPlay, pegasusGiftForHercules],
        },
        {
          inkwell: stichtNewDog.cost,
          hand: [stichtNewDog, stichtCarefreeSurfer],
        },
      );

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

      await testEngine.passTurn();

      cardsInPlay.forEach((card) => {
        expect(testEngine.getCardModel(card).hasEvasive).toBe(true);
      });

      await testEngine.playCard(stichtNewDog);
      await testEngine.putIntoInkwell(stichtCarefreeSurfer);

      cardsInPlay.forEach((card) => {
        expect(testEngine.getCardModel(card).hasEvasive).toBe(true);
      });
    });
  });
});
