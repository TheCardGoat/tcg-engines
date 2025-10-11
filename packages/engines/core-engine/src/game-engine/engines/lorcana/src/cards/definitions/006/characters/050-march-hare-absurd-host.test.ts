import { describe, expect, it } from "bun:test";
import { marchHareAbsurdHost } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("March Hare - Absurd Host", () => {
  it.skip("Rush (This character can challenge the turn they're played.)", async () => {
    const testEngine = new TestEngine({
      play: [marchHareAbsurdHost],
    });

    const cardUnderTest = testEngine.getCardModel(marchHareAbsurdHost);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
