/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { quickPatch } from "@lorcanito/lorcana-engine/cards/003/actions/actions.ts";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore.ts";

describe("Quick Patch", () => {
  it.skip("Remove up to 3 damage from chosen location.", () => {
    const testStore = new TestStore({
      inkwell: quickPatch.cost,
      hand: [quickPatch],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", quickPatch.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
