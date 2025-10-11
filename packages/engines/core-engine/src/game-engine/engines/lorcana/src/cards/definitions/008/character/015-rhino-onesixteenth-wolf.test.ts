import { describe, expect, it } from "bun:test";
// Legacy import removed - types available via local definitions
import {
  lafayetteSleepyDachshund,
  rhinoOnesixteenthWolf,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
    const targetCard = testEngine.getCardModel(lafayetteSleepyDachshund);

    await testEngine.playCard(cardToTest);
    await testEngine.resolveTopOfStack({ targets: [targetCard] });

    expect(targetCard.strength).toBe(lafayetteSleepyDachshund.strength - 1);

    testEngine.passTurn();

    expect(targetCard.strength).toBe(lafayetteSleepyDachshund.strength - 1);

    testEngine.passTurn();

    expect(targetCard.strength).toBe(lafayetteSleepyDachshund.strength);
  });
});
