/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { hideAway } from "~/game-engine/engines/lorcana/src/cards/definitions/005/actions";

describe("Hide Away", () => {
  it.skip("Put chosen item or location into its player’s inkwell facedown and exerted.", () => {
    const testStore = new TestStore({
      inkwell: hideAway.cost,
      hand: [hideAway],
    });

    const cardUnderTest = testStore.getCard(hideAway);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
