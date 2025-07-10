/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  allCardsById,
  type LorcanitoCharacterCard,
} from "@lorcanito/lorcana-engine";
import { characterCardMock } from "@lorcanito/lorcana-engine/__mocks__/mockCards";
import { singerAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import { wheneverThisCharSings } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
import { hakunaMatata } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

const testCard: LorcanitoCharacterCard = {
  ...characterCardMock,
  abilities: [
    singerAbility(10),
    wheneverThisCharSings({
      name: "TEST",
      effects: [
        {
          type: "move",
          to: "inkwell",
          target: {
            type: "card",
            value: "all",
            filters: [{ filter: "sing", value: "song" }],
          },
        },
      ],
    }),
  ],
};

allCardsById[testCard.id] = testCard;

describe("Filter: 'sing'", () => {
  describe("Value: 'song'", () => {
    it("sing trigger should target the song just sang", () => {
      const testStore = new TestStore({
        play: [testCard],
        hand: [hakunaMatata],
        deck: 1,
      });

      const cardUnderTest = testStore.getCard(testCard);
      const target = testStore.getCard(hakunaMatata);

      cardUnderTest.sing(target);

      expect(target.zone).toEqual("inkwell");
      expect(testStore.getZonesCardCount()).toEqual(
        expect.objectContaining({
          hand: 0,
          deck: 1,
          inkwell: 1,
          play: 1,
        }),
      );
    });
  });
});
