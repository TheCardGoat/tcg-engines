import { describe, expect, it } from "bun:test";
import { mufasaRulerOfPrideRock } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
