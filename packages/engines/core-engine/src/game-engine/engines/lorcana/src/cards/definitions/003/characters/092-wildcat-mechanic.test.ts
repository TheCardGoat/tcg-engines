/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { pawpsicle } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items";
import { wildcatMechanic } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
