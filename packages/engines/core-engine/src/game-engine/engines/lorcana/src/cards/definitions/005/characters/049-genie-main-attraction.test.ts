import { describe, expect, it } from "bun:test";
import {
  genieOnTheJob,
  geniePowerUnleashed,
  genieTheEverImpressive,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { genieMainAttraction } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Genie - Main Attraction", () => {
  it("**SPECTACULAR ENTERTAINER** When this character is exerted, opposing characters cannot ready at the start of your opponents turn.", () => {
    const testStore = new TestStore(
      {
        play: [genieMainAttraction],
        deck: 4,
      },
      {
        play: [genieOnTheJob, genieTheEverImpressive, geniePowerUnleashed],
        deck: 4,
      },
    );

    const cardUnderTest = testStore.getCard(genieMainAttraction);
    const target = testStore.getCard(genieOnTheJob);
    const anotherTarget = testStore.getCard(genieTheEverImpressive);
    const thirdTarget = testStore.getCard(geniePowerUnleashed);

    [cardUnderTest, target, anotherTarget, thirdTarget].forEach((card) => {
      card.updateCardMeta({ exerted: true });
    });

    testStore.passTurn();

    [cardUnderTest, target, anotherTarget, thirdTarget].forEach((card) => {
      expect(card.ready).toBe(false);
    });

    testStore.passTurn();
    cardUnderTest.updateCardMeta({ exerted: true });

    testStore.passTurn();
    [target, anotherTarget, thirdTarget].forEach((card) => {
      expect(card.ready).toBe(false);
    });

    testStore.passTurn();
    testStore.passTurn();

    [cardUnderTest, target, anotherTarget, thirdTarget].forEach((card) => {
      expect(card.ready).toBe(true);
    });
  });
});
