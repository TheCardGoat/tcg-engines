/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { heartOfTeFiti } from "@lorcanito/lorcana-engine/cards/003/items/items";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Heart of Te Fiti", () => {
  it.skip("**CREATE LIFE** {E}, 2 {I} – Put the top card of your deck into your inkwell facedown and exerted.", () => {
    const testStore = new TestStore({
      inkwell: heartOfTeFiti.cost,
      play: [heartOfTeFiti],
    });

    const cardUnderTest = testStore.getCard(heartOfTeFiti);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
