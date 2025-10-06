/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { jasmineDesertWarrior } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";
import { princeAchmedRivalSuitor } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";

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
