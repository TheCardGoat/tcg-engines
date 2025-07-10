/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  daleMischievousRanger,
  gadgetHackwrenchBrilliantBosun,
  honeyLemonChemicalGenius,
  jimHawkinsHonorablePirate,
  sisuInHerElement,
  stitchAlienBuccaneer,
} from "@lorcanito/lorcana-engine/cards/006";
import { fredGiantsized } from "@lorcanito/lorcana-engine/cards/008";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Fred - Giant-Sized", () => {
  it("Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Fred.)", async () => {
    const testEngine = new TestEngine({
      play: [fredGiantsized],
    });

    const cardUnderTest = testEngine.getCardModel(fredGiantsized);
    expect(cardUnderTest.hasShift).toBe(true);
  });

  describe("I LIKE WHERE THIS IS HEADING Whenever this character quests, reveal cards from the top of your deck until you reveal a Floodborn character card. Put that card into your hand and shuffle the rest into your deck.", () => {
    it("Happy Path", async () => {
      const testEngine = new TestEngine({
        play: [fredGiantsized],
        deck: [stitchAlienBuccaneer],
      });

      await testEngine.questCard(fredGiantsized);
      expect(testEngine.getCardModel(stitchAlienBuccaneer).zone).toBe("hand");
      expect(testEngine.getCardModel(stitchAlienBuccaneer).isRevealed).toBe(
        true,
      );
    });

    it("Sad Path", async () => {
      const testEngine = new TestEngine({
        play: [fredGiantsized],
        deck: [sisuInHerElement],
      });

      await testEngine.questCard(fredGiantsized);

      expect(testEngine.getCardModel(sisuInHerElement).zone).toBe("deck");
      expect(testEngine.getCardModel(sisuInHerElement).isRevealed).toBe(false);
    });

    it("Mixed", async () => {
      const beforeElements = [daleMischievousRanger, sisuInHerElement];
      const afterElements = [
        jimHawkinsHonorablePirate,
        honeyLemonChemicalGenius,
      ];
      const testEngine = new TestEngine({
        play: [fredGiantsized],
        deck: [
          gadgetHackwrenchBrilliantBosun,
          ...beforeElements,
          stitchAlienBuccaneer,
          ...afterElements,
        ],
      });

      await testEngine.questCard(fredGiantsized);

      for (const card of [...beforeElements, ...afterElements]) {
        expect(testEngine.getCardModel(card).zone).toBe("deck");
        expect(testEngine.getCardModel(card).isRevealed).toBe(false);
      }

      expect(testEngine.getCardModel(gadgetHackwrenchBrilliantBosun).zone).toBe(
        "deck",
      );
      expect(
        testEngine.getCardModel(gadgetHackwrenchBrilliantBosun).isRevealed,
      ).toBe(false);

      expect(testEngine.getCardModel(stitchAlienBuccaneer).zone).toBe("hand");
      expect(testEngine.getCardModel(stitchAlienBuccaneer).isRevealed).toBe(
        true,
      );
    });
  });
});
