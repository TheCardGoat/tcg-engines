/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { gizmosuit } from "~/game-engine/engines/lorcana/src/cards/definitions/003/items/items";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
