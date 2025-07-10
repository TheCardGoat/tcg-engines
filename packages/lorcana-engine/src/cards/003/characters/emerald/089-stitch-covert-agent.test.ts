/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { stitchCovertAgent } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Stitch - Covert Agent", () => {
  it.skip("**Evasive** _(Only characters with Evasive can challenge this character.)_**HIDE** While this character is at a location, he gains **Ward**. _(Opponents can't choose them except to challenge.)_", () => {
    const testStore = new TestStore({
      play: [stitchCovertAgent],
    });

    const cardUnderTest = testStore.getCard(stitchCovertAgent);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
