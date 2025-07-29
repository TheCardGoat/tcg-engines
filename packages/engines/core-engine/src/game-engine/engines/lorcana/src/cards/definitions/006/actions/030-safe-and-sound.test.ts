/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { safeAndSound } from "~/game-engine/engines/lorcana/src/cards/definitions/006/actions";
import { goonsMaleficent } from "../../001/characters/characters";
import { thePhantomBlotShadowyFigure } from "../../007";

describe("Safe And Sound", () => {
  it("Chosen character of yours can’t be challenged until the start of your next turn.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: safeAndSound.cost,
        play: [goonsMaleficent],
        hand: [safeAndSound],
      },
      {
        inkwell: safeAndSound.cost,
        play: [thePhantomBlotShadowyFigure],
      },
    );

    await testEngine.playCard(safeAndSound, { targets: [goonsMaleficent] });
    await testEngine.exertCard(goonsMaleficent);

    await testEngine.passTurn();

    const cardUnderTest = testEngine.getCardModel(goonsMaleficent);
    const challenger = testEngine.getCardModel(thePhantomBlotShadowyFigure);

    expect(cardUnderTest.canBeChallenged(challenger)).toBe(false);

    await testEngine.passTurn();
    await testEngine.exertCard(goonsMaleficent);

    await testEngine.passTurn();

    expect(cardUnderTest.canBeChallenged(challenger)).toBe(true);
  });
});
