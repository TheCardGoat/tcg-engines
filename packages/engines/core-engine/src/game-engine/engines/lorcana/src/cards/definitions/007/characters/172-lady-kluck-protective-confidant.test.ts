import { describe, expect, it } from "bun:test";
import { ladyKluckProtectiveConfidant } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Lady Kluck - Protective Confidant", () => {
  it.skip("Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)", async () => {
    const testEngine = new TestEngine({
      play: [ladyKluckProtectiveConfidant],
    });

    const cardUnderTest = testEngine.getCardModel(ladyKluckProtectiveConfidant);
    expect(cardUnderTest.hasBodyguard).toBe(true);
  });

  it.skip("Ward (Opponents can’t choose this character except to challenge.)", async () => {
    const testEngine = new TestEngine({
      play: [ladyKluckProtectiveConfidant],
    });

    const cardUnderTest = testEngine.getCardModel(ladyKluckProtectiveConfidant);
    expect(cardUnderTest.hasWard).toBe(true);
  });
});
