/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  kitCloudkickerToughGuy,
  mrSmeeBumblingMate,
} from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import { tipoGrowingSon } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

describe("Kit Cloudkicker - Tough Guy", () => {
  it("**SKYSURFING** When you play this character, you may return chosen opposing character with 2 {S} or less to their player's hand.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: kitCloudkickerToughGuy.cost,
        hand: [kitCloudkickerToughGuy],
      },
      {
        play: [tipoGrowingSon],
      },
    );

    const cardUnderTest = testEngine.getCardModel(kitCloudkickerToughGuy);
    const target = testEngine.getCardModel(tipoGrowingSon);
    cardUnderTest.playFromHand();

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({ targets: [target] });

    expect(testEngine.getCardZone(target)).toBe("hand");
  });

  it("regression check - cannot bounce targets with 3 attack or more", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: kitCloudkickerToughGuy.cost,
        hand: [kitCloudkickerToughGuy],
      },
      {
        play: [mrSmeeBumblingMate],
      },
    );

    const cardUnderTest = testEngine.getCardModel(kitCloudkickerToughGuy);
    cardUnderTest.playFromHand();

    await testEngine.resolveOptionalAbility();

    expect(testEngine.getCardZone(cardUnderTest)).toBe("play");
  });
});
