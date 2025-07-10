/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  genieOnTheJob,
  geniePowerUnleashed,
  genieTheEverImpressive,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { genieMainAttraction } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
