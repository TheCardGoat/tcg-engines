/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { skippyEnergeticRabbit } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Skippy - Energetic Rabbit", () => {
  it.skip("**Ward** _(Opponents can't choose this character except to challenge.)_", () => {
    const testStore = new TestStore({
      play: [skippyEnergeticRabbit],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      skippyEnergeticRabbit.id,
    );
    expect(cardUnderTest.hasWard).toBe(true);
  });
});
