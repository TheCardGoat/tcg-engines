/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { princePhillipRoyalExplorer } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Prince Phillip - Royal Explorer", () => {
  it.skip("Ward (Opponents can't choose this character except to challenge.)", async () => {
    const testEngine = new TestEngine({
      play: [princePhillipRoyalExplorer],
    });

    const cardUnderTest = testEngine.getCardModel(princePhillipRoyalExplorer);
    expect(cardUnderTest.hasWard).toBe(true);
  });
});
