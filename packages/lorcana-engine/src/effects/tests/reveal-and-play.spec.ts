/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  allCardsById,
  type LorcanitoActionCard,
  type ResolutionAbility,
} from "@lorcanito/lorcana-engine";
import { actionCardMock } from "@lorcanito/lorcana-engine/__mocks__/mockCards";
import { fourDozenEggs } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

const ability: ResolutionAbility = {
  type: "resolution",
  effects: [
    {
      type: "reveal-and-play",
      putInto: "deck",
      target: {
        type: "card",
        value: 1,
        filters: [
          { filter: "type", value: "character" },
          { filter: "owner", value: "self" },
        ],
      },
    },
  ],
};
const testCard: LorcanitoActionCard = {
  ...actionCardMock,
  abilities: [ability],
};

allCardsById[testCard.id] = testCard;

describe("Reveal and Play effect", () => {
  it("Let's player decide whether they want to play or not", () => {
    const testStore = new TestStore({
      inkwell: testCard.cost,
      hand: [testCard],
      deck: [goofyKnightForADay],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", testCard.id);
    const target = testStore.getByZoneAndId("deck", goofyKnightForADay.id);

    cardUnderTest.playFromHand();

    expect(testStore.stackLayers).toHaveLength(1);
    testStore.resolveOptionalAbility();

    expect(target.zone).toBe("play");
    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({ deck: 0 }),
    );
  });

  it("Doesn't play the card if doesn't meet the filter", () => {
    const testStore = new TestStore({
      inkwell: testCard.cost,
      hand: [testCard],
      deck: [fourDozenEggs],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", testCard.id);
    const target = testStore.getByZoneAndId("deck", fourDozenEggs.id);

    cardUnderTest.playFromHand();
    expect(testStore.stackLayers).toHaveLength(0);

    expect(target.zone).toBe("deck");
    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({ deck: 1 }),
    );
  });
});
