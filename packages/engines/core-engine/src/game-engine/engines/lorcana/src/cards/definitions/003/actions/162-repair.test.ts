/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { repair } from "@lorcanito/lorcana-engine/cards/003/actions/actions.ts";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore.ts";

describe("Repair", () => {
  it.skip("Remove up to 3 damage from one of your locations or characters.", () => {
    const testStore = new TestStore({
      inkwell: repair.cost,
      hand: [repair],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", repair.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
