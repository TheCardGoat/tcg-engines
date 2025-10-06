/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { skippyEnergeticRabbit } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
