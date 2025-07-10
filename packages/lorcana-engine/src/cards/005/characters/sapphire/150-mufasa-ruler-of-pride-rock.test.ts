/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { mufasaRulerOfPrideRock } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Mufasa - Ruler of Pride Rock", () => {
  it("**A DELICATE BALANCE** When you play this character, exert all cards in your inkwell, then return 2 cards at random from your inkwell to your hand.", () => {
    const testStore = new TestStore({
      inkwell: mufasaRulerOfPrideRock.cost,
      hand: [mufasaRulerOfPrideRock],
    });

    const cardUnderTest = testStore.getCard(mufasaRulerOfPrideRock);
    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack();

    expect(testStore.getZonesCardCount().inkwell).toEqual(
      mufasaRulerOfPrideRock.cost - 2,
    );
    expect(testStore.getZonesCardCount().hand).toEqual(2);
  });

  it("**EVERYTHING THE LIGHT TOUCHES** Whenever this character quests, ready all cards in your inkwell.", () => {
    const testStore = new TestStore({
      inkwell: mufasaRulerOfPrideRock.cost,
      play: [mufasaRulerOfPrideRock],
    });

    const cardUnderTest = testStore.getCard(mufasaRulerOfPrideRock);
    testStore.exertAllInkwell();
    cardUnderTest.quest();
    testStore.resolveTopOfStack({});

    expect(testStore.getAvailableInkwellCardCount()).toEqual(
      mufasaRulerOfPrideRock.cost,
    );
  });
});
