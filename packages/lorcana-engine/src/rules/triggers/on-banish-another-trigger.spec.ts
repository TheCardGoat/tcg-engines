import { describe, expect, it } from "@jest/globals";
/**
 * @jest-environment node
 */
import {
  allCardsById,
  type LorcanitoCharacterCard,
} from "@lorcanito/lorcana-engine";
import { characterCardMock } from "@lorcanito/lorcana-engine/__mocks__/mockCards";
import {
  duringYourTurnWheneverBanishesCharacterInChallenge,
  singerAbility,
} from "@lorcanito/lorcana-engine/abilities/abilities";
import { liloMakingAWish } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { merlinsCottageTheWizardsHome } from "@lorcanito/lorcana-engine/cards/005/locations/locations";
import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

const testCard: LorcanitoCharacterCard = {
  ...characterCardMock,
  abilities: [
    singerAbility(10),
    duringYourTurnWheneverBanishesCharacterInChallenge({
      name: "TEST",
      effects: [drawACard],
    }),
  ],
};

allCardsById[testCard.id] = testCard;

describe("On Banish in a challenge", () => {
  describe("During your turn, whenever this character banishes another character in a challenge, you may draw a card.", () => {
    it("Does not trigger when banishing locations", () => {
      const testStore = new TestStore(
        {
          play: [testCard],
          deck: 1,
        },
        {
          play: [merlinsCottageTheWizardsHome],
        },
      );

      const cardUnderTest = testStore.getCard(testCard);
      const target = testStore.getCard(merlinsCottageTheWizardsHome);

      target.updateCardDamage(
        merlinsCottageTheWizardsHome.willpower - 1,
        "add",
      );

      cardUnderTest.challenge(target);

      expect(testStore.getZonesCardCount()).toEqual(
        expect.objectContaining({
          hand: 0,
          deck: 1,
        }),
      );
    });

    it("Tiggers when banishing characters", () => {
      const testStore = new TestStore(
        {
          play: [testCard],
          deck: 1,
        },
        {
          play: [liloMakingAWish],
        },
      );

      const cardUnderTest = testStore.getCard(testCard);
      const target = testStore.getCard(liloMakingAWish);

      target.updateCardMeta({ exerted: true });
      cardUnderTest.challenge(target);

      expect(testStore.getZonesCardCount()).toEqual(
        expect.objectContaining({
          hand: 1,
          deck: 0,
        }),
      );
    });
  });
});
