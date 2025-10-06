/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  agustinMadrigalClumsyDad,
  antonioMadrigalAnimalExpert,
  camiloMadrigalPrankster,
  doloresMadrigalEasyListener,
  julietaMadrigalExcellentCook,
} from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";
import { mirabelMadrigalFamilyGatherer } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

describe("Mirabel Madrigal - Family Gatherer", () => {
  describe("**NOT WITHOUT MY FAMILY** You can’t play this character unless you have 5 or more characters in play.", () => {
    it("Can't be played with fewer than 5 characters in play", () => {
      const testEngine = new TestEngine({
        inkwell: mirabelMadrigalFamilyGatherer.cost,
        hand: [mirabelMadrigalFamilyGatherer],
        play: [],
      });

      const cardUnderTest = testEngine.getCardModel(
        mirabelMadrigalFamilyGatherer,
      );
      testEngine.playCard(mirabelMadrigalFamilyGatherer);
      expect(cardUnderTest.zone).toEqual("hand");
    });

    it("Can be played with 5 or more characters in play", () => {
      const testEngine = new TestEngine({
        inkwell: mirabelMadrigalFamilyGatherer.cost,
        hand: [mirabelMadrigalFamilyGatherer],
        play: [
          agustinMadrigalClumsyDad,
          camiloMadrigalPrankster,
          antonioMadrigalAnimalExpert,
          doloresMadrigalEasyListener,
          julietaMadrigalExcellentCook,
        ],
      });

      const cardUnderTest = testEngine.getCardModel(
        mirabelMadrigalFamilyGatherer,
      );

      testEngine.playCard(mirabelMadrigalFamilyGatherer);
      expect(cardUnderTest.zone).toEqual("play");
    });
  });
});
