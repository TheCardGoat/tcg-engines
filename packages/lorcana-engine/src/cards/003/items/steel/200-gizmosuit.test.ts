/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { gizmosuit } from "@lorcanito/lorcana-engine/cards/003/items/items";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Gizmosuit", () => {
  it.skip("**CYBERNETIC ARMOR** Banish this item – Chosen character gains **Resist** +2 until the start of your next turn. (Damage dealt to them is reduced by 2.)", () => {
    const testStore = new TestStore({
      inkwell: gizmosuit.cost,
      play: [gizmosuit],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", gizmosuit.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
