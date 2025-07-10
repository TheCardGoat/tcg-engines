/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { heathcliffStoicButler } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Heathcliff - Stoic Butler", () => {
  it.skip("Ward (Opponents can't choose this character except to challenge.)", async () => {
    const testEngine = new TestEngine({
      play: [heathcliffStoicButler],
    });

    const cardUnderTest = testEngine.getCardModel(heathcliffStoicButler);
    expect(cardUnderTest.hasWard).toBe(true);
  });
});
