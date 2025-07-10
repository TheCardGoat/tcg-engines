/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { mauiHeroToAll } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import {
  madamMimSnake,
  merlinCrab,
} from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Continuous effects", () => {
  it("Continuous effects are removed if card is bounced", async () => {
    const testEngine = new TestEngine({
      play: [mauiHeroToAll],
      hand: [merlinCrab, madamMimSnake],
      inkwell: merlinCrab.cost + madamMimSnake.cost + mauiHeroToAll.cost,
    });

    const cardUnderTest = await testEngine.getCardModel(mauiHeroToAll);
    expect(cardUnderTest.hasChallenger).toBe(false);

    await testEngine.playCard(merlinCrab, { targets: [cardUnderTest] });
    expect(cardUnderTest.hasChallenger).toBe(true);

    await testEngine.playCard(madamMimSnake, {
      targets: [cardUnderTest],
      acceptOptionalLayer: true,
    });

    expect(cardUnderTest.zone).toBe("hand");
    expect(cardUnderTest.hasChallenger).toBe(false);

    await testEngine.playCard(mauiHeroToAll);
    expect(cardUnderTest.hasChallenger).toBe(false);
  });
});
