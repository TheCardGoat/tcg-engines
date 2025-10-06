/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { zazuAdvisorToMufasa } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

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
