/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { olympusWouldBeThatWay } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Olympus Would Be That Way", () => {
  it.skip("Your characters get +3 {S} this turn while challenging a location.", () => {
    const testStore = new TestStore({
      inkwell: olympusWouldBeThatWay.cost,
      hand: [olympusWouldBeThatWay],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      olympusWouldBeThatWay.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
