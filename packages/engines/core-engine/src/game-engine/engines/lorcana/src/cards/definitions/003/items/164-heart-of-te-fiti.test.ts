/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { heartOfTeFiti } from "~/game-engine/engines/lorcana/src/cards/definitions/003/items/items";

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
