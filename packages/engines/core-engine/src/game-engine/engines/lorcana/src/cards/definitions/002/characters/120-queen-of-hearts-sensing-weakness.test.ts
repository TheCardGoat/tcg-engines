import { describe, expect, it } from "bun:test";
import {
  caterpillarCalmAndCollected,
  hiramFlavershamToymaker,
  jasmineHeirOfAgrabah,
  queenOfHeartsSensingWeakness,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import { hiddenCoveTranquilHaven } from "~/game-engine/engines/lorcana/src/cards/definitions/004/locations";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Queen of Hearts - Sensing Weakness", () => {
  it("Shift", () => {
    const testStore = new TestStore({
      play: [queenOfHeartsSensingWeakness],
      deck: 5,
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      queenOfHeartsSensingWeakness.id,
    );

    expect(cardUnderTest.hasShift()).toEqual(true);
  });

  describe("**LET THE GAME BEGIN** Whenever one of your characters challenges another character, you may draw a card.", () => {
    it("Challenges another character", async () => {
      const testEngine = new TestEngine(
        {
          deck: 5,
          play: [
            queenOfHeartsSensingWeakness,
            caterpillarCalmAndCollected,
            jasmineHeirOfAgrabah,
          ],
        },
        {
          play: [hiramFlavershamToymaker],
        },
      );

      const defender = testEngine.getCardModel(hiramFlavershamToymaker);
      await testEngine.tapCard(defender);

      const attackerOne = testEngine.getCardModel(caterpillarCalmAndCollected);
      const attackerTwo = testEngine.getCardModel(jasmineHeirOfAgrabah);

      await testEngine.challenge({ attacker: attackerOne, defender });
      await testEngine.resolveOptionalAbility();
      expect(testEngine.getZonesCardCount()).toEqual(
        expect.objectContaining({ hand: 1, deck: 4 }),
      );

      await testEngine.challenge({ attacker: attackerTwo, defender });
      await testEngine.resolveOptionalAbility();
      expect(testEngine.getZonesCardCount()).toEqual(
        expect.objectContaining({ hand: 2, deck: 3 }),
      );
    });

    it("Challenges a location", async () => {
      const testEngine = new TestEngine(
        {
          deck: 5,
          play: [queenOfHeartsSensingWeakness, caterpillarCalmAndCollected],
        },
        {
          play: [hiddenCoveTranquilHaven],
        },
      );

      await testEngine.challenge({
        attacker: caterpillarCalmAndCollected,
        defender: hiddenCoveTranquilHaven,
      });

      expect(testEngine.stackLayers).toHaveLength(0);
      expect(testEngine.getZonesCardCount()).toEqual(
        expect.objectContaining({ hand: 0, deck: 5 }),
      );
    });
  });
});
