/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  allCardsById,
  LorcanitoActionCard,
  ResolutionAbility,
} from "@lorcanito/lorcana-engine";
import { actionCardMock } from "@lorcanito/lorcana-engine/__mocks__/mockCards";
import {
  mickeyBraveLittleTailor,
  minnieMouseBelovedPrincess,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { fourDozenEggs } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { theSorcerersHat } from "@lorcanito/lorcana-engine/cards/003/items/items";
import {
  brunoMadrigalUndetectedUncle,
  daisyDuckLovelyLady,
  donaldDuckMusketeerSoldier,
} from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { merlinsCottageTheWizardsHome } from "@lorcanito/lorcana-engine/cards/005/locations/locations";
import { merlinCleverClairvoyant } from "@lorcanito/lorcana-engine/cards/007";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Name a Card Effect", () => {
  describe("Regression", () => {
    it("Name a card effects do not suffer from mutation problems", async () => {
      const testEngine = new TestEngine({
        inkwell: 3,
        deck: [
          goofyKnightForADay,
          mickeyBraveLittleTailor,
          donaldDuckMusketeerSoldier,
          minnieMouseBelovedPrincess,
          daisyDuckLovelyLady,
        ],
        play: [theSorcerersHat],
      });

      await testEngine.activateCard(theSorcerersHat, {
        nameACard: daisyDuckLovelyLady.name,
      });

      expect(testEngine.getCardModel(daisyDuckLovelyLady).zone).toBe("hand");

      await testEngine.tapCard(theSorcerersHat, true);

      await testEngine.activateCard(theSorcerersHat, {
        nameACard: minnieMouseBelovedPrincess.name,
      });

      expect(testEngine.getCardModel(minnieMouseBelovedPrincess).zone).toBe(
        "hand",
      );
    });

    it("Name a card effects do not suffer from mutation problems", async () => {
      const testEngine = new TestEngine({
        deck: [
          goofyKnightForADay,
          mickeyBraveLittleTailor,
          donaldDuckMusketeerSoldier,
          minnieMouseBelovedPrincess,
          daisyDuckLovelyLady,
        ],
        play: [
          merlinCleverClairvoyant,
          brunoMadrigalUndetectedUncle,
          merlinsCottageTheWizardsHome,
          theSorcerersHat,
        ],
      });

      await testEngine.activateCard(brunoMadrigalUndetectedUncle, {
        nameACard: daisyDuckLovelyLady.name,
      });

      expect(testEngine.getCardModel(daisyDuckLovelyLady).zone).toBe("hand");
      expect(testEngine.getPlayerLore()).toEqual(3);

      await testEngine.tapCard(brunoMadrigalUndetectedUncle, true);

      await testEngine.activateCard(brunoMadrigalUndetectedUncle, {
        nameACard: minnieMouseBelovedPrincess.name,
      });

      expect(testEngine.getCardModel(minnieMouseBelovedPrincess).zone).toBe(
        "hand",
      );
      expect(testEngine.getPlayerLore()).toEqual(6);
    });
  });
});
