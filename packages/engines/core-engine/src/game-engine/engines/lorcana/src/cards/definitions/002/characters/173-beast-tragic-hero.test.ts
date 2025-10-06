/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { beastTragicHero } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Beast- Tragic Hero", () => {
  describe("IT’S BETTER THIS WAY** At the start of your turn, if this character has no damage, draw a card. Otherwise, he gets +4 {S} this turn.", () => {
    it("No damage", () => {
      const testEngine = new TestEngine(
        {
          play: [beastTragicHero],
          deck: 3,
        },
        {
          deck: 2,
        },
      );

      const cardUnderTest = testEngine.getCardModel(beastTragicHero);

      testEngine.passTurn();
      testEngine.passTurn();

      expect(testEngine.getZonesCardCount().deck).toBe(1);
      expect(cardUnderTest.strength).toEqual(beastTragicHero.strength);
    });

    it("With Damage", () => {
      const testEngine = new TestEngine(
        {
          play: [beastTragicHero],
          deck: 3,
        },
        {
          deck: 2,
        },
      );

      const cardUnderTest = testEngine.getCardModel(beastTragicHero);
      cardUnderTest.updateCardDamage(1);

      testEngine.passTurn();
      testEngine.passTurn();

      expect(cardUnderTest.strength).toEqual(beastTragicHero.strength + 4);
      expect(testEngine.getZonesCardCount().deck).toBe(2);
    });
  });
});

describe("Regression", () => {
  it("Drawing a card when the character was banished", () => {
    const testEngine = new TestEngine(
      {
        deck: 2,
      },
      {
        play: [beastTragicHero],
        deck: 3,
      },
    );

    const cardUnderTest = testEngine.getCardModel(beastTragicHero);

    cardUnderTest.banish();

    testEngine.passTurn();

    expect(testEngine.getZonesCardCount("player_two")).toEqual(
      expect.objectContaining({
        deck: 2,
        hand: 1,
      }),
    );
  });
});
