/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { zazuAdvisorToMufasa } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Zazu - Advisor to Mufasa", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: zazuAdvisorToMufasa.cost,
      play: [zazuAdvisorToMufasa],
    });

    const cardUnderTest = testStore.getCard(zazuAdvisorToMufasa);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
