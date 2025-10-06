/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { pawpsicle } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items/items";
import { wildcatMechanic } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";

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
