/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { jasmineDesertWarrior } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { princeAchmedRivalSuitor } from "@lorcanito/lorcana-engine/cards/008/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Prince Achmed - Rival Suitor", () => {
  it("UNWELCOME PROPOSAL When you play this character, you may exert chosen Princess character.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: princeAchmedRivalSuitor.cost,
        hand: [princeAchmedRivalSuitor],
      },
      {
        play: [jasmineDesertWarrior],
        hand: [],
      },
    );

    await testEngine.playCard(princeAchmedRivalSuitor, {
      acceptOptionalLayer: true,
      targets: [jasmineDesertWarrior],
    });
    expect(testEngine.getCardModel(jasmineDesertWarrior).exerted).toBe(true);
  });
});
