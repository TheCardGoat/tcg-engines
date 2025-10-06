/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { auroraTranquilPrincess } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";

describe("Aurora - Tranquil Princess", () => {
  it.skip("**Ward** _(Opponents can't choose this character except to challenge.)_", () => {
    const testStore = new TestStore({
      play: [auroraTranquilPrincess],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      auroraTranquilPrincess.id,
    );
    expect(cardUnderTest.hasWard).toBe(true);
  });
});
