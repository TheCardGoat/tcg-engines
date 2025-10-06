/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { goofyFlyingFool } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Goofy - Flying Fool", () => {
  it.skip("Rush (This character can challenge the turn they're played.)", async () => {
    const testEngine = new TestEngine({
      play: [goofyFlyingFool],
    });

    const cardUnderTest = testEngine.getCardModel(goofyFlyingFool);
    expect(cardUnderTest.hasRush).toBe(true);
  });

  it.skip("Evasive (Only characters with Evasive can challenge this character.)", async () => {
    const testEngine = new TestEngine({
      play: [goofyFlyingFool],
    });

    const cardUnderTest = testEngine.getCardModel(goofyFlyingFool);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
