/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { foodFight } from "~/game-engine/engines/lorcana/src/cards/definitions/005/actions";

describe("Food Fight!", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: foodFight.cost,
      hand: [foodFight],
    });

    const cardUnderTest = testStore.getCard(foodFight);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
