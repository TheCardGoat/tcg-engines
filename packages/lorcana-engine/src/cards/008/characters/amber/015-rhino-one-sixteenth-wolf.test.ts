/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import type { CardModel } from "@lorcanito/lorcana-engine";
import {
  lafayetteSleepyDachshund,
  rhinoOnesixteenthWolf,
} from "@lorcanito/lorcana-engine/cards/008/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Rhino - One-Sixteenth Wolf", () => {
  it("TINY HOWL When you play this character, chosen opposing character gets -1 {S} until the start of your next turn.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: rhinoOnesixteenthWolf.cost,
        hand: [rhinoOnesixteenthWolf],
      },
      {
        play: [lafayetteSleepyDachshund],
      },
    );

    const cardToTest = testEngine.getCardModel(rhinoOnesixteenthWolf);
    const targetCard: CardModel = testEngine.getCardModel(
      lafayetteSleepyDachshund,
    );

    await testEngine.playCard(cardToTest);
    await testEngine.resolveTopOfStack({ targets: [targetCard] });

    expect(targetCard.strength).toBe(lafayetteSleepyDachshund.strength - 1);

    testEngine.passTurn();

    expect(targetCard.strength).toBe(lafayetteSleepyDachshund.strength - 1);

    testEngine.passTurn();

    expect(targetCard.strength).toBe(lafayetteSleepyDachshund.strength);
  });
});
