import { describe, expect, it } from "bun:test";
import { thePhantomBlotShadowyFigure } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("The Phantom Blot - Shadowy Figure", () => {
  it.skip("Rush (This character can challenge the turn they're played.)", async () => {
    const testEngine = new TestEngine({
      play: [thePhantomBlotShadowyFigure],
    });

    const cardUnderTest = testEngine.getCardModel(thePhantomBlotShadowyFigure);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
