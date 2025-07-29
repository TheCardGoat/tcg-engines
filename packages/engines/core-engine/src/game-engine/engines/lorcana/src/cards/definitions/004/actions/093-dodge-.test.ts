/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { dodge } from "@lorcanito/lorcana-engine/cards/004/actions/actions.ts";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore.ts";

describe("Dodge!", () => {
  it.skip("Chosen character gains **Ward** and **Evasive** until the start of your next turn. _(Opponents can't choose them except to challenge. Only characters with Evasive can challenge them.)_", () => {
    const testStore = new TestStore({
      inkwell: dodge.cost,
      hand: [dodge],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", dodge.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
