/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { fidgetRatigansHenchman } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Fidget - Ratigan’s Henchman", () => {
  it("", () => {
    const testStore = new TestStore({
      play: [fidgetRatigansHenchman],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      fidgetRatigansHenchman.id,
    );

    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
