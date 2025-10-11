import { describe, expect, it } from "bun:test";
import { stitchCovertAgent } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Stitch - Covert Agent", () => {
  it.skip("**Evasive** _(Only characters with Evasive can challenge this character.)_**HIDE** While this character is at a location, he gains **Ward**. _(Opponents can't choose them except to challenge.)_", () => {
    const testStore = new TestStore({
      play: [stitchCovertAgent],
    });

    const cardUnderTest = testStore.getCard(stitchCovertAgent);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
