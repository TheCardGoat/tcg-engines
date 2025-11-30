import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { thePhantomBlotShadowyFigure } from "./135-the-phantom-blot-shadowy-figure";

describe("The Phantom Blot - Shadowy Figure", () => {
  it.skip("should have Rush ability", () => {
    const testEngine = new TestEngine({
      play: [thePhantomBlotShadowyFigure],
    });

    const cardUnderTest = testEngine.getCardModel(thePhantomBlotShadowyFigure);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
