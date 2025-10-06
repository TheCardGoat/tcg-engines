/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { heathcliffStoicButler } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Heathcliff - Stoic Butler", () => {
  it.skip("Ward (Opponents can't choose this character except to challenge.)", async () => {
    const testEngine = new TestEngine({
      play: [heathcliffStoicButler],
    });

    const cardUnderTest = testEngine.getCardModel(heathcliffStoicButler);
    expect(cardUnderTest.hasWard).toBe(true);
  });
});
