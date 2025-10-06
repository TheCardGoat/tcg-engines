/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { princePhillipRoyalExplorer } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Prince Phillip - Royal Explorer", () => {
  it.skip("Ward (Opponents can't choose this character except to challenge.)", async () => {
    const testEngine = new TestEngine({
      play: [princePhillipRoyalExplorer],
    });

    const cardUnderTest = testEngine.getCardModel(princePhillipRoyalExplorer);
    expect(cardUnderTest.hasWard).toBe(true);
  });
});
