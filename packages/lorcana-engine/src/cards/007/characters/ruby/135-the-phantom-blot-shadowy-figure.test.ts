/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { thePhantomBlotShadowyFigure } from "@lorcanito/lorcana-engine/cards/007/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("The Phantom Blot - Shadowy Figure", () => {
  it.skip("Rush (This character can challenge the turn they're played.)", async () => {
    const testEngine = new TestEngine({
      play: [thePhantomBlotShadowyFigure],
    });

    const cardUnderTest = testEngine.getCardModel(thePhantomBlotShadowyFigure);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
