/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
import { wildcatMechanic } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Wildcat - Mechanic", () => {
  it("**DISASSEMBLE** {E} – Banish chosen item.", () => {
    const testStore = new TestStore({
      play: [wildcatMechanic, pawpsicle],
    });

    const cardUnderTest = testStore.getCard(wildcatMechanic);
    const target = testStore.getCard(pawpsicle);

    cardUnderTest.activate();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.zone).toEqual("discard");
  });
});
