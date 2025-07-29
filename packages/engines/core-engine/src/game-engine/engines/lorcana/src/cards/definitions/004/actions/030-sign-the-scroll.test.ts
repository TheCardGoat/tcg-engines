/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { signTheScroll } from "@lorcanito/lorcana-engine/cards/004/actions/actions.ts";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore.ts";

describe("Sign The Scroll", () => {
  it.skip("Each opponent may chose and discard a chard. For each opponent who doesn't, you gain 2 lore.", () => {
    const testStore = new TestStore({
      inkwell: signTheScroll.cost,
      hand: [signTheScroll],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", signTheScroll.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
