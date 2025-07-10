/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { scroogeMcduckUncleMoneybags } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Scrooge McDuck - Uncle Moneybags", () => {
  it.skip("TREASURE FINDER  Whenever this character quests, you pay 1 {I} less for the next item you play this turn.", () => {
    const testStore = new TestStore({
      inkwell: scroogeMcduckUncleMoneybags.cost,
      play: [scroogeMcduckUncleMoneybags],
    });

    const cardUnderTest = testStore.getCard(scroogeMcduckUncleMoneybags);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
