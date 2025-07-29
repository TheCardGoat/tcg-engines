/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { bestowAGift } from "@lorcanito/lorcana-engine/cards/003/actions/actions.ts";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore.ts";

describe("Bestow a Gift", () => {
  it.skip("Move 1 damage counter from chosen character to chosen opposing character.", () => {
    const testStore = new TestStore({
      inkwell: bestowAGift.cost,
      hand: [bestowAGift],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", bestowAGift.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
