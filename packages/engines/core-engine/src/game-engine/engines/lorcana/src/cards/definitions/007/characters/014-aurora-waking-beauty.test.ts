/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  mrSmee,
  rapunzelGiftedWithHealing,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { pawpsicle } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items/items";
import { chienPoImperialSoldier } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";
import {
  auroraWakingBeauty,
  theFamilyMadrigal,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Aurora - Waking Beauty", () => {
  describe("SWEET DREAMS", () => {
    it("should ready the character when you heal your character", async () => {
      const testEngine = new TestEngine({
        inkwell: 5,
        play: [auroraWakingBeauty, chienPoImperialSoldier],
        hand: [rapunzelGiftedWithHealing],
        deck: [mrSmee, mrSmee, mrSmee],
      });

      const auroraModel = testEngine.getCardModel(auroraWakingBeauty);
      const chienModel = testEngine.getCardModel(chienPoImperialSoldier);

      await testEngine.questCard(auroraWakingBeauty);

      await chienModel.updateCardDamage(1);

      await testEngine.playCard(rapunzelGiftedWithHealing);

      await testEngine.resolveTopOfStack({ targets: [chienModel] });

      expect(auroraModel.ready).toBe(true);
      expect(auroraModel.hasQuestRestriction).toBe(true);
      expect(auroraModel.hasChallengeRestriction).toBe(true);
    });

    it("should ready the character when you heal opponent's character", async () => {
      const testEngine = new TestEngine(
        {
          inkwell: 5,
          play: [auroraWakingBeauty, pawpsicle],
        },
        {
          play: [chienPoImperialSoldier],
        },
      );

      const auroraModel = testEngine.getCardModel(auroraWakingBeauty);
      const chienModel = testEngine.getCardModel(chienPoImperialSoldier);

      await testEngine.questCard(auroraWakingBeauty);

      await chienModel.updateCardDamage(1);

      await testEngine.activateCard(pawpsicle);

      await testEngine.acceptOptionalLayer();
      await testEngine.resolveTopOfStack({ targets: [chienModel] }, true);

      expect(auroraModel.ready).toBe(true);
      expect(auroraModel.hasQuestRestriction).toBe(true);
      expect(auroraModel.hasChallengeRestriction).toBe(true);
    });

    it("should not ready the character when you don't heal any damage", async () => {
      const testEngine = new TestEngine(
        {
          inkwell: 5,
          play: [auroraWakingBeauty, pawpsicle],
        },
        {
          play: [chienPoImperialSoldier],
        },
      );

      const auroraModel = testEngine.getCardModel(auroraWakingBeauty);
      const chienModel = testEngine.getCardModel(chienPoImperialSoldier);

      await testEngine.questCard(auroraWakingBeauty);

      await testEngine.activateCard(pawpsicle);

      await testEngine.acceptOptionalLayer();
      await testEngine.resolveTopOfStack({ targets: [chienModel] }, true);

      expect(auroraModel.ready).toBe(false);
      expect(auroraModel.hasQuestRestriction).toBe(false);
      expect(auroraModel.hasChallengeRestriction).toBe(false);
    });

    it("should not ready when opponents heal a character", async () => {
      const testEngine = new TestEngine(
        {
          inkwell: 5,
          play: [chienPoImperialSoldier, pawpsicle],
        },
        {
          play: [auroraWakingBeauty],
        },
      );

      const auroraModel = testEngine.getCardModel(auroraWakingBeauty);
      const chienModel = testEngine.getCardModel(chienPoImperialSoldier);

      await testEngine.tapCard(auroraWakingBeauty);
      await testEngine.setCardDamage(chienModel, 1);

      await testEngine.activateCard(
        pawpsicle,
        {
          acceptOptionalLayer: true,
          targets: [chienModel],
        },
        true,
      );

      expect(auroraModel.ready).toBe(false);
      expect(auroraModel.hasQuestRestriction).toBe(false);
      expect(auroraModel.hasChallengeRestriction).toBe(false);
    });

    it("Singer 5 (This character counts as cost 5 to sing songs.)", async () => {
      const testEngine = new TestEngine({
        play: [auroraWakingBeauty],
        hand: [theFamilyMadrigal],
      });

      const cardUnderTest = testEngine.getCardModel(auroraWakingBeauty);
      const song = testEngine.getCardModel(theFamilyMadrigal);
      expect(cardUnderTest.hasSinger).toBe(true);

      await testEngine.singSong({
        singer: auroraWakingBeauty,
        song: theFamilyMadrigal,
      });

      expect(cardUnderTest.exerted).toBe(true);
      expect(song.zone).toEqual("discard");
    });
  });
});
